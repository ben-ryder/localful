import {
  CreateVaultDto,
  UpdateVaultDto,
  VaultsURLParams
} from "@localful/common";
import express, {NextFunction, Request, Response} from "express";
import {validateSchema} from "@common/schema-validator.js";
import {validateAuthentication} from "@modules/auth/validate-authentication.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {VaultsService} from "@modules/vaults/vaults.service.js";
import {Injectable} from "@common/injection/injectable-decorator.js";
import container from "@common/injection/container.js";


@Injectable()
export class VaultsController {
  constructor(private vaultsService: VaultsService) {}

  async createVault(req: Request, res: Response, next: NextFunction) {
    try {
      const createVaultDto = await validateSchema(req.body, CreateVaultDto);
      const requestUser = await validateAuthentication(req);

      const result = await this.vaultsService.create(requestUser, createVaultDto);
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (error) {
      next(error);
    }
  }

  async getVault(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, VaultsURLParams);
      const requestUser = await validateAuthentication(req);

      const result = await this.vaultsService.get(requestUser, params.vaultId);
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (error) {
      next(error);
    }
  }

  async updateVault(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, VaultsURLParams);
      const updateVaultDto = await validateSchema(req.body, UpdateVaultDto);
      const requestUser = await validateAuthentication(req);

      const result = await this.vaultsService.update(requestUser, params.vaultId, updateVaultDto);
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (error) {
      next(error);
    }
  }

  async deleteVault(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, VaultsURLParams);
      const requestUser = await validateAuthentication(req);

      const result = await this.vaultsService.delete(requestUser, params.vaultId);
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (error) {
      next(error);
    }
  }
}

const vaultController = container.use(VaultsController);

const VaultsRouter = express.Router();
VaultsRouter
    .get("/v1/vaults/:vaultId", vaultController.getVault)
    .post("/v1/vaults/:vaultId", vaultController.createVault)
    .patch("/v1/vaults/:vaultId", vaultController.updateVault)
    .delete("/v1/vaults/:vaultId", vaultController.deleteVault);

export default VaultsRouter;
