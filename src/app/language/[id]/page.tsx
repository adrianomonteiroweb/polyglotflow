import { notFound } from "next/navigation";
import LanguageSidebar from "@/components/app/language-sidebar";
import NotesContainer from "@/components/app/notes-container";
import {
  getLanguages,
  getLanguageById,
  getNotesByLanguageId,
} from "@/lib/data";

export default async function LanguagePage({ params }: any) {
  try {
    const languageId = Number.parseInt(params.id);

    if (isNaN(languageId)) {
      notFound();
    }

    const [languages, language, notes] = await Promise.all([
      getLanguages(),
      getLanguageById(languageId),
      getNotesByLanguageId(languageId),
    ]);

    if (!language) {
      notFound();
    }

    return (
      <main className="flex min-h-screen bg-gray-50">
        <LanguageSidebar languages={languages} activeLanguageId={languageId} />
        <div className="flex-1 overflow-hidden">
          <NotesContainer language={language} notes={notes} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading language page:", error);
    notFound();
  }
}
