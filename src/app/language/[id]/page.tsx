import { notFound } from "next/navigation";

import LanguageSidebar from "@/components/app/language-sidebar";
import NotesContainer from "@/components/app/notes-container";

import { getNotes } from "@/actions/notes";
import { getLanguageById, getLanguages } from "@/actions/languages";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LanguagePage({ params }: PageProps) {
  try {
    // Ensure params is resolved before accessing id
    const { id } = await Promise.resolve(params);
    const languageId = Number.parseInt(id);

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
