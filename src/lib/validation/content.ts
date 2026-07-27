import { z } from "zod";

export const contentUpdateSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().cuid(),
        value: z.string().max(20000, "That is longer than any block needs to be"),
      }),
    )
    .min(1)
    .max(200),
});

export const contentResetSchema = z.object({ id: z.string().cuid() });
