"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import type { Language, Note } from "@/lib/types";
import NoteCard from "./note-card";
import NotesFilter from "./notes-filter";
import AddNoteDialog from "./add-note-dialog";

interface NotesContainerProps {
  language: Language;
  notes: Note[];
}

interface Filters {
  tags: string[];
  difficulty: string[];
  status: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const CATEGORIES = [
  { id: "reading", label: "Leitura" },
  { id: "writing", label: "Escrita" },
  { id: "listening", label: "Escuta" },
  { id: "speaking", label: "Fala" },
  { id: "grammar", label: "Gramática" },
];

export default function NotesContainer({
  language,
  notes,
}: NotesContainerProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    tags: [],
    difficulty: [],
    status: [],
    dateRange: { from: undefined, to: undefined },
  });

  // Apply filters to notes
  const filteredNotes = notes.filter((note) => {
    // Filter by tags if any selected
    if (filters.tags.length > 0) {
      const noteTags = note.tags.map((t) => t.tag);
      if (!filters.tags.some((tag) => noteTags.includes(tag))) {
        return false;
      }
    }

    // Filter by difficulty if any selected
    if (
      filters.difficulty.length > 0 &&
      !filters.difficulty.includes(note.difficulty)
    ) {
      return false;
    }

    // Filter by status if any selected
    if (filters.status.length > 0 && !filters.status.includes(note.status)) {
      return false;
    }

    // Filter by date range if set
    const noteDate = new Date(note.created_at);

    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from);
      if (noteDate < fromDate) {
        return false;
      }
    }

    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      if (noteDate > toDate) {
        return false;
      }
    }

    return true;
  });

  // Group notes by category
  const notesByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category.id] = filteredNotes.filter(
      (note) => note.category === category.id
    );
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between md:mt-0 mt-14">
        <h2 className="text-xl font-semibold">{language.name}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddNoteOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nova nota
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reading" className="flex-1 overflow-hidden">
        <div className="bg-white border-b px-4">
          <TabsList className="h-auto flex-wrap md:h-12">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-10 md:h-12"
              >
                {category.label}
                <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
                  {notesByCategory[category.id]?.length || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {CATEGORIES.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="m-0 h-full"
            >
              {notesByCategory[category.id]?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <p>
                    Nenhuma nota de {category.label.toLowerCase()} encontrada
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setIsAddNoteOpen(true)}
                    className="mt-2"
                  >
                    Adicionar nota
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notesByCategory[category.id]?.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <NotesFilter
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        setFilters={setFilters}
        notes={notes}
      />

      <AddNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        languageId={language.id}
      />
    </div>
  );
}
