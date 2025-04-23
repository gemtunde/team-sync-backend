import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name is required" })
  .max(255);
export const descriptionSchema = z.string().trim().optional();
export const emojiSchema = z.string().trim().optional();

export const createProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
});

export const updateProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
});

export const projectIdSchema = z.string().trim().min(1);
