import mongoose, { Document, Schema } from "mongoose";
import {
  Permissions,
  PermissionType,
  Roles,
  RoleType,
} from "../enums/role.enum";
import { RolePermission } from "../utils/role-permission";

export interface RoleDocument extends Document {
  name: RoleType;
  permission: Array<PermissionType>;
}
const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permission: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermission[this.name];
      },
    },
  },
  {
    timestamps: true,
  }
);
const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);

export default RoleModel;
