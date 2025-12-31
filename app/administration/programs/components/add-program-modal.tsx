"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddProgramModalProps {
  onClose: () => void;
}

export default function AddProgramModal({ onClose }: AddProgramModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create program");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-light text-green mb-6">Adicionar Programa</h2>

        {error && (
          <div className="mb-6 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-terracotta text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data de Término
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-green/20 rounded-lg text-muted hover:bg-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green text-white px-4 py-3 rounded-lg font-medium hover:bg-green/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Programa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
