export interface User {
  id: number;
  name: string | null;
  email: string;
  created_at: string;
}

export interface Language {
  id: number;
  user_id: number;
  name: string;
  background_image_url: string | null;
  created_at: string;
}

export interface NoteTag {
  id: number;
  note_id: number;
  tag: string;
}

export interface Note {
  id: number;
  user_id: number;
  language_id: number;
  title: string;
  content: string;
  category: "reading" | "writing" | "speaking" | "listening" | "grammar";
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "reviewed" | "archived";
  reviewed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  tags: NoteTag[];
}
