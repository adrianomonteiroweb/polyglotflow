import { notFound } from "next/navigation";

import LanguageSidebar from "@/components/app/language-sidebar";
import NotesContainer from "@/components/app/notes-container";

import { getNotes } from "@/actions/notes";
import { getLanguageById, getLanguages } from "@/actions/languages";

export default async function LanguagePage({ params }: any) {
  try {
    const languageId = Number.parseInt(params.id);

    if (isNaN(languageId)) {
      notFound();
    }

    const [languages, language, notesResponse] = await Promise.all([
      getLanguages(),
      getLanguageById(languageId),
      getNotes({ language_id: languageId }),
    ]);

    if (!language) {
      notFound();
    }

    return (
      <main className="flex min-h-screen bg-gray-50">
        <LanguageSidebar
          languages={languages.data}
          activeLanguageId={languageId}
        />
        <div className="flex-1 overflow-hidden">
          <NotesContainer language={language} notes={notesResponse?.data} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading language page:", error);
    notFound();
  }
}
