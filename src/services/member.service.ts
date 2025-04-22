import { ErrorCodeEnumType } from "../enums/error-code.enum";
import MemberModel from "../models/member.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException, UnAuthorizedException } from "../utils/AppError";

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
