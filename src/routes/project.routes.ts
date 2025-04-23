import { Router } from "express";
import {
  createProjectController,
  getAllProjectInWorkspaceController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);
projectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectInWorkspaceController
);

export default projectRoutes;
