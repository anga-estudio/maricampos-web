"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types/database";

interface AddUserModalProps {
  onClose: () => void;
}

export default function AddUserModal({ onClose }: AddUserModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "member" as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
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
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-light text-green mb-6">Adicionar Usuário</h2>

        {error && (
          <div className="mb-6 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-terracotta text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Função
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
              >
                <option value="member">Membro</option>
                <option value="admin">Administrador</option>
              </select>
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
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
