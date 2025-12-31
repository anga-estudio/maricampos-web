import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import DownloadPdfButton from "./components/download-pdf-button";

interface ResultPageProps {
  params: Promise<{ programFormId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { programFormId } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/authentication/sign-in");
  }

  // Get submission with all details (using admin client to bypass RLS)
  const { data: submission, error } = await adminClient
    .from("form_submissions")
    .select(
      `
      *,
      program_form:program_forms(
        *,
        program:programs(*),
        form_template:form_templates(*)
      )
    `
    )
    .eq("user_id", user.id)
    .eq("program_form_id", programFormId)
    .single();

  if (error || !submission || !submission.completed_at) {
    notFound();
  }

  const noiseScore = submission.noise_score || 0;
  const powerScore = submission.power_score || 0;

  // Generate interpretation
  let noiseInterpretation = "";
  let noiseColor = "";
  if (noiseScore <= 20) {
    noiseInterpretation = "Mente mais calma e regulada";
    noiseColor = "text-green";
  } else if (noiseScore <= 40) {
    noiseInterpretation = "Ruído moderado, com bons recursos";
    noiseColor = "text-green";
  } else if (noiseScore <= 60) {
    noiseInterpretation = "Ruído alto, atenção e energia bem drenadas";
    noiseColor = "text-orange-600";
  } else if (noiseScore <= 80) {
    noiseInterpretation = "Sobrecarga, piloto automático dominando";
    noiseColor = "text-orange-600";
  } else {
    noiseInterpretation = "Alerta máximo, urgência de reorganização interna";
    noiseColor = "text-terracotta";
  }

  let recommendation = "";
  if (noiseScore > 50 && powerScore > 50) {
    recommendation =
      "Você está potente mas desregulado: o Silencie vai organizar energia e foco.";
  } else if (noiseScore > 50 && powerScore <= 50) {
    recommendation =
      "Sua prioridade é: pausar, regular e criar espaço entre estímulo e resposta.";
  } else if (noiseScore <= 50 && powerScore <= 50) {
    recommendation =
      "Sua prioridade é: consistência pequena e diária, mesmo com mente imperfeita.";
  } else {
    recommendation =
      "Você está em terreno fértil: o Silencie aprofunda presença e refinamento.";
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-sm text-muted mb-2">
            {submission.program_form.program.name}
          </p>
          <h1 className="text-4xl font-light text-green mb-4">
            Seu Diagnóstico
          </h1>
          <p className="text-muted">
            {submission.program_form.form_template.name}
          </p>
        </div>

        {/* Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-lg text-muted mb-2">Nota de Ruído Interno</h3>
            <p className={`text-6xl font-light ${noiseColor}`}>
              {Math.round(noiseScore)}
            </p>
            <p className="text-sm text-muted mt-2">de 100</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-lg text-muted mb-2">Índice de Potência</h3>
            <p className="text-6xl font-light text-green">
              {Math.round(powerScore)}
            </p>
            <p className="text-sm text-muted mt-2">de 100</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h3 className="text-xl font-light text-green mb-4">
            O que isso significa
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted mb-1">Seu nível de ruído:</p>
              <p className={`text-lg font-medium ${noiseColor}`}>
                {noiseInterpretation}
              </p>
            </div>

            <div className="border-t border-green/10 pt-4">
              <p className="text-sm text-muted mb-1">Recomendação:</p>
              <p className="text-foreground">{recommendation}</p>
            </div>
          </div>
        </div>

        {/* Scale explanation */}
        <div className="bg-green/5 rounded-2xl p-6 mb-8">
          <h4 className="text-sm font-medium text-green mb-3">
            Como ler sua nota de ruído:
          </h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-green font-medium">0 a 20:</span> Mente mais
              calma e regulada
            </p>
            <p>
              <span className="text-green font-medium">21 a 40:</span> Ruído
              moderado, com bons recursos
            </p>
            <p>
              <span className="text-orange-600 font-medium">41 a 60:</span>{" "}
              Ruído alto, atenção e energia bem drenadas
            </p>
            <p>
              <span className="text-orange-600 font-medium">61 a 80:</span>{" "}
              Sobrecarga, piloto automático dominando
            </p>
            <p>
              <span className="text-terracotta font-medium">81 a 100:</span>{" "}
              Alerta máximo, urgência de reorganização interna
            </p>
          </div>
          <p className="text-sm text-muted mt-4">
            No final do programa, a meta é reduzir a nota. Quanto menor, mais
            transformação.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <DownloadPdfButton
            programFormId={programFormId}
            programName={submission.program_form.program.name}
            formName={submission.program_form.form_template.name}
            noiseScore={noiseScore}
            powerScore={powerScore}
            noiseInterpretation={noiseInterpretation}
            recommendation={recommendation}
            completedAt={submission.completed_at}
          />
          <Link
            href="/home"
            className="px-6 py-3 border border-green/20 text-green rounded-lg hover:bg-green/5 transition-colors text-center"
          >
            Voltar ao Início
          </Link>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Preenchido em{" "}
          {new Date(submission.completed_at).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
