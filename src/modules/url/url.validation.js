
import { z } from "zod";

export const createUrlSchema = z.object({
    body: z.object({
        originalUrl: z
            .string()
            .trim()
            .url("Please provide a valid URL")
            .max(2048)
            .refine(
                (value) => {
                    try {
                        const parsedUrl = new URL(value);

                        return ["http:", "https:"].includes(
                            parsedUrl.protocol
                        );
                    } catch {
                        return false;
                    }
                },
                {
                    message: "Only HTTP and HTTPS URLs are allowed",
                }
            ),

        expiresAt: z
            .string()
            .datetime()
            .optional(),
    }),
});
