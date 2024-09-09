import {CreateUserDto, UpdateUserDto, UsersURLParams} from "@localful/common";
import express, {NextFunction, Request, Response} from "express";
import {validateSchema} from "@common/schema-validator.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {validateAuthentication} from "@modules/auth/validate-authentication.js";
import {UsersService} from "@modules/users/users.service.js";
import {TokenService} from "@services/token/token.service.js";
import {Injectable, container} from "@ben-ryder/injectable";


@Injectable()
export class UserController {
  constructor(
      private usersService: UsersService,
      private tokenService: TokenService
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto = await validateSchema(req.body, CreateUserDto);

      // Access control and registration enabled checks are done within the service.
      const newUser = await this.usersService.create(createUserDto);
      const tokens = await this.tokenService.createNewTokenPair(newUser);

      res.status(HttpStatusCodes.OK).json({
        user: newUser,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    }
    catch (error) {
      next(error)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, UsersURLParams);
      const requestUser = await validateAuthentication(req);

      const user = await this.usersService.get(requestUser, params.userId);
      res.status(HttpStatusCodes.OK).json(user)
    }
    catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, UsersURLParams);
      const updateUserDto = await validateSchema(req.body, UpdateUserDto);
      const requestUser = await validateAuthentication(req);

      const result = await this.usersService.update(requestUser, params.userId, updateUserDto);
      res.status(HttpStatusCodes.OK).json(result)
    }
    catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, UsersURLParams);
      const requestUser = await validateAuthentication(req);

      await this.usersService.delete(requestUser, params.userId);
      res.sendStatus(HttpStatusCodes.OK)
    }
    catch (error) {
      next(error)
    }
  }
}

const userController = container.use(UserController);

const UsersRouter = express.Router();
UsersRouter
    .get("/v1/users/:userId", userController.getUser.bind(userController))
    .post("/v1/users", userController.createUser.bind(userController))
    .patch("/v1/users/:userId", userController.updateUser.bind(userController))
    .delete("/v1/users/:userId", userController.deleteUser.bind(userController));

export default UsersRouter;
