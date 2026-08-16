import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { camelizeRows } from "../common/sql";

@Injectable()
export class CategoriesService {
  constructor(private readonly db: DatabaseService) {}

  async list() {
    const { rows } = await this.db.query(
      `select id, name, slug, icon, parent_id, sort_order, is_active
       from categories
       where is_active = true
       order by coalesce(parent_id, id), parent_id nulls first, sort_order, name`
    );
    return camelizeRows(rows);
  }
}
