import { PermissionType } from "../enums/role.enum";
import { UnAuthorizedException } from "./AppError";
import { RolePermission } from "./role-permission";

export const roleGuard = (
  role: keyof typeof RolePermission,
  requiredPermissions: PermissionType[]
) => {
  const permissions = RolePermission[role];

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnAuthorizedException(
      "You do not have the permissions to perform this action "
    );
  }
};
