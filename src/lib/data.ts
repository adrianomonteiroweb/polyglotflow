import type { Language, Note } from "./types";

// Simulação de dados para desenvolvimento
// Em produção, isso seria substituído por chamadas reais ao banco de dados

// Dados de exemplo para idiomas
const mockLanguages: Language[] = [
  {
    id: 1,
    user_id: 1,
    name: "Inglês",
    background_image_url:
      "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1000&auto=format&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    name: "Espanhol",
    background_image_url:
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    name: "Francês",
    background_image_url:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    created_at: new Date().toISOString(),
  },
];

// Dados de exemplo para notas
const mockNotes: Note[] = [
  {
    id: 1,
    user_id: 1,
    language_id: 1,
    title: "Verbos irregulares",
    content:
      "Lista dos principais verbos irregulares em inglês e suas conjugações no passado e particípio.",
    category: "grammar",
    difficulty: "medium",
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 1, note_id: 1, tag: "verbos" },
      { id: 2, note_id: 1, tag: "gramática" },
    ],
  },
  {
    id: 2,
    user_id: 1,
    language_id: 1,
    title: "Vocabulário de viagem",
    content:
      "Palavras e frases úteis para usar durante viagens: aeroporto, hotel, restaurante, etc.",
    category: "speaking",
    difficulty: "easy",
    status: "reviewed",
    reviewed_at: new Date().toISOString(),
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 3, note_id: 2, tag: "vocabulário" },
      { id: 4, note_id: 2, tag: "viagem" },
    ],
  },
  {
    id: 3,
    user_id: 1,
    language_id: 1,
    title: "Pronúncia do TH",
    content:
      "Dicas para melhorar a pronúncia dos sons 'th' em inglês, com exemplos e exercícios.",
    category: "speaking",
    difficulty: "hard",
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 5, note_id: 3, tag: "pronúncia" },
      { id: 6, note_id: 3, tag: "fonética" },
    ],
  },
  {
    id: 4,
    user_id: 1,
    language_id: 1,
    title: "Tempos verbais",
    content:
      "Explicação sobre os diferentes tempos verbais em inglês e quando usar cada um.",
    category: "grammar",
    difficulty: "medium",
    status: "archived",
    reviewed_at: new Date().toISOString(),
    archived_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 7, note_id: 4, tag: "gramática" },
      { id: 8, note_id: 4, tag: "verbos" },
    ],
  },
  {
    id: 5,
    user_id: 1,
    language_id: 1,
    title: "Podcast: English with Lucy",
    content:
      "Notas sobre o episódio #42 do podcast English with Lucy sobre expressões idiomáticas.",
    category: "listening",
    difficulty: "medium",
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 9, note_id: 5, tag: "podcast" },
      { id: 10, note_id: 5, tag: "expressões" },
    ],
  },
  {
    id: 6,
    user_id: 1,
    language_id: 1,
    title: "Artigo: The New York Times",
    content: "Resumo e vocabulário do artigo sobre mudanças climáticas do NYT.",
    category: "reading",
    difficulty: "hard",
    status: "reviewed",
    reviewed_at: new Date().toISOString(),
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 11, note_id: 6, tag: "notícias" },
      { id: 12, note_id: 6, tag: "vocabulário" },
    ],
  },
  {
    id: 7,
    user_id: 1,
    language_id: 1,
    title: "Email formal",
    content:
      "Modelo e dicas para escrever emails formais em inglês para contextos profissionais.",
    category: "writing",
    difficulty: "medium",
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 13, note_id: 7, tag: "formal" },
      { id: 14, note_id: 7, tag: "profissional" },
    ],
  },
  {
    id: 8,
    user_id: 1,
    language_id: 2,
    title: "Conjugação de verbos",
    content:
      "Regras para conjugar verbos regulares em espanhol nos tempos presente, passado e futuro.",
    category: "grammar",
    difficulty: "medium",
    status: "pending",
    reviewed_at: null,
    archived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: 15, note_id: 8, tag: "verbos" },
      { id: 16, note_id: 8, tag: "conjugação" },
    ],
  },
];

// Funções para acessar os dados
export async function getLanguages(): Promise<Language[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...mockLanguages];
}

export async function getLanguageById(id: number): Promise<Language> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const language = mockLanguages.find((lang) => lang.id === id);

  if (!language) {
    throw new Error(`Language with id ${id} not found`);
  }

  return { ...language };
}

export async function getNotesByLanguageId(
  languageId: number
): Promise<Note[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockNotes
    .filter((note) => note.language_id === languageId)
    .map((note) => ({ ...note, tags: [...note.tags] }));
}
