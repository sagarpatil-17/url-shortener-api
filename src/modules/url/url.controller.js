
import asyncHandler from "../../utils/asyncHandler.js";
import { createShortUrl } from "./url.service.js";

export const createUrl = asyncHandler(
    async (req, res) => {
        const { originalUrl, customAlias, expiresAt } = req.body;

        const result = await createShortUrl({
            originalUrl,
            customAlias,
            expiresAt,
        });

        res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            data: result,
        });
    }
);
