import { nanoid } from "nanoid";
import Url from "./url.model.js";
import ApiError from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

const generateShortCode = () => nanoid(8);

const formatUrlResponse = (url) => ({
    id: url._id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${env.BASE_URL}/${url.shortCode}`,
    clicks: url.clicks,
    expiresAt: url.expiresAt,
    createdAt: url.createdAt,
});

const createShortUrl = async ({
    originalUrl,
    expiresAt,
}) => {
    if (expiresAt && new Date(expiresAt) <= new Date()) {
        throw new ApiError(
            400,
            "Expiration date must be in the future"
        );
    }

    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const url = await Url.create({
                originalUrl,
                shortCode: generateShortCode(),
                expiresAt: expiresAt || null,
            });

            return formatUrlResponse(url);

        } catch (error) {
            if (error.code === 11000 && attempt < MAX_RETRIES) {
                continue;
            }

            if (error.code === 11000) {
                throw new ApiError(
                    503,
                    "Unable to generate a unique short URL. Please try again."
                );
            }

            throw error;
        }
    }
};

const redirectToOriginalUrl = async (shortCode) => {
    const url = await Url.findOneAndUpdate(
        {
            shortCode,
            isActive: true,
        },
        {
            $inc: { clicks: 1 },
        },
        {
            new: true,
            projection: {
                originalUrl: 1,
            },
        }
    );

    if (!url) {
        throw new ApiError(404, "Short URL not found or disabled");
    }

    return url.originalUrl;
};

export { createShortUrl, redirectToOriginalUrl };