import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { FormTemplate } from "@/lib/types/database";
import AddFormTemplateButton from "./components/add-form-template-button";

export default async function FormsPage() {
  const supabase = createAdminClient();

  const { data: templates } = await supabase
    .from("form_templates")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-green">Formulários</h1>
          <p className="text-muted mt-1">
            Gerencie os templates de formulários disponíveis
          </p>
        </div>
        <AddFormTemplateButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(templates as FormTemplate[])?.map((template) => (
          <Link
            key={template.id}
            href={`/administration/forms/${template.id}`}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-medium text-green">{template.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  template.is_active
                    ? "bg-green/10 text-green"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {template.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
            {template.description && (
              <p className="text-sm text-muted line-clamp-2">
                {template.description}
              </p>
            )}
            <p className="text-xs text-muted mt-3">
              Criado em{" "}
              {new Date(template.created_at).toLocaleDateString("pt-BR")}
            </p>
          </Link>
        ))}

        {(!templates || templates.length === 0) && (
          <div className="col-span-full bg-white rounded-2xl p-12 shadow-sm text-center">
            <p className="text-muted mb-4">Nenhum formulário criado ainda.</p>
            <AddFormTemplateButton />
          </div>
        )}
      </div>
    </div>
  );
}
