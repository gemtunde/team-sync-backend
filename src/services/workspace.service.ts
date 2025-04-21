import mongoose from "mongoose";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../utils/AppError";
import { Roles } from "../enums/role.enum";

export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }
  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });

  if (!ownerRole) {
    throw new NotFoundException("owner role not found");
  }
  const workspace = new WorkspaceModel({
    name: name,
    description: description,
    owner: user._id,
  });
  await workspace.save();

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });
  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return {
    workspace,
  };
};

//get All Work spaces User Is Member Service
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const members = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .exec();
  const workspaceUser = members.map((member) => member.workspaceId);
  return {
    workspaceUser,
  };
};
