"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProgramButtonProps {
  programId: string;
}

export default function DeleteProgramButton({
  programId,
}: DeleteProgramButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/programs/${programId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/administration/programs");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">Excluir?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm text-terracotta hover:text-terracotta/70 transition-colors"
        >
          {loading ? "..." : "Sim"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 text-sm text-terracotta border border-terracotta/20 rounded-lg hover:bg-terracotta/5 transition-colors"
    >
      Excluir
    </button>
  );
}
