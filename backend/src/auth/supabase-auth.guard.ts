import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ApiError } from "../common/api-error";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { user?: { id: string; email?: string } }>();
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) {
      throw new ApiError("UNAUTHENTICATED", "Please sign in to continue.", 401);
    }
    const user = await this.supabase.getUserFromJwt(token);
    if (!user) {
      throw new ApiError("UNAUTHENTICATED", "Your session has expired. Please sign in again.", 401);
    }
    request.user = { id: user.id, email: user.email };
    return true;
  }
}
