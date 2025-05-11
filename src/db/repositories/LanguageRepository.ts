import BaseRepository from "./BaseRepository";

import { asc, ilike } from "drizzle-orm";
import { languages } from "..";

export type GetLanguageParams = {
  q?: string;
  page?: number;
  page_size?: number;
};

export class LanguageRepository extends BaseRepository {
  static override model: any = languages;

  static async getLanguages({
    q = "",
    page = 1,
    page_size = 10,
  }: GetLanguageParams = {}) {
    const limit = page_size || 10;
    const offset = ((page || 1) - 1) * page_size;

    const where = q && ilike(languages.name, `%${q}%`);

    const data = await super.findAll(where, {
      orderBy: (languages: any) => [asc(languages.id)],
      limit,
      offset,
    });

    return {
      count: await super.count(where),
      data,
    };
  }
}

export default LanguageRepository;
