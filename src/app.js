import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import urlRoutes from './modules/url/url.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

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
app.use(express.json({ limit: "10kb" }));

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

// global error middleware
app.use(errorMiddleware)

export default app;