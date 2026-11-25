import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
    "MONGODB_URI"
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable:${variable}`
        )
    }
}

export const env = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI
}