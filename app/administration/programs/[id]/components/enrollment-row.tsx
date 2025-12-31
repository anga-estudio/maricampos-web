"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types/database";

interface EnrollmentRowProps {
  enrollment: {
    id: string;
    enrolled_at: string;
  };
  profile: Profile;
}

export default function EnrollmentRow({
  enrollment,
  profile,
}: EnrollmentRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/enrollments/${enrollment.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-cream/30 transition-colors">
      <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center">
        <span className="text-green font-medium">
          {(profile.full_name || profile.email)[0].toUpperCase()}
        </span>
      </div>

      <div className="flex-1">
        <p className="font-medium text-foreground">
          {profile.full_name || "Sem nome"}
        </p>
        <p className="text-sm text-muted">{profile.email}</p>
      </div>

      <div className="text-sm text-muted">
        Inscrito em {formatDate(enrollment.enrolled_at)}
      </div>

      <div className="flex items-center gap-2">
        {showDelete ? (
          <>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="text-sm text-terracotta hover:text-terracotta/70 transition-colors"
            >
              {loading ? "..." : "Confirmar"}
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowDelete(true)}
            className="text-sm text-muted hover:text-terracotta transition-colors"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
