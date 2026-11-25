
import { Router } from "express";
import { getAnalytics } from "./analytics.controller.js";

const analyticsRoutes = Router();

analyticsRoutes.get("/:shortCode", getAnalytics);

export default analyticsRoutes;
