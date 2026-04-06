import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "../sidebar";
import NayaEditor from "./editor";

export default async function NayaPage() {
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

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-sage-dark mb-2">Nayá</h2>
        <p className="text-text-muted mb-8">
          Gerencie o conteúdo do site naya.maricampos.co
        </p>
        <NayaEditor />
      </main>
    </div>
  );
}
