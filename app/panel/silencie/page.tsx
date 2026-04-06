import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "../sidebar";
import SilencieEditor from "./editor";

export default async function SilenciePage() {
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
        <h2 className="text-2xl font-semibold text-sage-dark mb-2">
          Silencie
        </h2>
        <p className="text-text-muted mb-8">
          Gerencie o conteúdo do site silencie.maricampos.co
        </p>
        <SilencieEditor />
      </main>
    </div>
  );
}
