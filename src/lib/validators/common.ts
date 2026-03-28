import { z } from "zod";

/** Reusable field schemas. */
export const email = z.string().email("Invalid email address");
export const requiredString = z.string().min(1, "This field is required");
export const id = z.string().uuid("Invalid ID format");

/** Pagination params schema. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
