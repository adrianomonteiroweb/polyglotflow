import BaseRepository from './BaseRepository';

import { asc, eq, ilike } from 'drizzle-orm';
import { users } from '..';

export type GetUserParams = {
  q?: string;
  page?: number;
  page_size?: number;
};

export class UserRepository extends BaseRepository {
  static override model: any = users;

  static async getUsers({ q = '', page = 1, page_size = 10 }: GetUserParams = {}) {
    const limit = page_size || 10;
    const offset = ((page || 1) - 1) * page_size;

    const where = q && ilike(users.name, `%${q}%`);

    const data = await super.findAll(where, {
      orderBy: (users: any) => [asc(users.id)],
      limit,
      offset,
    });

    return {
      count: await super.count(where),
      data,
    };
  }

  static async findByEmail(email: string, options: any = {}) {
    return await this.query().findFirst({
      ...options,
      where: eq(this.model.email, email),
    });
  }

  static async findOrCreateByEmail(email: string) {
    return await this.findOrCreate(eq(users.email, email), { email });
  }
}

export default UserRepository;
