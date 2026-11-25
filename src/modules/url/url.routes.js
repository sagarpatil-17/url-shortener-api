
import { Router } from "express";

import { createUrl } from "./url.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createUrlSchema } from "./url.validation.js";

const urlRoutes = Router();

urlRoutes.post(
    "/",
    validate(createUrlSchema),
    createUrl
);

export default urlRoutes;
