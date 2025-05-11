"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, BookOpen, Languages, Menu, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";
import AddLanguageDialog from "./add-language-dialog";
import DeleteLanguageDialog from "./delete-language-dialog";

interface LanguageSidebarProps {
  languages: Language[];
  activeLanguageId: number | null;
}

export default function LanguageSidebar({
  languages,
  activeLanguageId,
}: LanguageSidebarProps) {
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(
    null
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed md:relative w-64 border-r bg-white h-screen flex flex-col transition-transform duration-300 ease-in-out z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <span>PolyglotFlow</span>
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAddLanguageOpen(true)}
              title="Adicionar idioma"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {languages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum idioma adicionado</p>
              </div>
            ) : (
              languages.map((language) => (
                <div
                  key={language.id}
                  className={cn(
                    "relative h-24 rounded-lg overflow-hidden group transition-all",
                    activeLanguageId === language.id
                      ? "ring-2 ring-primary"
                      : "hover:ring-1 hover:ring-primary/50"
                  )}
                >
                  <Link
                    href={`/language/${language.id}`}
                    className="block h-full"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Image
                      src={
                        language.background_image_url ||
                        "/placeholder.svg?height=96&width=240"
                      }
                      alt={language.name}
                      fill
                      className="object-cover brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3 text-white font-medium">
                      {language.name}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      setLanguageToDelete(language);
                    }}
                    title="Excluir idioma"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <AddLanguageDialog
          open={isAddLanguageOpen}
          onOpenChange={setIsAddLanguageOpen}
        />

        {languageToDelete && (
          <DeleteLanguageDialog
            open={!!languageToDelete}
            onOpenChange={(open) => !open && setLanguageToDelete(null)}
            language={languageToDelete}
          />
        )}
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
