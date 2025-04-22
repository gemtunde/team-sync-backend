import { z } from "zod";

export const workspaceIdSchema = z
  .string()
  .trim()
  .min(3, { message: "Work space Id is required" });

export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

export const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name is required" })
  .max(255);
export const descriptionSchema = z.string().trim().optional();

export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const updateWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});
