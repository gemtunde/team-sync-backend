import { z } from "zod";

export const inviteSchema = z.object({
  inviteCode: z.string().trim().min(1),
});
