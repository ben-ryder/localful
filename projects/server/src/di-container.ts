import {PumpIt} from "pumpit";
import {ConfigService} from "@services/config/config.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {DatabaseService} from "@services/database/database.service.js";
import {EmailService} from "@services/email/email.service.js";
import {PasswordService} from "@services/password/password.service.js";
import {TokenService} from "@services/token/token.service.js";
import {BaseController} from "@modules/base/base.http.js";
import {InfoController} from "@modules/info/info.http.js";
import {AuthService} from "@modules/auth/auth.service.js";
import {UsersService} from "@modules/users/users.service.js";
import {AuthController} from "@modules/auth/auth.http.js";
import {UsersDatabaseService} from "@modules/users/database/users.database.service.js";
import {UsersController} from "@modules/users/users.http.js";
import {VaultsService} from "@modules/vaults/vaults.service.js";
import {VaultsDatabaseService} from "@modules/vaults/database/vaults.database.service.js";
import {VaultsController} from "@modules/vaults/vaults.http.js";
import {AccessControlService} from "@modules/auth/access-control.service.js";

/**
 * This file exports the dependency injection container, which is supplied by https://github.com/ivandotv/pumpit.
 *
 * It is the only place in the project which defines the actual relationships between controllers, services etc.
 * This means no knowledge about how dependencies are instantiated needs to leak to the dependencies themselves, which
 * is useful for things like unit testing which can be done by manually injecting dependencies, without having to care
 * about how the whole DI container works.
 *
 */

export const container = new PumpIt()

// Global services
container.bindClass(ConfigService, { value: ConfigService}, {scope: "SINGLETON"})
container.bindClass(DataStoreService, { value: DataStoreService, inject: [ConfigService]}, {scope: "SINGLETON"})
container.bindClass(DatabaseService, { value: DatabaseService, inject: [ConfigService]}, {scope: "SINGLETON"})
container.bindClass(EmailService, { value: EmailService, inject: [ConfigService]}, {scope: "SINGLETON"})
container.bindClass(PasswordService, { value: PasswordService}, {scope: "SINGLETON"})
container.bindClass(TokenService, { value: TokenService, inject: [ConfigService, DataStoreService]}, {scope: "SINGLETON"})

// Base module
container.bindClass(BaseController, { value: BaseController}, {scope: "SINGLETON"})

// Info module
container.bindClass(InfoController, { value: InfoController, inject: [ConfigService]}, {scope: "SINGLETON"})

// Auth module
container.bindClass(AuthService, { value: AuthService, inject: [UsersService, TokenService, ConfigService, EmailService]}, {scope: "SINGLETON"})
container.bindClass(AccessControlService, { value: AccessControlService, inject: [UsersDatabaseService, TokenService] }, {scope: "SINGLETON"})
container.bindClass(AuthController, { value: AuthController, inject: [AuthService, AccessControlService]}, {scope: "SINGLETON"})

// Users module
container.bindClass(UsersDatabaseService, { value: UsersDatabaseService, inject: [DatabaseService]}, {scope: "SINGLETON"})
container.bindClass(UsersService, { value: UsersService, inject: [UsersDatabaseService, ConfigService, AccessControlService]}, {scope: "SINGLETON"})
container.bindClass(UsersController, { value: UsersController, inject: [UsersService, TokenService, AccessControlService]}, {scope: "SINGLETON"})

// Vault module
container.bindClass(VaultsDatabaseService, { value: VaultsDatabaseService, inject: [DatabaseService]}, {scope: "SINGLETON"})
container.bindClass(VaultsService, { value: VaultsService, inject: [VaultsDatabaseService, AccessControlService]}, {scope: "SINGLETON"})
container.bindClass(VaultsController, { value: VaultsController, inject: [VaultsService, AccessControlService]}, {scope: "SINGLETON"})

// Events module
