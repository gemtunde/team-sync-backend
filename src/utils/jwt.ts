import jwt, { SignOptions } from "jsonwebtoken";

import { UserDocument } from "../models/user.model";
import { config } from "../config/app.config";

export type AccessPayload = {
  userId: UserDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  //expiresIn: config.JWT_EXPIRES_IN,
  expiresIn: parseInt(config.JWT_EXPIRES_IN, 10),
  secret: config.JWT_SECRET,
};

export const signJwtToken = (
  payload: AccessPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;

  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};
