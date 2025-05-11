"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { NoteAttachments } from "./note-attachments";

import type { Note } from "@/lib/types";
import { updateNote } from "@/actions/notes";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
}

export default function EditNoteDialog({
  open,
  onOpenChange,
  note,
}: EditNoteDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content,
    category: note.category,
    difficulty: note.difficulty,
    tags: note.tags.map((t) => t.tag).join(", "),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.difficulty
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process tags
      const tagsList = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateNote(note.id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        difficulty: formData.difficulty,
        tags: tagsList,
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar nota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título da nota"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Conteúdo</Label>
            <Textarea
              id="edit-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Conteúdo da nota"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Pilar</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Selecione um pilar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">Leitura</SelectItem>
                  <SelectItem value="writing">Escrita</SelectItem>
                  <SelectItem value="listening">Escuta</SelectItem>
                  <SelectItem value="speaking">Fala</SelectItem>
                  <SelectItem value="grammar">Gramática</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Dificuldade</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
                required
              >
                <SelectTrigger id="edit-difficulty">
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (separadas por vírgula)</Label>
            <Input
              id="edit-tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="gramática, verbos, passado, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Anexos</Label>
            <NoteAttachments
              noteId={note.id.toString()}
              initialAttachments={note.attachments}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title ||
                !formData.content ||
                !formData.category ||
                !formData.difficulty
              }
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
