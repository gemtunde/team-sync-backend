import { Router } from "express";
import {
  createProjectController,
  getAllProjectInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);
projectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectInWorkspaceController
);
projectRoutes.get(
  "/:projectId/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);
projectRoutes.get(
  "/:projectId/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

export default projectRoutes;
