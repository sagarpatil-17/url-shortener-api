
import { nanoid } from "nanoid";
import Url from "./url.model.js";
import ApiError from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

const generateShortCode = () => {
    return nanoid(8);
};

const createShortUrl = async ({
    originalUrl,
    customAlias,
    expiresAt,
}) => {
    // Generate a unique short code
    const shortCode = customAlias || generateShortCode();

    // Validate expiration date
    if (expiresAt && new Date(expiresAt) <= new Date()) {
        throw new ApiError(
            400,
            "Expiration date must be in the future"
        );
    }

    // Create URL document
    try {
        const url = await Url.create({
            originalUrl,
            shortCode,
            expiresAt: expiresAt || null,
        });

        return {
            id: url._id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${env.BASE_URL}/${url.shortCode}`,
            expiresAt: url.expiresAt,
            createdAt: url.createdAt,
        };
    } catch (error) {
        // Handle duplicate custom aliases or generated codes
        if (error.code === 11000) {
            throw new ApiError(
                409,
                "This short URL code is already taken"
            );
        }

        throw error;
    }
};

const redirectToOriginalUrl = async (shortCode) => {
    const now = new Date();

    // Find an active URL that has not expired.
    // Increment clicks atomically.
    const url = await Url.findOneAndUpdate(
        {
            shortCode,
            isActive: true,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ],
        },
        {
            $inc: { clicks: 1 },
        },
        {
            new: true,
            projection: { originalUrl: 1, shortCode: 1 },
        }
    );

    if (url) {
        return url.originalUrl;
    }

    // Determine why the URL could not be redirected.
    const existingUrl = await Url.findOne({ shortCode })
        .select("isActive expiresAt");

    if (!existingUrl) {
        throw new ApiError(404, "Short URL not found");
    }

    if (!existingUrl.isActive) {
        throw new ApiError(410, "This short URL is disabled");
    }

    if (
        existingUrl.expiresAt &&
        existingUrl.expiresAt <= now
    ) {
        throw new ApiError(410, "This short URL has expired");
    }

    throw new ApiError(404, "Short URL not available");
};

export { createShortUrl, redirectToOriginalUrl };