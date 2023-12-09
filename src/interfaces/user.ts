import { z } from "zod";
import { Address } from "./address";

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: Address,
});

export type User = z.infer<typeof userSchema>;

export const validateUser = userSchema.parseAsync;
