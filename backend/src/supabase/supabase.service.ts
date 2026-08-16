import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  readonly admin: SupabaseClient;
  readonly anon: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.get<string>("SUPABASE_URL");
    const anonKey = config.get<string>("SUPABASE_ANON_KEY");
    const serviceRoleKey = config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceRoleKey) {
      throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are required");
    }
    this.anon = createClient(url, anonKey, { auth: { persistSession: false } });
    this.admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }

  async getUserFromJwt(accessToken: string) {
    const { data, error } = await this.anon.auth.getUser(accessToken);
    if (error || !data.user) return null;
    return data.user;
  }
}
