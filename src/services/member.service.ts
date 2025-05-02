import { ErrorCodeEnumType } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../utils/AppError";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnAuthorizedException(
      "You are not a member of the workspace",
      ErrorCodeEnumType.ACCESS_UNAUTHORIZED
    );
  }
  const roleName = member.role?.name;

  return {
    role: roleName,
  };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  //find work space by invite

  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or work space");
  }

  //check if user already exists

  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();
  if (existingMember) {
    throw new BadRequestException(
      "You are already a member of this work space"
    );
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER }).exec();
  if (!role) {
    throw new BadRequestException("Role not found");
  }

  //add user to workspace as a member

  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return {
    workspaceId: workspace._id,
    role: role.name,
  };
};
