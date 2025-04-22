import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  updateWorkspaceByIdController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkSpaceController);
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);
workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);
workspaceRoutes.get("/:id", getWorkspaceByIdController);
workspaceRoutes.get("/members/:id", getWorkspaceMembersController);
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);

export default workspaceRoutes;
