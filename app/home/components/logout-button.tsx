"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/authentication/sign-in");
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
