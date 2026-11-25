
import Url from "../url/url.model.js";
import ApiError from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

export const getUrlAnalytics = async (shortCode) => {
    const url = await Url.findOne({ shortCode }).select(
        "originalUrl shortCode clicks isActive createdAt updatedAt"
    );

    if (!url) {
        throw new ApiError(404, "Short URL not found");
    }

    return {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${env.BASE_URL}/${url.shortCode}`,
        totalClicks: url.clicks,
        isActive: url.isActive,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
    };
};
