import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "./components/admin-nav";
import AdminLogoutButton from "./components/admin-logout-button";

export default async function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/authentication/sign-in");
  }

  // Use admin client to bypass RLS for profile check
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-green/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/administration">
              <Image src="/logo.svg" alt="Silencie" width={120} height={30} />
            </Link>
            <span className="text-xs font-medium text-white bg-green px-2 py-1 rounded">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-6">
            <AdminNav />
            <div className="flex items-center gap-4 pl-6 border-l border-green/10">
              <span className="text-sm text-muted hidden sm:block">
                {profile.full_name || profile.email}
              </span>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
