"use client";

import type React from "react";
import { CalendarIcon, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Note } from "@/lib/types";

interface NotesFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    tags: string[];
    difficulty: string[];
    status: string[];
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      tags: string[];
      difficulty: string[];
      status: string[];
      dateRange: {
        from: Date | undefined;
        to: Date | undefined;
      };
    }>
  >;
  notes: Note[];
}

export default function NotesFilter({
  open,
  onOpenChange,
  filters,
  setFilters,
  notes,
}: NotesFilterProps) {
  // Extract unique tags from all notes
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags.map((t) => t.tag)))
  ).sort();

  const difficulties = [
    { id: "easy", label: "Fácil" },
    { id: "medium", label: "Médio" },
    { id: "hard", label: "Difícil" },
  ];

  const statuses = [
    { id: "pending", label: "Pendente" },
    { id: "reviewed", label: "Revisado" },
    { id: "archived", label: "Arquivado" },
  ];

  function handleTagToggle(tag: string) {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function handleDifficultyToggle(difficulty: string) {
    setFilters((prev) => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter((d) => d !== difficulty)
        : [...prev.difficulty, difficulty],
    }));
  }

  function handleStatusToggle(status: string) {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }

  function handleDateRangeChange(range: {
    from: Date | undefined;
    to: Date | undefined;
  }) {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }));
  }

  function handleClearFilters() {
    setFilters({
      tags: [],
      difficulty: [],
      status: [],
      dateRange: { from: undefined, to: undefined },
    });
  }

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.status.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtrar notas
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 text-xs"
              >
                Limpar filtros
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Date filter */}
          <div className="space-y-2">
            <Label>Data de criação</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full sm:w-[200px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from
                      ? format(filters.dateRange.from, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Data inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      handleDateRangeChange({
                        ...filters.dateRange,
                        from: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full sm:w-[200px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to
                      ? format(filters.dateRange.to, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Data final"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      handleDateRangeChange({
                        ...filters.dateRange,
                        to: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(filters.dateRange.from || filters.dateRange.to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleDateRangeChange({ from: undefined, to: undefined })
                }
                className="h-8 text-xs px-2 py-1"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar datas
              </Button>
            )}
          </div>

          {/* Difficulty filter */}
          <div className="space-y-2">
            <Label>Dificuldade</Label>
            <div className="grid grid-cols-1 gap-2">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`difficulty-${difficulty.id}`}
                    checked={filters.difficulty.includes(difficulty.id)}
                    onCheckedChange={() =>
                      handleDifficultyToggle(difficulty.id)
                    }
                  />
                  <label
                    htmlFor={`difficulty-${difficulty.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {difficulty.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-1 gap-2">
              {statuses.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={filters.status.includes(status.id)}
                    onCheckedChange={() => handleStatusToggle(status.id)}
                  />
                  <label
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="grid grid-cols-2 gap-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button onClick={() => onOpenChange(false)}>Aplicar filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
