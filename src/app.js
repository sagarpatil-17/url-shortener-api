import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import urlRoutes from './modules/url/url.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { redirectUrl } from './modules/url/url.controller.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import { redirectLimiter } from './middlewares/rate-limit.middleware.js';

const app = express();

// security middleware 
app.use(helmet())

// cors configuration 
app.use(cors({
    origin: '*'
}))

// request logging 
app.use(morgan("dev"));

// parse incoming json 
app.use(express.json({
    limit: "10kb",
    strict: true,
    type: ["application/json", "application/*+json"],
}));

// parse url-encoded data 
app.use(express.urlencoded({ extended: true }));

// health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "url_shortener api is running",
        timestamp: new Date().toISOString()
    });
})

// routes 
app.use("/api/v1/urls", urlRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Public short URL redirect
app.get("/:shortCode", redirectLimiter, redirectUrl);

// global error middleware
app.use(errorMiddleware)

export default app;