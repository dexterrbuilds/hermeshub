import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { FavoritesService } from "./favorites.service";

@Controller("favorites")
@UseGuards(SupabaseAuthGuard)
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.favorites.list(user.id);
  }

  @Post(":businessId")
  add(@CurrentUser() user: { id: string }, @Param("businessId") businessId: string) {
    return this.favorites.add(user.id, businessId);
  }

  @Delete(":businessId")
  remove(@CurrentUser() user: { id: string }, @Param("businessId") businessId: string) {
    return this.favorites.remove(user.id, businessId);
  }
}
