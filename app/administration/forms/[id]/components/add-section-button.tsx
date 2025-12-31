"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddSectionButtonProps {
  templateId: string;
}

export default function AddSectionButton({ templateId }: AddSectionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/forms/${templateId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar seção");
      }

      setIsOpen(false);
      setFormData({ title: "", description: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar seção");
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
        + Nova Seção
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-light text-green mb-6">Nova Seção</h2>

            {error && (
              <div className="mb-4 p-3 bg-terracotta/10 text-terracotta rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  placeholder="Ex: Contexto e ponto de partida"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
                  rows={2}
                  placeholder="Instruções ou contexto para esta seção"
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
                  {loading ? "Criando..." : "Criar Seção"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
