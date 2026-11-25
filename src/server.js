import app from './app.js';
import connectDB from './config/database.js';
import { env } from './config/env.js';

const startServer = async () => {
    try {
        // connect to database first 
        await connectDB();

        // start server after successful db connection 
        const server = app.listen(env.PORT, () => {
            console.log(`server is running on http://localhost:${env.PORT}`)
        })

        // graceful shutdown 
        const shutdown = (signal) => {
            console.log(`${signal} received. shutting down...`);

            server.close(async () => {
                await import("mongoose").then(({ default: mongoose }) =>
                    mongoose.close()
                )

                console.log("server closed successfully");
                process.exit(0);
            })
        }

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.log('Server connection failed:', error);
        process.exit(1);
    }
}

startServer();