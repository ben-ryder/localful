import {ConfigService} from "@services/config/config.service.js";
import {CorsOptions} from "cors";
import {AccessCorsError} from "@services/errors/access/access-cors.error.js";

// todo: use types from cors?
type CorsCallback = (error: any, allow?: boolean) => void

export function createCorsOptions(configService: ConfigService): CorsOptions {
    return {
        origin: (origin: string, callback: CorsCallback) => {
            // Only enable CORS checks in production mode
            if (configService.config.general.environment !== "production") {
                return callback(null, true)
            }

            // Validate the origin header if passed, but also allow no origin so tooling outside the browser can still work.
            if (!origin || configService.config.app.allowedOrigins.includes(origin)) {
                return callback(null, true)
            }

            callback(new AccessCorsError(), false)
        }}
}
