import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { camelizeRows } from "../common/sql";

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  async list(userId: string) {
    const { rows } = await this.db.query(
      `select f.business_id, f.created_at
       from favorites f
       join businesses b on b.id = f.business_id and b.is_active = true
       where f.user_id = $1
       order by f.created_at desc`,
      [userId]
    );
    return camelizeRows(rows);
  }

  async add(userId: string, businessId: string) {
    await this.db.query(
      `insert into favorites (user_id, business_id)
       values ($1, $2)
       on conflict (user_id, business_id) do nothing`,
      [userId, businessId]
    );
    return { ok: true, businessId };
  }

  async remove(userId: string, businessId: string) {
    await this.db.query("delete from favorites where user_id = $1 and business_id = $2", [userId, businessId]);
    return { ok: true, businessId };
  }
}
