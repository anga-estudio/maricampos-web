import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FormTemplateWithSections } from "@/lib/types/database";
import EditFormTemplateButton from "./components/edit-form-template-button";
import DeleteFormTemplateButton from "./components/delete-form-template-button";
import AddSectionButton from "./components/add-section-button";
import SectionCard from "./components/section-card";

interface FormTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function FormTemplatePage({
  params,
}: FormTemplatePageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: template, error } = await supabase
    .from("form_templates")
    .select(
      `
      *,
      sections:form_sections(
        *,
        questions:form_questions(
          *,
          options:form_options(*)
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !template) {
    notFound();
  }

  // Sort sections and questions
  const sortedTemplate = template as FormTemplateWithSections;
  if (sortedTemplate.sections) {
    sortedTemplate.sections.sort((a, b) => a.order_index - b.order_index);
    sortedTemplate.sections.forEach((section) => {
      if (section.questions) {
        section.questions.sort((a, b) => a.order_index - b.order_index);
        section.questions.forEach((question) => {
          if (question.options) {
            question.options.sort((a, b) => a.order_index - b.order_index);
          }
        });
      }
    });
  }

  const totalQuestions =
    sortedTemplate.sections?.reduce(
      (acc, section) => acc + (section.questions?.length || 0),
      0
    ) || 0;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/administration/forms"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar para Formulários
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light text-green">
                {sortedTemplate.name}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  sortedTemplate.is_active
                    ? "bg-green/10 text-green"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {sortedTemplate.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-muted">
              {sortedTemplate.sections?.length || 0} seções · {totalQuestions}{" "}
              perguntas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditFormTemplateButton template={sortedTemplate} />
            <DeleteFormTemplateButton templateId={sortedTemplate.id} />
          </div>
        </div>

        {sortedTemplate.description && (
          <p className="text-foreground mb-4">{sortedTemplate.description}</p>
        )}

        {(sortedTemplate.intro_title || sortedTemplate.intro_description) && (
          <div className="bg-cream/50 rounded-lg p-4 border border-green/10">
            <h4 className="text-sm font-medium text-green mb-1">
              Introdução do Formulário
            </h4>
            {sortedTemplate.intro_title && (
              <p className="font-medium">{sortedTemplate.intro_title}</p>
            )}
            {sortedTemplate.intro_description && (
              <p className="text-sm text-muted mt-1">
                {sortedTemplate.intro_description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light text-green">Seções</h2>
        <AddSectionButton templateId={sortedTemplate.id} />
      </div>

      <div className="space-y-4">
        {sortedTemplate.sections?.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            sectionNumber={index + 1}
          />
        ))}

        {(!sortedTemplate.sections || sortedTemplate.sections.length === 0) && (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <p className="text-muted mb-4">
              Nenhuma seção criada ainda. Adicione seções para organizar as
              perguntas do formulário.
            </p>
            <AddSectionButton templateId={sortedTemplate.id} />
          </div>
        )}
      </div>
    </div>
  );
}
