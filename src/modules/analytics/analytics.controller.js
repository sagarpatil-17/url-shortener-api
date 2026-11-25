
import asyncHandler from "../../utils/asyncHandler.js";
import { getUrlAnalytics } from "./analytics.service.js";

export const getAnalytics = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    const analytics = await getUrlAnalytics(shortCode);

    res.status(200).json({
        success: true,
        message: "URL analytics fetched successfully",
        data: analytics,
    });
});
