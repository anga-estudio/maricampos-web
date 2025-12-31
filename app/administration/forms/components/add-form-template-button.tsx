"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFormTemplateButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    intro_title: "",
    intro_description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar formulário");
      }

      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        intro_title: "",
        intro_description: "",
      });
      router.push(`/administration/forms/${data.form_template.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar formulário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
      >
        + Novo Formulário
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-light text-green mb-6">
              Novo Formulário
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
                  placeholder="Ex: Anamnese Silencie"
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
                  placeholder="Breve descrição do formulário"
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
                  placeholder="Título exibido antes das perguntas"
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
                  placeholder="Instruções ou contexto exibido no início do formulário"
                />
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
                  {loading ? "Criando..." : "Criar Formulário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
