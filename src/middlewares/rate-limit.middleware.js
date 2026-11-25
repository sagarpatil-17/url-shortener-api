
import { rateLimit } from "express-rate-limit";

// Limit URL creation requests
export const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many URL creation requests. Please try again after 15 minutes.",
    },
});

// Limit redirect requests
export const redirectLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many redirect requests. Please try again later.",
    },
});
