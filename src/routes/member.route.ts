import { Router } from "express";
import { joinWorkspaceByInviteController } from "../controllers/member.controller";

const memberRoutes = Router();

memberRoutes.post(
  "/workspace/:inviteCode/join",
  joinWorkspaceByInviteController
);

export default memberRoutes;
