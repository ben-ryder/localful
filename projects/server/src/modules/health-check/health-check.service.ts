import {DatabaseService} from "@services/database/database.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";

export interface HealthCheckResult {
    status: "ok" | "error";
    services: {
        database: boolean
        dataStore: boolean
    }
}

export class HealthCheckService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly dataStoreService: DataStoreService
    ) {}

    async runHealthCheck(): Promise<HealthCheckResult> {
        const databaseIsHealthy = await this.databaseService.healthCheck()
        const dataStoreIsHealthy = await this.dataStoreService.healthCheck()

        const status = databaseIsHealthy && dataStoreIsHealthy
            ? "ok"
            : "error";

        return {
            status,
            services: {
                database: databaseIsHealthy,
                dataStore: dataStoreIsHealthy,
            }
        }
    }
}