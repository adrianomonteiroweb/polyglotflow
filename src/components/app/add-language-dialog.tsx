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

import { createLanguage } from "@/actions/languages";

interface AddLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddLanguageDialog({
  open,
  onOpenChange,
}: AddLanguageDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newLanguage = await createLanguage({
        user_id: 1,
        name,
        background_image_url: backgroundUrl || undefined,
      });

      onOpenChange(false);
      router.push(`/language/${newLanguage.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to add language:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo idioma</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do idioma</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Inglês, Espanhol, Francês..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background">
              URL da imagem de fundo (opcional)
            </Label>
            <Input
              id="background"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
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
            <Button type="submit" disabled={!name || isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar idioma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
