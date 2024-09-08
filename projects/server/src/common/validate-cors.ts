import configService from "@services/config/config.service.js";
import {CorsOptions} from "cors";

// todo: use types from cors?
type CorsCallback = (error: any, something?: true) => void

export function validateOrigin(origin: string, callback: CorsCallback) {
    if (configService.config.general.environment !== "production") {
        return callback(null, true)
    }
    if (configService.config.app.allowedOrigins.includes(origin)) {
        return callback(null, true)
    }

    callback(new Error("Not allowed by CORS"))
}

export const corsOptions: CorsOptions = {
    origin: validateOrigin
}
