import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./components/logout-button";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/authentication/sign-in");
  }

  // Get user profile using admin client to bypass RLS
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // Get user's enrollments with programs (using admin client to bypass RLS)
  const { data: enrollments } = await adminClient
    .from("enrollments")
    .select(
      `
      *,
      program:programs(*)
    `
    )
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  // Get program IDs
  const programIds = enrollments?.map((e) => e.program_id) || [];

  // Get available forms for enrolled programs
  const { data: programForms } = programIds.length
    ? await adminClient
        .from("program_forms")
        .select(
          `
        *,
        program:programs(*),
        form_template:form_templates(*)
      `
        )
        .in("program_id", programIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  // Get user's submissions
  const { data: submissions } = await adminClient
    .from("form_submissions")
    .select("program_form_id, completed_at")
    .eq("user_id", user.id);

  const submissionMap = new Map(
    submissions?.map((s) => [s.program_form_id, s]) || []
  );

  // Filter available forms (not completed, not expired)
  const availableForms =
    programForms?.filter((pf) => {
      const submission = submissionMap.get(pf.id);
      if (submission?.completed_at) return false;

      if (pf.available_until) {
        const deadline = new Date(pf.available_until);
        if (new Date() > deadline) return false;
      }

      return true;
    }) || [];

  // Get completed forms
  const completedForms =
    programForms?.filter((pf) => {
      const submission = submissionMap.get(pf.id);
      return submission?.completed_at;
    }) || [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-green/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Silencie" width={120} height={30} />
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/administration"
                className="text-sm text-green hover:text-green/70 transition-colors flex items-center gap-1"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
                Administração
              </Link>
            )}
            <span className="text-sm text-muted hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light text-green mb-2">
          Bem-vindo ao Silencie
        </h1>
        <p className="text-muted mb-12">
          {profile?.full_name
            ? `Olá, ${profile.full_name}! `
            : ""}
          Sua jornada de meditação começa aqui.
        </p>

        {/* Pending Forms Alert */}
        {availableForms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-green mb-4">
              Formulários Pendentes
            </h2>
            <div className="space-y-3">
              {availableForms.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/forms/${pf.id}`}
                  className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {pf.form_template.name}
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        {pf.program.name}
                      </p>
                      {pf.available_until && (
                        <p className="text-xs text-terracotta mt-2">
                          Prazo:{" "}
                          {new Date(pf.available_until).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1.5 bg-green text-white text-sm rounded-lg">
                      Preencher →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Completed Forms */}
        {completedForms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-green mb-4">
              Formulários Concluídos
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completedForms.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/forms/${pf.id}/result`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center text-green">
                      ✓
                    </span>
                    <h3 className="font-medium text-foreground">
                      {pf.form_template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted">{pf.program.name}</p>
                  <p className="text-xs text-green mt-2">Ver resultado →</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Programs */}
        {enrollments && enrollments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-green mb-4">
              Seus Programas
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const program = enrollment.program;
                const now = new Date();
                const start = new Date(program.start_date);
                const end = new Date(program.end_date);
                let status = "Ativo";
                let statusColor = "bg-green/10 text-green";

                if (now < start) {
                  status = "Em breve";
                  statusColor = "bg-blue-100 text-blue-700";
                } else if (now > end) {
                  status = "Concluído";
                  statusColor = "bg-gray-100 text-gray-600";
                }

                return (
                  <Link
                    key={enrollment.id}
                    href={`/programs/${program.id}`}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground">
                        {program.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${statusColor}`}
                      >
                        {status}
                      </span>
                    </div>
                    {program.description && (
                      <p className="text-sm text-muted line-clamp-2">
                        {program.description}
                      </p>
                    )}
                    <p className="text-xs text-muted mt-3">
                      {new Date(program.start_date).toLocaleDateString("pt-BR")}{" "}
                      - {new Date(program.end_date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs text-green mt-2">Ver programa →</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!enrollments || enrollments.length === 0) && (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-green"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum programa encontrado
            </h3>
            <p className="text-muted">
              Você ainda não está inscrito em nenhum programa. Entre em contato
              com o administrador para ser adicionado.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
