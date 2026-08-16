import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { BetaAdminGuard } from "./beta-admin.guard";
import { SupabaseAuthGuard } from "./supabase-auth.guard";

@Module({
  imports: [SupabaseModule],
  providers: [SupabaseAuthGuard, BetaAdminGuard],
  exports: [SupabaseAuthGuard, BetaAdminGuard]
})
export class AuthModule {}
