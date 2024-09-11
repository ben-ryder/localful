import http, {Server} from "node:http";
import {PumpIt} from "pumpit";
import cors from "cors";
import express, {NextFunction, Request, Response} from "express";
import {ErrorIdentifiers} from "@localful/common";

import {ConfigService} from "@services/config/config.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {DatabaseService} from "@services/database/database.service.js";
import {EmailService} from "@services/email/email.service.js";
import {PasswordService} from "@services/password/password.service.js";
import {TokenService} from "@services/token/token.service.js";
import {BaseHttpController} from "@modules/base/base.http.js";
import {InfoHttpController} from "@modules/info/info.http.js";
import {AuthService} from "@modules/auth/auth.service.js";
import {UsersService} from "@modules/users/users.service.js";
import {AccessControlService} from "@modules/auth/access-control.service.js";
import {UsersDatabaseService} from "@modules/users/database/users.database.service.js";
import {AuthHttpController} from "@modules/auth/auth.http.js";
import {UsersHttpController} from "@modules/users/users.http.js";
import {VaultsDatabaseService} from "@modules/vaults/database/vaults.database.service.js";
import {VaultsService} from "@modules/vaults/vaults.service.js";
import {VaultsHttpController} from "@modules/vaults/vaults.http.js";
import {httpErrorHandler} from "@services/errors/http-error-handler.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {createCorsOptions} from "@common/validate-cors.js";
import {SyncWebsocketController} from "@modules/sync/sync.websockets.js";
import {EventsService} from "@services/events/events.service.js";


/**
 * The main application class which loads the server and all dependencies.
 *
 * --- Dependency Injection ---
 * Dependencies throughout the app don't have any knowledge of the DI system, the logic which defines the dependencies
 * and creates the IoC container is all within this top-level application class.
 * This is useful for things like unit testing as dependencies can be manually injected without having to care
 * about the app wide IoC container.
 *
 * --- Routing ---
 * HttpController classes are defined at the module level with methods to handle different routes, however the
 * actual wiring up of routes is all handled within this application class by binding controller methods to the
 * required routes.
 *
 */
export class Application {
    private readonly container: PumpIt;

    /**
     * Prepare the application, which involves setting up the dependency injection container.
     */
    constructor() {
        this.container = new PumpIt()

        // Global services
        this.container.bindClass(ConfigService, { value: ConfigService}, {scope: "SINGLETON"})
        this.container.bindClass(DataStoreService, { value: DataStoreService, inject: [ConfigService]}, {scope: "SINGLETON"})
        this.container.bindClass(DatabaseService, { value: DatabaseService, inject: [ConfigService]}, {scope: "SINGLETON"})
        this.container.bindClass(EmailService, { value: EmailService, inject: [ConfigService]}, {scope: "SINGLETON"})
        this.container.bindClass(PasswordService, { value: PasswordService}, {scope: "SINGLETON"})
        this.container.bindClass(TokenService, { value: TokenService, inject: [ConfigService, DataStoreService]}, {scope: "SINGLETON"})
        this.container.bindClass(EventsService, { value: EventsService }, {scope: "SINGLETON"})

        // Base module
        this.container.bindClass(BaseHttpController, { value: BaseHttpController}, {scope: "SINGLETON"})

        // Info module
        this.container.bindClass(InfoHttpController, { value: InfoHttpController, inject: [ConfigService]}, {scope: "SINGLETON"})

        // Auth module
        this.container.bindClass(AuthService, { value: AuthService, inject: [UsersService, TokenService, ConfigService, EmailService]}, {scope: "SINGLETON"})
        this.container.bindClass(AccessControlService, { value: AccessControlService, inject: [UsersDatabaseService, TokenService] }, {scope: "SINGLETON"})
        this.container.bindClass(AuthHttpController, { value: AuthHttpController, inject: [AuthService, AccessControlService]}, {scope: "SINGLETON"})

        // Users module
        this.container.bindClass(UsersDatabaseService, { value: UsersDatabaseService, inject: [DatabaseService]}, {scope: "SINGLETON"})
        this.container.bindClass(UsersService, { value: UsersService, inject: [UsersDatabaseService, ConfigService, AccessControlService]}, {scope: "SINGLETON"})
        this.container.bindClass(UsersHttpController, { value: UsersHttpController, inject: [UsersService, TokenService, AccessControlService]}, {scope: "SINGLETON"})

        // Vault module
        this.container.bindClass(VaultsDatabaseService, { value: VaultsDatabaseService, inject: [DatabaseService]}, {scope: "SINGLETON"})
        this.container.bindClass(VaultsService, { value: VaultsService, inject: [VaultsDatabaseService, AccessControlService]}, {scope: "SINGLETON"})
        this.container.bindClass(VaultsHttpController, { value: VaultsHttpController, inject: [VaultsService, AccessControlService]}, {scope: "SINGLETON"})

        // Sync module
        this.container.bindClass(SyncWebsocketController, { value: SyncWebsocketController, inject: [ConfigService, EventsService] }, {scope: "SINGLETON"})
    }

    /**
     * Create and set up the server, running health checks, defining routes etc
     */
    async init(): Promise<Server> {
        // Start by running health checks for external services (Postgres and Redis).
        // This allows any connection errors to be immediately thrown rather than the server being able to start with problems.
        // todo: allow server to start and expose a /health endpoint protected by a static token for monitoring?
        const databaseService = this.container.resolve<DatabaseService>(DatabaseService)
        const dbIsHealth = await databaseService.healthCheck()
        if (!dbIsHealth) {
            console.error("Database service failed health check during initialization, likely a Postgres connection could not be established.")
            process.exit(1);
        }

        const dataStoreService = this.container.resolve<DataStoreService>(DataStoreService)
        const dataStoreIsHealthy = await dataStoreService.healthCheck()
        if (!dataStoreIsHealthy) {
            console.error("Data store service failed health check during initialization, likely a Redis connection could not be established.")
            process.exit(1);
        }
        console.debug("[Server] Health checks passed")

        // Basic Express and HTTP server setup
        const app = express()
        const httpServer = http.createServer(app)
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        // Cors setup
        const configService = this.container.resolve<ConfigService>(ConfigService);
        const corsOptions = createCorsOptions(configService)
        app.use(cors(corsOptions))
        app.options("*", cors(corsOptions))

        // GNU Terry Pratchett (http://www.gnuterrypratchett.com/)
        app.use(function (req: Request, res: Response, next: NextFunction) {
            res.set("X-Clacks-Overhead", "GNU Terry Pratchett");
            next();
        });

        // Load all route controllers
        const baseController = this.container.resolve<BaseHttpController>(BaseHttpController);
        const infoController = this.container.resolve<InfoHttpController>(InfoHttpController);
        const authController = this.container.resolve<AuthHttpController>(AuthHttpController);
        const userController = this.container.resolve<UsersHttpController>(UsersHttpController);
        const vaultController = this.container.resolve<VaultsHttpController>(VaultsHttpController);
        const syncController = this.container.resolve<SyncWebsocketController>(SyncWebsocketController)

        // Base module routes
        app.get("/", baseController.sendWelcomeMessage.bind(baseController))
        app.get("/v1", baseController.sendWelcomeMessage.bind(baseController))

        // Info module routes
        app.get("/info", infoController.getInfo.bind(infoController));

        // Auth module routes
        app.post("/v1/auth/login", authController.login.bind(authController))
        app.post("/v1/auth/logout", authController.logout.bind(authController))
        app.post("/v1/auth/refresh", authController.refresh.bind(authController))
        app.get("/v1/auth/check", authController.check.bind(authController))
        app.get("/v1/auth/verify-email", authController.requestEmailVerification.bind(authController))
        app.post("/v1/auth/verify-email", authController.verifyEmail.bind(authController))
        app.get("/v1/auth/change-email", authController.requestEmailChange.bind(authController))
        app.post("/v1/auth/change-email", authController.changeEmail.bind(authController))
        app.get("/v1/auth/change-password", authController.requestPasswordChange.bind(authController))
        app.post("/v1/auth/change-password", authController.changePassword.bind(authController))

        // Users module routes
        app.get("/v1/users/:userId", userController.getUser.bind(userController))
        app.post("/v1/users", userController.createUser.bind(userController))
        app.patch("/v1/users/:userId", userController.updateUser.bind(userController))
        app.delete("/v1/users/:userId", userController.deleteUser.bind(userController));

        // Vaults module routes
        app.get("/v1/vaults/:vaultId", vaultController.getVault.bind(vaultController))
        app.post("/v1/vaults", vaultController.createVault.bind(vaultController))
        app.patch("/v1/vaults/:vaultId", vaultController.updateVault.bind(vaultController))
        app.delete("/v1/vaults/:vaultId", vaultController.deleteVault.bind(vaultController));

        // Events module websocket server
        await syncController.init({server: httpServer, path: "/v1/events"})

        // Setup HTTP error handlers to serve 404s and server error responses
        app.use(function (req: Request, res: Response, next: NextFunction) {
            res.status(HttpStatusCodes.NOT_FOUND).send({
                identifier: ErrorIdentifiers.NOT_FOUND,
                statusCode: HttpStatusCodes.NOT_FOUND,
                message: "The route you requested could not be found.",
            })
        });
        app.use(httpErrorHandler)

        return httpServer
    }

    /**
     * Retrieve a dependency from the app IoC container.
     */
    getDependency<T>(dependency: any) {
        return this.container.resolve<T>(dependency);
    }
}
