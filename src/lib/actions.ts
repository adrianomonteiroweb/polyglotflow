"use server";

import { revalidatePath } from "next/cache";

import type { Language, Note } from "./types";

// Simulação de dados para desenvolvimento
// Em produção, isso seria substituído por chamadas reais ao banco de dados
import { mockLanguages, mockNotes } from "./mock-data";

// Função para adicionar um novo idioma
export async function addLanguage(data: {
  name: string;
  background_image_url?: string;
}): Promise<Language> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newLanguage: Language = {
    id: mockLanguages.length + 1,
    user_id: 1, // Usuário fixo para simulação
    name: data.name,
    background_image_url: data.background_image_url || null,
    created_at: new Date().toISOString(),
  };

  mockLanguages.push(newLanguage);

  revalidatePath("/");
  revalidatePath(`/language/${newLanguage.id}`);

  return newLanguage;
}

// Função para adicionar uma nova nota
export async function addNote(data: {
  language_id: number;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  tags: string[];
}): Promise<Note> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newNote: Note = {
    id: mockNotes.length + 1,
    user_id: 1, // Usuário fixo para simulação
    language_id: data.language_id,
    title: data.title,
    content: data.content,
    category: data.category as any,
    difficulty: data.difficulty as any,
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: data.tags.map((tag, index) => ({
      id:
        Math.max(...mockNotes.flatMap((n) => n.tags.map((t) => t.id))) +
        index +
        1,
      note_id: mockNotes.length + 1,
      tag,
    })),
  };

  mockNotes.push(newNote);

  revalidatePath(`/language/${data.language_id}`);

  return newNote;
}

// Função para atualizar uma nota existente
export async function updateNote(data: {
  id: number;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  tags: string[];
}): Promise<Note> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const noteIndex = mockNotes.findIndex((note) => note.id === data.id);

  if (noteIndex === -1) {
    throw new Error(`Note with id ${data.id} not found`);
  }

  const oldNote = mockNotes[noteIndex];
  const languageId = oldNote.language_id;

  // Criar novos tags
  const newTags = data.tags.map((tag, index) => ({
    id:
      Math.max(...mockNotes.flatMap((n) => n.tags.map((t) => t.id))) +
      index +
      1,
    note_id: data.id,
    tag,
  }));

  // Atualizar a nota
  const updatedNote: Note = {
    ...oldNote,
    title: data.title,
    content: data.content,
    category: data.category as any,
    difficulty: data.difficulty as any,
    updated_at: new Date().toISOString(),
    tags: newTags,
  };

  mockNotes[noteIndex] = updatedNote;

  revalidatePath(`/language/${languageId}`);

  return updatedNote;
}

// Função para atualizar o status de uma nota
export async function updateNoteStatus(
  noteId: number,
  status: "pending" | "reviewed" | "archived"
): Promise<Note> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const noteIndex = mockNotes.findIndex((note) => note.id === noteId);

  if (noteIndex === -1) {
    throw new Error(`Note with id ${noteId} not found`);
  }

  const oldNote = mockNotes[noteIndex];
  const languageId = oldNote.language_id;

  // Atualizar a nota
  const updatedNote: Note = {
    ...oldNote,
    status,
    reviewed_at:
      status === "reviewed" ? new Date().toISOString() : oldNote.reviewed_at,
    archived_at:
      status === "archived" ? new Date().toISOString() : oldNote.archived_at,
    updated_at: new Date().toISOString(),
  };

  mockNotes[noteIndex] = updatedNote;

  revalidatePath(`/language/${languageId}`);

  return updatedNote;
}

// Função para excluir uma nota
export async function deleteNote(noteId: number): Promise<void> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const noteIndex = mockNotes.findIndex((note) => note.id === noteId);

  if (noteIndex === -1) {
    throw new Error(`Note with id ${noteId} not found`);
  }

  const languageId = mockNotes[noteIndex].language_id;

  // Remover a nota
  mockNotes.splice(noteIndex, 1);

  revalidatePath(`/language/${languageId}`);
}
