import { redirect } from "next/navigation";

import LanguageSidebar from "@/components/app/language-sidebar";
import { getLanguages } from "@/lib/data";

export default async function Home() {
  const languages = await getLanguages();

  // Redirect to first language if available
  if (languages.length > 0) {
    redirect(`/language/${languages[0].id}`);
  }

  return (
    <main className="flex min-h-screen bg-gray-50">
      <LanguageSidebar languages={[]} activeLanguageId={null} />
      <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-muted-foreground">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-medium">
            Bem-vindo ao seu aplicativo de estudos
          </h2>
          <p className="text-base md:text-lg">
            Adicione seu primeiro idioma para começar sua jornada de aprendizado
          </p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground/80">
              Clique no botão + no menu lateral para adicionar um novo idioma
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
