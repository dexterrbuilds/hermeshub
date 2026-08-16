import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { camelizeRow } from "../common/sql";

@Injectable()
export class ProfilesService {
  constructor(private readonly db: DatabaseService) {}

  async getOrCreate(userId: string, email?: string) {
    const { rows } = await this.db.query(
      `insert into profiles (id, full_name)
       values ($1, $2)
       on conflict (id) do update set updated_at = now()
       returning id, full_name, phone, avatar_url, default_area, created_at, updated_at`,
      [userId, email?.split("@")[0] ?? "Hermes User"]
    );
    return camelizeRow(rows[0]);
  }

  async update(userId: string, body: Record<string, unknown>) {
    const { rows } = await this.db.query(
      `update profiles
       set full_name = coalesce($2, full_name),
           phone = coalesce($3, phone),
           avatar_url = coalesce($4, avatar_url),
           default_area = coalesce($5, default_area),
           updated_at = now()
       where id = $1
       returning id, full_name, phone, avatar_url, default_area, created_at, updated_at`,
      [userId, body.fullName ?? body.full_name, body.phone, body.avatarUrl ?? body.avatar_url, body.defaultArea ?? body.default_area]
    );
    return camelizeRow(rows[0]);
  }
}
