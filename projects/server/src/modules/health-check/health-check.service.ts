import {DatabaseService} from "@services/database/database.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";

export type HealthStatus = "ok" | "degraded" | "error"

export interface HealthCheckResult {
    status: HealthStatus
    services: {
        database: HealthStatus
        dataStore: HealthStatus
    }
}

export class HealthCheckService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly dataStoreService: DataStoreService
    ) {}

    async runHealthCheck(): Promise<HealthCheckResult> {
        const databaseStatus = await this.databaseService.healthCheck()
        const dataStoreStatus = await this.dataStoreService.healthCheck()
        const allStatuses = [databaseStatus, dataStoreStatus]

        let overallStatus: HealthStatus
        if (allStatuses.includes("error")) {
            overallStatus = "error"
        }
        else if (allStatuses.includes("degraded")) {
            overallStatus = "degraded"
        }
        else {
            overallStatus = "ok"
        }

        return {
            status: overallStatus,
            services: {
                database: databaseStatus,
                dataStore: dataStoreStatus,
            }
        }
    }
}