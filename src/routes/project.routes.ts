import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
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
projectRoutes.put(
  "/:projectId/workspace/:workspaceId/update",
  updateProjectController
);
projectRoutes.delete(
  "/:projectId/workspace/:workspaceId/delete",
  deleteProjectController
);

export default projectRoutes;
