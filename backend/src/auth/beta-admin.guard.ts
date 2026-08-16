import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ApiError } from "../common/api-error";

@Injectable()
export class BetaAdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const enabled = this.config.get<string>("ENABLE_BETA_ADMIN_ENDPOINTS") === "true";
    if (!enabled) throw new ApiError("BETA_ADMIN_DISABLED", "Beta admin operations are disabled.", 404);

    const expected = this.config.get<string>("BETA_ADMIN_TOKEN");
    if (!expected) throw new ApiError("BETA_ADMIN_NOT_CONFIGURED", "Beta admin operations are not configured.", 503);

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header("x-hermes-admin-token");
    if (provided !== expected) throw new ApiError("FORBIDDEN", "You are not allowed to perform this beta operation.", 403);
    return true;
  }
}
