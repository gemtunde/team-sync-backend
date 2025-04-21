import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../utils/AppError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.log("started transaction....");

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });

      //3 create a workspace for the new user
      const workspace = new WorkspaceModel({
        name: `${user.name} Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      //4 find owner role
      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("owner role not found");
      }

      //5 create a member if owner role is found
      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });
      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log("End session...");

    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingUser = await UserModel.findOne({ email }).session(session);

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    //create an account
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });
    //3 create a workspace for the new user
    const workspace = new WorkspaceModel({
      name: `${user.name} Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    //4 find owner role
    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("owner role not found");
    }
    //5 create a member if owner role is found
    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    console.log("End session...");

    return { userId: user._id, workspaceId: workspace._id };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });

  if (!account) {
    throw new NotFoundException("Invalid email or Password");
  }
  const user = await UserModel.findById(account.userId);
  if (!user) {
    throw new NotFoundException("User not found for thr given email");
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnAuthorizedException("Invalid Email or Password");
  }

  return user.omitPassword();
};
