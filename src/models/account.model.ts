import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";

export interface AccountDocument extends Document {
  provider: ProviderEnumType;
  providerId: string; // store the email, googleId, facebookId, githubId
  userId: mongoose.Types.ObjectId;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  createdAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
  {
    provider: {
      name: String,
      required: true,
      enum: Object.values(ProviderEnum),
    },
    providerId: { name: String, required: true, unique: true },
    userId: {
      name: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: { name: String, default: null },
    tokenExpiry: { name: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  }
);
const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;
