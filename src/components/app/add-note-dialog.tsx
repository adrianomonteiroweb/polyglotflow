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

import { createNote } from "@/actions/notes";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { uploadAttachment } from "@/actions/attachments";

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languageId: number;
}

export default function AddNoteDialog({
  open,
  onOpenChange,
  languageId,
}: AddNoteDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    difficulty: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);

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

      const note = await createNote({
        user_id: 1, // TODO: Get from auth context
        language_id: languageId,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        difficulty: formData.difficulty,
        tags: tagsList,
      });

      setNoteId(note.id);

      // Upload any pending attachments
      if (pendingAttachments.length > 0) {
        for (const file of pendingAttachments) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("noteId", note.id.toString());
          await uploadAttachment(formData);
        }
      }

      // Reset form
      setFormData({
        title: "",
        content: "",
        category: "",
        difficulty: "",
        tags: "",
      });
      setPendingAttachments([]);

      router.refresh();
      toast.success("Note created successfully");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (noteId) {
      // If note exists, upload directly
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("noteId", noteId.toString());
        await uploadAttachment(formData);
      }
    } else {
      // If note doesn't exist yet, store files for later upload
      setPendingAttachments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova nota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título da nota"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
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
              <Label htmlFor="category">Pilar</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
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
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
                required
              >
                <SelectTrigger id="difficulty">
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
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="gramática, verbos, passado, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Anexos</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="relative"
                disabled={isSubmitting}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  multiple
                  disabled={isSubmitting}
                />
                <Upload className="mr-2 h-4 w-4" />
                {isSubmitting ? "Enviando..." : "Adicionar anexos"}
              </Button>
            </div>

            {pendingAttachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Anexos pendentes</h4>
                <div className="grid gap-2">
                  {pendingAttachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPendingAttachments((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {noteId && (
              <NoteAttachments
                noteId={noteId.toString()}
                initialAttachments={[]}
              />
            )}
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
              {isSubmitting ? "Adicionando..." : "Adicionar nota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
