import { db } from "../index";
import { noteAttachments } from "../schema";
import { eq } from "drizzle-orm";
import BaseRepository from "./BaseRepository";

export interface NoteAttachment {
  id: number;
  note_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: Date;
  updated_at: Date;
}

export class NoteAttachmentRepository extends BaseRepository {
  static override model = noteAttachments;

  static async createAttachment(
    data: Omit<NoteAttachment, "id" | "created_at" | "updated_at">
  ) {
    return await this.create(data);
  }

  static async deleteAttachment(id: number) {
    return await this.deleteById(id);
  }

  static async getAttachmentsByNoteId(noteId: number) {
    return await this.findAll(eq(this.model.note_id, noteId));
  }
}
