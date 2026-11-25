
import asyncHandler from "../../utils/asyncHandler.js";
import { createShortUrl } from "./url.service.js";

const createUrl = asyncHandler(
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

const redirectUrl = asyncHandler(
    async (req, res) => {
        const { shortCode } = req.params;

        const originalUrl = await redirectToOriginalUrl(
            shortCode
        );

        res.redirect(302, originalUrl);
    }
);

export { createUrl, redirectUrl };
