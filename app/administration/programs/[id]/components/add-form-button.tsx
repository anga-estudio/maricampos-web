"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/lib/types/database";

interface AddFormButtonProps {
  programId: string;
  existingFormIds: string[];
}

export default function AddFormButton({
  programId,
  existingFormIds,
}: AddFormButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [formData, setFormData] = useState({
    form_template_id: "",
    available_until: "",
    available_until_time: "23:59",
    is_required: false,
  });

  useEffect(() => {
    if (isOpen && templates.length === 0) {
      loadTemplates();
    }
  }, [isOpen, templates.length]);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await fetch("/api/admin/forms");
      const data = await response.json();
      if (data.form_templates) {
        // Filter out already associated templates
        const available = data.form_templates.filter(
          (t: FormTemplate) => !existingFormIds.includes(t.id)
        );
        setTemplates(available);
      }
    } catch {
      setError("Erro ao carregar formulários");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine date and time
      let available_until = null;
      if (formData.available_until) {
        available_until = new Date(
          `${formData.available_until}T${formData.available_until_time}:00`
        ).toISOString();
      }

      const response = await fetch(`/api/admin/programs/${programId}/forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_template_id: formData.form_template_id,
          available_until,
          is_required: formData.is_required,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao adicionar formulário");
      }

      setIsOpen(false);
      setFormData({
        form_template_id: "",
        available_until: "",
        available_until_time: "23:59",
        is_required: false,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar formulário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors text-sm"
      >
        + Adicionar Formulário
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-light text-green mb-6">
              Adicionar Formulário
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-terracotta/10 text-terracotta rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Formulário *
                </label>
                {loadingTemplates ? (
                  <div className="text-muted text-sm">Carregando...</div>
                ) : templates.length === 0 ? (
                  <div className="text-muted text-sm">
                    Nenhum formulário disponível.{" "}
                    <a
                      href="/administration/forms"
                      className="text-green hover:underline"
                    >
                      Criar um formulário
                    </a>
                  </div>
                ) : (
                  <select
                    value={formData.form_template_id}
                    onChange={(e) =>
                      setFormData({ ...formData, form_template_id: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                    required
                  >
                    <option value="">Selecione um formulário</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Disponível até (opcional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.available_until}
                    onChange={(e) =>
                      setFormData({ ...formData, available_until: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  />
                  <input
                    type="time"
                    value={formData.available_until_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_until_time: e.target.value,
                      })
                    }
                    className="w-32 px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  Deixe em branco para não ter prazo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_required"
                  checked={formData.is_required}
                  onChange={(e) =>
                    setFormData({ ...formData, is_required: e.target.checked })
                  }
                  className="w-4 h-4 text-green border-green/20 rounded focus:ring-green/30"
                />
                <label htmlFor="is_required" className="text-sm text-foreground">
                  Preenchimento obrigatório
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border border-green/20 rounded-lg hover:bg-cream/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || templates.length === 0}
                  className="flex-1 px-4 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
