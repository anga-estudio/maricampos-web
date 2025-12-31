import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types/database";

interface SubmissionsPageProps {
  params: Promise<{ id: string; formId: string }>;
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { id: programId, formId } = await params;
  const supabase = createAdminClient();

  // Get program form with template info
  const { data: programForm, error: pfError } = await supabase
    .from("program_forms")
    .select(
      `
      *,
      program:programs(*),
      form_template:form_templates(*)
    `
    )
    .eq("id", formId)
    .eq("program_id", programId)
    .single();

  if (pfError || !programForm) {
    notFound();
  }

  // Get all submissions for this program form
  const { data: submissions } = await supabase
    .from("form_submissions")
    .select(
      `
      *,
      profile:profiles(*)
    `
    )
    .eq("program_form_id", formId)
    .order("completed_at", { ascending: false });

  // Get total enrollments for this program
  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("program_id", programId);

  const completedCount =
    submissions?.filter((s) => s.completed_at).length || 0;
  const completionRate = enrollmentCount
    ? Math.round((completedCount / enrollmentCount) * 100)
    : 0;

  // Calculate average scores
  const completedSubmissions =
    submissions?.filter((s) => s.completed_at) || [];
  const avgNoiseScore =
    completedSubmissions.length > 0
      ? completedSubmissions.reduce((acc, s) => acc + (s.noise_score || 0), 0) /
        completedSubmissions.length
      : 0;
  const avgPowerScore =
    completedSubmissions.length > 0
      ? completedSubmissions.reduce((acc, s) => acc + (s.power_score || 0), 0) /
        completedSubmissions.length
      : 0;

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/administration/programs/${programId}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar para {programForm.program.name}
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <h1 className="text-3xl font-light text-green mb-2">
          Respostas: {programForm.form_template.name}
        </h1>
        <p className="text-muted">{programForm.program.name}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted">Respostas</p>
          <p className="text-3xl font-light text-green">
            {completedCount}/{enrollmentCount || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted">Taxa de Conclusão</p>
          <p className="text-3xl font-light text-green">{completionRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted">Ruído Médio</p>
          <p className="text-3xl font-light text-green">
            {Math.round(avgNoiseScore)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted">Potência Média</p>
          <p className="text-3xl font-light text-green">
            {Math.round(avgPowerScore)}
          </p>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-green/10">
          <h2 className="text-xl font-light text-green">
            Respostas Individuais
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted">
                  Ruído
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted">
                  Potência
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">
                  Preenchido em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green/10">
              {submissions?.map(
                (submission: {
                  id: string;
                  completed_at: string | null;
                  noise_score: number | null;
                  power_score: number | null;
                  profile: Profile;
                }) => (
                  <tr key={submission.id} className="hover:bg-cream/20">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {submission.profile.full_name || "—"}
                        </p>
                        <p className="text-sm text-muted">
                          {submission.profile.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {submission.completed_at ? (
                        <span className="px-2 py-1 text-xs bg-green/10 text-green rounded">
                          Concluído
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                          Em andamento
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {submission.completed_at ? (
                        <span
                          className={`font-medium ${
                            (submission.noise_score || 0) > 60
                              ? "text-terracotta"
                              : (submission.noise_score || 0) > 40
                              ? "text-orange-600"
                              : "text-green"
                          }`}
                        >
                          {Math.round(submission.noise_score || 0)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {submission.completed_at ? (
                        <span className="font-medium text-green">
                          {Math.round(submission.power_score || 0)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {submission.completed_at
                        ? new Date(submission.completed_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "—"}
                    </td>
                  </tr>
                )
              )}
              {(!submissions || submissions.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted"
                  >
                    Nenhuma resposta ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
