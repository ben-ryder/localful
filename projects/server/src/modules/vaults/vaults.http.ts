import {
  CreateVaultDto,
  UpdateVaultDto,
  VaultsURLParams
} from "@localful/common";
import express, {NextFunction, Request, Response} from "express";
import {validateSchema} from "@common/schema-validator.js";
import {validateAuthentication} from "@modules/auth/validate-authentication.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import vaultsService from "@modules/vaults/vaults.service.js";

async function createVault(req: Request, res: Response, next: NextFunction) {
  try {
    const createVaultDto = await validateSchema(req.body, CreateVaultDto);
    const requestUser = await validateAuthentication(req);

    const result = await vaultsService.create(requestUser, createVaultDto);
    res.status(HttpStatusCodes.OK).json(result);
  }
  catch (error) {
    next(error);
  }
}

async function getVault(req: Request, res: Response, next: NextFunction) {
  try {
    const params = await validateSchema(req.params, VaultsURLParams);
    const requestUser = await validateAuthentication(req);

    const result = await vaultsService.get(requestUser, params.vaultId);
    res.status(HttpStatusCodes.OK).json(result);
  }
  catch (error) {
    next(error);
  }
}

async function updateVault(req: Request, res: Response, next: NextFunction) {
  try {
    const params = await validateSchema(req.params, VaultsURLParams);
    const updateVaultDto = await validateSchema(req.body, UpdateVaultDto);
    const requestUser = await validateAuthentication(req);

    const result = await vaultsService.update(requestUser, params.vaultId, updateVaultDto);
    res.status(HttpStatusCodes.OK).json(result);
  }
  catch (error) {
    next(error);
  }
}

async function deleteVault(req: Request, res: Response, next: NextFunction) {
  try {
    const params = await validateSchema(req.params, VaultsURLParams);
    const requestUser = await validateAuthentication(req);

    const result = await vaultsService.delete(requestUser, params.vaultId);
    res.status(HttpStatusCodes.OK).json(result);
  }
  catch (error) {
    next(error);
  }
}

const VaultsRouter = express.Router();
VaultsRouter
    .get("/v1/vaults/:vaultId", getVault)
    .post("/v1/vaults/:vaultId", createVault)
    .patch("/v1/vaults/:vaultId", updateVault)
    .delete("/v1/vaults/:vaultId", deleteVault);

export default VaultsRouter;
