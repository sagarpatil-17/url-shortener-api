
import { Router } from "express";

import { createUrl, redirectUrl } from "./url.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createUrlSchema } from "./url.validation.js";

const urlRoutes = Router();

urlRoutes.post(
    "/",
    validate(createUrlSchema),
    createUrl
);

// Public short URL redirect
urlRoutes.get("/:shortCode", redirectUrl);

export default urlRoutes;
