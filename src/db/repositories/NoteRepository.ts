import BaseRepository from "./BaseRepository";

import { asc, ilike, eq, and } from "drizzle-orm";
import { notes } from "..";

export type GetNoteParams = {
  q?: string;
  page?: number;
  page_size?: number;
  language_id?: number;
};

export class NoteRepository extends BaseRepository {
  static override model: any = notes;

  static async getNotes({
    q = "",
    page = 1,
    page_size = 10,
    language_id,
  }: GetNoteParams = {}) {
    const limit = page_size || 10;
    const offset = ((page || 1) - 1) * page_size;

    const conditions = [];

    if (q) {
      conditions.push(ilike(notes.title, `%${q}%`));
    }

    if (language_id) {
      conditions.push(eq(notes.language_id, language_id));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.db.query.notes.findMany({
      where,
      with: {
        tags: true,
        attachments: true,
      },
      orderBy: [asc(notes.id)],
      limit,
      offset,
    });

    return {
      count: await super.count(where),
      data,
    };
  }
}

export default NoteRepository;
