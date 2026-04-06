import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./sidebar";

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/panel/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar email={user.email!} />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold text-sage-dark mb-2">
          Bem-vinda ao painel
        </h2>
        <p className="text-text-muted mb-8">
          Selecione um projeto no menu lateral para gerenciar o conteúdo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/panel/mari-campos"
            className="bg-white rounded-xl shadow-sm border border-sand p-6 hover:shadow-md transition group"
          >
            <span className="w-10 h-10 rounded-lg bg-sage/10 text-sage flex items-center justify-center text-sm font-bold mb-4">
              M
            </span>
            <h3 className="font-semibold text-foreground group-hover:text-sage transition">
              Mari Campos
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Gerenciar conteúdo do site Mari Campos
            </p>
          </a>

          <a
            href="/panel/silencie"
            className="bg-white rounded-xl shadow-sm border border-sand p-6 hover:shadow-md transition group"
          >
            <span className="w-10 h-10 rounded-lg bg-sage/10 text-sage flex items-center justify-center text-sm font-bold mb-4">
              S
            </span>
            <h3 className="font-semibold text-foreground group-hover:text-sage transition">
              Silencie
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Gerenciar conteúdo do projeto Silencie
            </p>
          </a>

          <a
            href="/panel/naya"
            className="bg-white rounded-xl shadow-sm border border-sand p-6 hover:shadow-md transition group"
          >
            <span className="w-10 h-10 rounded-lg bg-sage/10 text-sage flex items-center justify-center text-sm font-bold mb-4">
              N
            </span>
            <h3 className="font-semibold text-foreground group-hover:text-sage transition">
              Nayá
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Gerenciar conteúdo do projeto Nayá
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
