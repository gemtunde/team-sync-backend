import { Router } from "express";
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);
taskRoutes.put(
  "/:taskId/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);
taskRoutes.get(
  "/:taskId/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

export default taskRoutes;
