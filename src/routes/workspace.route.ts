import { Router } from "express";
import {
  createWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkSpaceController);
workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

export default workspaceRoutes;
