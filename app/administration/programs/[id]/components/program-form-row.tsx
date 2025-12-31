"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramFormWithTemplate } from "@/lib/types/database";

interface ProgramFormRowProps {
  programForm: ProgramFormWithTemplate;
  programId: string;
}

export default function ProgramFormRow({
  programForm,
  programId,
}: ProgramFormRowProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Sem prazo";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = () => {
    if (!programForm.available_until) return false;
    return new Date(programForm.available_until) < new Date();
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover este formulário do programa?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/forms/${programForm.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover formulário");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting program form:", error);
      alert("Erro ao remover formulário");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-cream/30 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground">
            {programForm.form_template.name}
          </span>
          {programForm.is_required && (
            <span className="px-2 py-0.5 text-xs bg-terracotta/10 text-terracotta rounded">
              Obrigatório
            </span>
          )}
          {isExpired() && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              Expirado
            </span>
          )}
        </div>
        <p className="text-sm text-muted mt-1">
          Prazo: {formatDateTime(programForm.available_until)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`/administration/programs/${programId}/forms/${programForm.id}/submissions`}
          className="px-3 py-1.5 text-sm bg-green/10 text-green hover:bg-green/20 rounded-lg transition-colors"
        >
          Ver respostas
        </a>
        <a
          href={`/administration/forms/${programForm.form_template_id}`}
          className="px-3 py-1.5 text-sm text-green hover:bg-green/10 rounded-lg transition-colors"
        >
          Editar
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 text-sm text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? "Removendo..." : "Remover"}
        </button>
      </div>
    </div>
  );
}
