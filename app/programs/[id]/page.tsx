import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phase } from "@/lib/types/database";
import LogoutButton from "@/app/home/components/logout-button";

interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
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

  // Check enrollment (using admin client to bypass RLS)
  const { data: enrollment } = await adminClient
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("program_id", id)
    .single();

  if (!enrollment) {
    redirect("/home");
  }

  // Get program with phases
  const { data: program, error } = await adminClient
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !program) {
    notFound();
  }

  // Get phases
  const { data: phases } = await adminClient
    .from("phases")
    .select("*")
    .eq("program_id", id)
    .order("order_index", { ascending: true });

  // Get program forms
  const { data: programForms } = await adminClient
    .from("program_forms")
    .select(
      `
      *,
      form_template:form_templates(*)
    `
    )
    .eq("program_id", id)
    .order("created_at", { ascending: true });

  // Get user submissions
  const { data: submissions } = await adminClient
    .from("form_submissions")
    .select("program_form_id, completed_at")
    .eq("user_id", user.id);

  const submissionMap = new Map(
    submissions?.map((s) => [s.program_form_id, s]) || []
  );

  // Calculate phase status
  const getPhaseStatus = (phase: Phase) => {
    const now = new Date();
    const start = new Date(phase.start_date);
    const end = new Date(phase.end_date);

    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

  // Calculate program status
  const getProgramStatus = () => {
    const now = new Date();
    const start = new Date(program.start_date);
    const end = new Date(program.end_date);

    if (now < start)
      return { label: "Em breve", color: "bg-blue-100 text-blue-700" };
    if (now > end)
      return { label: "Finalizado", color: "bg-gray-100 text-gray-600" };
    return { label: "Ativo", color: "bg-green/10 text-green" };
  };

  const programStatus = getProgramStatus();

  // Separate forms
  const pendingForms =
    programForms?.filter((pf) => {
      const submission = submissionMap.get(pf.id);
      if (submission?.completed_at) return false;
      if (pf.available_until && new Date(pf.available_until) < new Date())
        return false;
      return true;
    }) || [];

  const completedForms =
    programForms?.filter((pf) => {
      const submission = submissionMap.get(pf.id);
      return submission?.completed_at;
    }) || [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-green/10 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/home">
            <Image src="/logo.svg" alt="Silencie" width={100} height={25} />
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/administration"
                className="text-sm text-green hover:text-green/70 transition-colors"
              >
                Administração
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/home"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar
        </Link>

        {/* Program Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-light text-green">{program.name}</h1>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${programStatus.color}`}
            >
              {programStatus.label}
            </span>
          </div>
          {program.description && (
            <p className="text-muted">{program.description}</p>
          )}
        </div>

        {/* Pending Forms Alert */}
        {pendingForms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-foreground mb-3">
              Formulários Pendentes
            </h2>
            <div className="space-y-2">
              {pendingForms.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/forms/${pf.id}`}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {pf.form_template.name}
                    </p>
                    {pf.available_until && (
                      <p className="text-xs text-terracotta mt-1">
                        Prazo:{" "}
                        {new Date(pf.available_until).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1.5 bg-green text-white text-sm rounded-lg">
                    Preencher →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {phases && phases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Timeline do Programa
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green/20" />

              <div className="space-y-0">
                {(phases as Phase[]).map((phase, index) => {
                  const status = getPhaseStatus(phase);
                  const isLast = index === phases.length - 1;

                  return (
                    <div key={phase.id} className="relative pl-12">
                      {/* Circle indicator */}
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          status === "completed"
                            ? "bg-green border-green text-white"
                            : status === "active"
                            ? "bg-white border-green text-green"
                            : "bg-white border-green/30 text-green/30"
                        }`}
                      >
                        {status === "completed" ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`pb-8 ${isLast ? "pb-0" : ""} ${
                          status === "upcoming" ? "opacity-60" : ""
                        }`}
                      >
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={`font-medium ${
                                  status === "active"
                                    ? "text-green"
                                    : "text-foreground"
                                }`}
                              >
                                {phase.name}
                              </h3>
                              <p className="text-xs text-muted mt-1">
                                {new Date(phase.start_date).toLocaleDateString(
                                  "pt-BR",
                                  { day: "numeric", month: "short" }
                                )}{" "}
                                -{" "}
                                {new Date(phase.end_date).toLocaleDateString(
                                  "pt-BR",
                                  { day: "numeric", month: "short" }
                                )}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${
                                status === "completed"
                                  ? "bg-green/10 text-green"
                                  : status === "active"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {status === "completed"
                                ? "Concluída"
                                : status === "active"
                                ? "Em andamento"
                                : "Em breve"}
                            </span>
                          </div>
                          {phase.description && (
                            <p className="text-sm text-muted mt-2">
                              {phase.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Completed Forms */}
        {completedForms.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Formulários Concluídos
            </h2>
            <div className="grid gap-3">
              {completedForms.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/forms/${pf.id}/result`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center text-green">
                    ✓
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {pf.form_template.name}
                    </p>
                  </div>
                  <span className="text-sm text-green">Ver resultado →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for phases */}
        {(!phases || phases.length === 0) &&
          pendingForms.length === 0 &&
          completedForms.length === 0 && (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <p className="text-muted">
                Este programa ainda não tem fases ou formulários configurados.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
