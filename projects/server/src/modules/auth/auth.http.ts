import express, {NextFunction, Request, Response} from "express"

import {LoginRequest, LogoutRequest, RefreshRequest, VerifyEmailDto} from "@localful/common";

import {RequestWithContext} from "@common/request-context.js";
import { validateSchema } from "@common/schema-validator.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {validateAuthentication} from "@modules/auth/validate-authentication.js";
import authService from "@modules/auth/auth.service.js";


async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await validateSchema(req.body, LoginRequest);
    const response = await authService.login(data.email, data.password);
    return res.status(HttpStatusCodes.OK).json(response); 
  }
  catch (error) {
    next(error)
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await validateSchema(req.body, LogoutRequest);
    const response = await authService.logout(data.refreshToken);
    return res.status(HttpStatusCodes.OK).json(response);
  }
  catch (error) {
    next(error)
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await validateSchema(req.body, RefreshRequest);
    const response = await authService.refresh(data.refreshToken);
    return res.status(HttpStatusCodes.OK).json(response);
  }
  catch (error) {
    next(error)
  }
}

async function check(req: Request, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);
    return res.status(HttpStatusCodes.OK).send({
      statusCode: HttpStatusCodes.OK,
      message: "Current user is authenticated"
    });
  }
  catch(error) {
    next(error)
  }
}

/**
 * An endpoint where users can request email verification emails.
 * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
 *
 * @param req
 * @param res
 * @param next
 */
async function requestEmailVerification(req: RequestWithContext, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);
    await authService.requestEmailVerification(req.context.user.id)
    return res.sendStatus(HttpStatusCodes.OK)
  }
  catch (error) {
    next(error)
  }
}

/**
 * An endpoint where users can verify their account
 *
 * @param req
 * @param res
 * @param next
 */
async function verifyEmail(req: RequestWithContext, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);
    const data = await validateSchema(req.body, VerifyEmailDto);
    await authService.verifyEmail(req.context.user, data.token)
    return res.sendStatus(HttpStatusCodes.OK)
  }
  catch (error) {
    next(error)
  }
}

async function requestEmailChange(req: Request, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);

    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
      statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
      message: "Email changing has not been implemented yet"
    });
  }
  catch (error) {
    next(error)
  }
}

async function changeEmail(req: RequestWithContext, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);

    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
      statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
      message: "Email changing has not been implemented yet"
    });
  }
  catch (error) {
    next(error)
  }
}

async function requestPasswordReset(req: RequestWithContext, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);

    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
      statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
      message: "Password reset has not been implemented yet"
    });
  }
  catch (error) {
    next(error)
  }
}

async function resetPassword(req: RequestWithContext, res: Response, next: NextFunction) {
  try {
    await validateAuthentication(req);

    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
      statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
      message: "Password reset has not been implemented yet"
    });
  }
  catch (error) {
    next(error)
  }
}

const AuthRouter = express.Router();
AuthRouter
    // Basic Auth
    .get("/v1/auth/login", login)
    .get("/v1/auth/logout", logout)
    .get("/v1/auth/refresh", refresh)
    .get("/v1/auth/check", check)
    // Email Verification
    .get("/v1/auth/verify-email", requestEmailVerification)
    .post("/v1/auth/verify-email", verifyEmail)
    // Change Email
    .get("/v1/auth/change-email", requestEmailChange)
    .post("/v1/auth/change-email", changeEmail)
    // Change Password
    .get("/v1/auth/change-password", requestPasswordReset)
    .post("/v1/auth/change-password", resetPassword)

export default AuthRouter;
