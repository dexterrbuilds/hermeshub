import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { ProfilesService } from "./profiles.service";

@Controller("me")
@UseGuards(SupabaseAuthGuard)
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get("profile")
  getProfile(@CurrentUser() user: { id: string; email?: string }) {
    return this.profiles.getOrCreate(user.id, user.email);
  }

  @Put("profile")
  updateProfile(@CurrentUser() user: { id: string }, @Body() body: Record<string, unknown>) {
    return this.profiles.update(user.id, body);
  }
}
