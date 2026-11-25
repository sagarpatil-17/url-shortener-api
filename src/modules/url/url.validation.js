
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

        customAlias: z
            .string()
            .trim()
            .min(4)
            .max(20)
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                "Alias can contain letters, numbers, hyphens and underscores"
            )
            .optional(),

        expiresAt: z
            .string()
            .datetime()
            .optional(),
    }),
});
