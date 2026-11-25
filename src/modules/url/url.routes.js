
import { Router } from "express";

import { createUrl } from "./url.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createUrlSchema } from "./url.validation.js";
import { createUrlLimiter } from "../../middlewares/rate-limit.middleware.js";

const urlRoutes = Router();

urlRoutes.post(
    "/",
    createUrlLimiter,
    validate(createUrlSchema),
    createUrl
);

export default urlRoutes;
