"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { removeLanguage } from "@/actions/languages";
import type { Language } from "@/lib/types";

interface DeleteLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
}

export default function DeleteLanguageDialog({
  open,
  onOpenChange,
  language,
}: DeleteLanguageDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await removeLanguage(language.id);
      onOpenChange(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete language:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Excluir idioma
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o idioma "{language.name}"? Esta ação
            removerá permanentemente todo o histórico e notas associadas a este
            idioma e não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir idioma"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
