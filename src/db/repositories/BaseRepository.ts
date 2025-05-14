import { db } from "../index";
import { eq, count, getTableName, sql } from "drizzle-orm";

export class BaseRepository {
  static db: any = db;
  static model: any = null;

  static async transaction(fn: Function) {
    return await this.db.transaction(fn);
  }

  static query() {
    return this.db.query[this.tableName()];
  }

  static tableName() {
    return getTableName(this.model);
  }

  static async findById(id: any, options: any = {}) {
    return await this.query().findFirst({
      ...options,
      where: eq(this.model.id, id),
    });
  }

  static async findAll(where?: any, options: any = {}) {
    return await this.query().findMany({
      ...options,
      where,
    });
  }

  static async findOne(where: any, options: any = {}) {
    return await this.query().findFirst({
      ...options,
      where,
    });
  }

  static async findOrCreate(where: any, data: any, opts: any = {}) {
    const db = opts.tx || this.db;

    const item = await this.findOne(where);

    if (item) {
      return [item, false];
    }

    const created = await db.insert(this.model).values(data).returning();
    return [created[0], true];
  }

  static async count(where?: any, opts: any = {}) {
    type Result = {
      count: number;
    }[];

    const db = opts.tx || this.db;

    const result: Result = await db
      .select({ count: count() })
      .from(this.model)
      .where(where);
    return result[0]?.count || 0;
  }

  static async updateOrCreate(data: any, target: any = null, opts: any = {}) {
    const db = opts.tx || this.db;

    return await db
      .insert(this.model)
      .values(data)
      .onConflictDoUpdate({
        target: target || this.model.id_cliente,
        set: data,
      })
      .returning();
  }

  static async create(data: any, opts: any = {}) {
    const db = opts.tx || this.db;

    const created: any = await db.insert(this.model).values(data).returning();

    return created[0];
  }

  static async bulkCreate(data: any, opts: any = {}) {
    const db = opts.tx || this.db;

    return await db.insert(this.model).values(data).returning();
  }

  static async update(id_cliente: any, data: any, opts: any = {}) {
    const db = opts.tx || this.db;

    if (this.model?.updated_at) {
      data.update_at = new Date();
    }

    const updated: any = await db
      .update(this.model)
      .set(data)
      .where(eq(this.model.id, id_cliente))
      .returning();
    return updated[0];
  }

  static async bulkUpdate(where: any, data: any, opts: any = {}) {
    const db = opts.tx || this.db;
    return db.update(this.model).set(data).where(where).returning();
  }

  static async destroy(where: any, opts: any = {}) {
    const db = opts.tx || this.db;
    return await db.delete(this.model).where(where).returning();
  }

  static async deleteById(id_cliente: any, opts: any = {}) {
    const db = opts.tx || this.db;
    return await db
      .delete(this.model)
      .where(eq(this.model.id, id_cliente))
      .returning();
  }

  static getUltimaDataReferencia(id_cliente: any) {
    return sql`
      (SELECT TO_DATE(referencia, 'DD/MM/YYYY')
       FROM relatorio
      WHERE id_cliente = ${id_cliente}
      ORDER BY referencia DESC
      LIMIT 1)
    `;
  }

  static getUltimaReferencia(id_cliente: any) {
    return sql`
      (SELECT referencia
       FROM relatorio
      WHERE id_cliente = ${id_cliente}
      ORDER BY referencia DESC
      LIMIT 1)
    `;
  }
}

export default BaseRepository;
