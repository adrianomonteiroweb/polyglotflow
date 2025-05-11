"use server";

import {
  NoteRepository,
  GetNoteParams,
} from "@/db/repositories/NoteRepository";

export async function getNotes(params: GetNoteParams = {}) {
  return await NoteRepository.getNotes(params);
}

export async function createNote(data: any) {
  return await NoteRepository.create(data);
}

export async function updateNote(id: number, data: any) {
  return await NoteRepository.update(id, data);
}

export async function removeNote(id: number) {
  return await NoteRepository.deleteById(id);
}
