"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/lib/types/database";

interface EditFormTemplateButtonProps {
  template: FormTemplate;
}

export default function EditFormTemplateButton({
  template,
}: EditFormTemplateButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || "",
    intro_title: template.intro_title || "",
    intro_description: template.intro_description || "",
    is_active: template.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/forms/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar formulário");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar formulário"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-green/20 text-green rounded-lg hover:bg-green/5 transition-colors"
      >
        Editar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-light text-green mb-6">
              Editar Formulário
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-terracotta/10 text-terracotta rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Título da Introdução
                </label>
                <input
                  type="text"
                  value={formData.intro_title}
                  onChange={(e) =>
                    setFormData({ ...formData, intro_title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição da Introdução
                </label>
                <textarea
                  value={formData.intro_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      intro_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-green border-green/20 rounded focus:ring-green/30"
                />
                <label htmlFor="is_active" className="text-sm text-foreground">
                  Formulário ativo
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
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
