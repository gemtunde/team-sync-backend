import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../utils/AppError";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user?._id) {
    throw new UnAuthorizedException("UnAuthorized. Please Login");
  }
  next();
};
export default isAuthenticated;
