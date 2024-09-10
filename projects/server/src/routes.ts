import express from "express";
import {VaultsController} from "@modules/vaults/vaults.http.js";
import {UsersController} from "@modules/users/users.http.js";
import {InfoController} from "@modules/info/info.http.js";
import {BaseController} from "@modules/base/base.http.js";
import {AuthController} from "@modules/auth/auth.http.js";

import {container} from "./di-container.js";


const baseController = container.resolve<BaseController>(BaseController);
export const BaseRouter = express.Router();
BaseRouter
    .get("/", baseController.sendWelcomeMessage.bind(baseController))
    .get("/v1", baseController.sendWelcomeMessage.bind(baseController))

const infoController = container.resolve<InfoController>(InfoController);
export const InfoRouter = express.Router();
InfoRouter
    .get("/info", infoController.getInfo.bind(infoController));

const authController = container.resolve<AuthController>(AuthController);
export const AuthRouter = express.Router();
AuthRouter
    // Basic Auth
    .post("/v1/auth/login", authController.login.bind(authController))
    .post("/v1/auth/logout", authController.logout.bind(authController))
    .post("/v1/auth/refresh", authController.refresh.bind(authController))
    .get("/v1/auth/check", authController.check.bind(authController))
    // Email Verification
    .get("/v1/auth/verify-email", authController.requestEmailVerification.bind(authController))
    .post("/v1/auth/verify-email", authController.verifyEmail.bind(authController))
    // Change Email
    .get("/v1/auth/change-email", authController.requestEmailChange.bind(authController))
    .post("/v1/auth/change-email", authController.changeEmail.bind(authController))
    // Change Password
    .get("/v1/auth/change-password", authController.requestPasswordChange.bind(authController))
    .post("/v1/auth/change-password", authController.changePassword.bind(authController))

const userController = container.resolve<UsersController>(UsersController);
export const UsersRouter = express.Router();
UsersRouter
    .get("/v1/users/:userId", userController.getUser.bind(userController))
    .post("/v1/users", userController.createUser.bind(userController))
    .patch("/v1/users/:userId", userController.updateUser.bind(userController))
    .delete("/v1/users/:userId", userController.deleteUser.bind(userController));


const vaultController = container.resolve<VaultsController>(VaultsController);
export const VaultsRouter = express.Router();
VaultsRouter
    .get("/v1/vaults/:vaultId", vaultController.getVault.bind(vaultController))
    .post("/v1/vaults", vaultController.createVault.bind(vaultController))
    .patch("/v1/vaults/:vaultId", vaultController.updateVault.bind(vaultController))
    .delete("/v1/vaults/:vaultId", vaultController.deleteVault.bind(vaultController));
