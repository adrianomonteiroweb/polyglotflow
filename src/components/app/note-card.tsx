"use client";

import { useState } from "react";
import { Edit, Archive, CheckCircle, MoreVertical, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Note } from "@/lib/types";
import { updateNoteStatus, deleteNote } from "@/lib/actions";
import EditNoteDialog from "./edit-note-dialog";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const statusColors = {
    pending: "bg-blue-100 text-blue-800",
    reviewed: "bg-purple-100 text-purple-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const difficultyLabels = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
  };

  const statusLabels = {
    pending: "Pendente",
    reviewed: "Revisado",
    archived: "Arquivado",
  };

  async function handleStatusChange(
    status: "pending" | "reviewed" | "archived"
  ) {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateNoteStatus(note.id, status);
    } catch (error) {
      console.error("Failed to update note status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (isUpdating) return;

    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;

    setIsUpdating(true);
    try {
      await deleteNote(note.id);
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <h3 className="font-medium">{note.title}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge
                variant="outline"
                className={difficultyColors[note.difficulty]}
              >
                {difficultyLabels[note.difficulty]}
              </Badge>
              <Badge variant="outline" className={statusColors[note.status]}>
                {statusLabels[note.status]}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              {note.status !== "reviewed" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("reviewed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como revisado
                </DropdownMenuItem>
              )}
              {note.status !== "archived" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("archived")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </DropdownMenuItem>
              )}
              {note.status !== "pending" && (
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como pendente
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="py-2 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {note.content}
          </p>
        </CardContent>
        <CardFooter className="pt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>

      <EditNoteDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        note={note}
      />
    </>
  );
}
