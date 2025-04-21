import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
  createWorkspaceService,
  getAllWorkspacesUserIsMemberService,
} from "../services/workspace.service";

export const createWorkSpaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;
    const { workspace } = await createWorkspaceService(userId, body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Work space created successfully",
      workspace,
    });
  }
);

export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { workspaceUser } = await getAllWorkspacesUserIsMemberService(userId);
    res.status(HTTPSTATUS.OK).json({
      message: "Work spaces fetched successfully",
      workspaceUser,
    });
  }
);
