import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Program, Phase, Profile, ProgramFormWithTemplate } from "@/lib/types/database";
import DeleteProgramButton from "./components/delete-program-button";
import EditProgramButton from "./components/edit-program-button";
import AddPhaseButton from "./components/add-phase-button";
import PhaseRow from "./components/phase-row";
import AddEnrollmentButton from "./components/add-enrollment-button";
import EnrollmentRow from "./components/enrollment-row";
import AddFormButton from "./components/add-form-button";
import ProgramFormRow from "./components/program-form-row";

interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: program, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !program) {
    notFound();
  }

  const { data: phases } = await supabase
    .from("phases")
    .select("*")
    .eq("program_id", id)
    .order("order_index", { ascending: true });

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, profile:profiles(*)")
    .eq("program_id", id)
    .order("enrolled_at", { ascending: false });

  const { data: programForms } = await supabase
    .from("program_forms")
    .select("*, form_template:form_templates(*)")
    .eq("program_id", id)
    .order("created_at", { ascending: true });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start)
      return { label: "Em breve", color: "bg-blue-100 text-blue-700" };
    if (now > end)
      return { label: "Finalizado", color: "bg-gray-100 text-gray-700" };
    return { label: "Ativo", color: "bg-green/10 text-green" };
  };

  const status = getStatus(
    (program as Program).start_date,
    (program as Program).end_date
  );

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/administration/programs"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar para Programas
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light text-green">
                {(program as Program).name}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-muted">
              {formatDate((program as Program).start_date)} →{" "}
              {formatDate((program as Program).end_date)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditProgramButton program={program as Program} />
            <DeleteProgramButton programId={(program as Program).id} />
          </div>
        </div>
        {(program as Program).description && (
          <p className="text-foreground">{(program as Program).description}</p>
        )}
      </div>

      {/* Phases Section */}
      <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green/10">
          <h2 className="text-xl font-light text-green">
            Fases ({phases?.length ?? 0})
          </h2>
          <AddPhaseButton programId={(program as Program).id} />
        </div>
        <div className="divide-y divide-green/10">
          {(phases as Phase[])?.map((phase, index) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              phaseNumber={index + 1}
              programId={(program as Program).id}
            />
          ))}
          {(!phases || phases.length === 0) && (
            <div className="px-6 py-12 text-center text-muted">
              Nenhuma fase cadastrada. Adicione fases para organizar o programa.
            </div>
          )}
        </div>
      </div>

      {/* Forms Section */}
      <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green/10">
          <h2 className="text-xl font-light text-green">
            Formulários ({programForms?.length ?? 0})
          </h2>
          <AddFormButton
            programId={(program as Program).id}
            existingFormIds={
              (programForms as ProgramFormWithTemplate[])?.map(
                (pf) => pf.form_template_id
              ) ?? []
            }
          />
        </div>
        <div className="divide-y divide-green/10">
          {(programForms as ProgramFormWithTemplate[])?.map((programForm) => (
            <ProgramFormRow
              key={programForm.id}
              programForm={programForm}
              programId={(program as Program).id}
            />
          ))}
          {(!programForms || programForms.length === 0) && (
            <div className="px-6 py-12 text-center text-muted">
              Nenhum formulário associado. Adicione formulários para os usuários
              preencherem.
            </div>
          )}
        </div>
      </div>

      {/* Enrollments Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green/10">
          <h2 className="text-xl font-light text-green">
            Usuários Inscritos ({enrollments?.length ?? 0})
          </h2>
          <AddEnrollmentButton
            programId={(program as Program).id}
            enrolledUserIds={
              enrollments?.map((e: { user_id: string }) => e.user_id) ?? []
            }
          />
        </div>
        <div className="divide-y divide-green/10">
          {enrollments?.map(
            (enrollment: {
              id: string;
              profile: Profile;
              enrolled_at: string;
            }) => (
              <EnrollmentRow
                key={enrollment.id}
                enrollment={enrollment}
                profile={enrollment.profile}
              />
            )
          )}
          {(!enrollments || enrollments.length === 0) && (
            <div className="px-6 py-12 text-center text-muted">
              Nenhum usuário inscrito. Adicione usuários a este programa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
