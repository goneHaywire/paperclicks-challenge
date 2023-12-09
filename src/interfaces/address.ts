import { z } from "zod";

export const Address = z.object({
  street: z.string().min(1),
  city: z.string().min(5),
  zipcode: z.string().min(1),
  geo: z
    .object({
      lat: z.string(),
      lng: z.string(),
    })
    .optional(),
});

export type Address = z.infer<typeof Address>;
