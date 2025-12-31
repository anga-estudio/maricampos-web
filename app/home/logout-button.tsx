"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/authentication/sign-in");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      Sair
    </button>
  );
}
