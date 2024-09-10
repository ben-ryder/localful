import {
  CreateVaultDto,
  UpdateVaultDto,
  VaultsURLParams
} from "@localful/common";
import {NextFunction, Request, Response} from "express";
import {validateSchema} from "@common/schema-validator.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {VaultsService} from "@modules/vaults/vaults.service.js";
import {AccessControlService} from "@modules/auth/access-control.service.js";


export class VaultsController {
  constructor(
      private vaultsService: VaultsService,
      private accessControlService: AccessControlService
  ) {}

  async createVault(req: Request, res: Response, next: NextFunction) {
    try {
      const createVaultDto = await validateSchema(req.body, CreateVaultDto);
      const requestUser = await this.accessControlService.validateAuthentication(req);

      const result = await this.vaultsService.create(requestUser, createVaultDto);
      res.status(HttpStatusCodes.CREATED).json(result);
    }
    catch (error) {
      next(error);
    }
  }

  async getVault(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validateSchema(req.params, VaultsURLParams);
      const requestUser = await this.accessControlService.validateAuthentication(req);

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
      const requestUser = await this.accessControlService.validateAuthentication(req);

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
      const requestUser = await this.accessControlService.validateAuthentication(req);

      const result = await this.vaultsService.delete(requestUser, params.vaultId);
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (error) {
      next(error);
    }
  }
}
