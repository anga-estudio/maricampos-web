"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types/database";

interface AddEnrollmentButtonProps {
  programId: string;
  enrolledUserIds: string[];
}

export default function AddEnrollmentButton({
  programId,
  enrolledUserIds,
}: AddEnrollmentButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.users) {
        const availableUsers = data.users.filter(
          (user: Profile) => !enrolledUserIds.includes(user.id)
        );
        setUsers(availableUsers);
      }
    } finally {
      setLoadingUsers(false);
    }
  }, [enrolledUserIds]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/enrollments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: selectedUserId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll user");
      }

      router.refresh();
      setIsOpen(false);
      setSelectedUserId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-green hover:text-green/70 transition-colors"
      >
        + Adicionar Usuário
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-light text-green mb-6">
              Adicionar Usuário ao Programa
            </h2>

            {error && (
              <div className="mb-6 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-terracotta text-sm">
                {error}
              </div>
            )}

            {loadingUsers ? (
              <div className="py-8 text-center text-muted">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center text-muted">
                Todos os usuários já estão inscritos neste programa.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Selecionar Usuário
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  >
                    <option value="">Escolha um usuário...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 border border-green/20 rounded-lg text-muted hover:bg-cream transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedUserId}
                    className="flex-1 bg-green text-white px-4 py-3 rounded-lg font-medium hover:bg-green/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Adicionando..." : "Adicionar Usuário"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
