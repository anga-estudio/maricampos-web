"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phase } from "@/lib/types/database";

interface PhaseRowProps {
  phase: Phase;
  phaseNumber: number;
  programId: string;
}

export default function PhaseRow({
  phase,
  phaseNumber,
  programId,
}: PhaseRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: phase.name,
    description: phase.description || "",
    start_date: phase.start_date,
    end_date: phase.end_date,
  });

  const getStatus = () => {
    const now = new Date();
    const start = new Date(phase.start_date);
    const end = new Date(phase.end_date);

    if (now < start)
      return { label: "Em breve", color: "bg-blue-100 text-blue-700" };
    if (now > end)
      return { label: "Concluída", color: "bg-gray-100 text-gray-600" };
    return { label: "Em andamento", color: "bg-green/10 text-green" };
  };

  const status = getStatus();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/phases/${phase.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar fase");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating phase:", error);
      alert("Erro ao atualizar fase");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta fase?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/phases/${phase.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir fase");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting phase:", error);
      alert("Erro ao excluir fase");
    } finally {
      setDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="px-6 py-4 bg-cream/30">
        <div className="space-y-3">
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
            placeholder="Nome da fase"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white resize-none"
            rows={2}
            placeholder="Descrição (opcional)"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
            />
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-green text-white rounded-lg hover:bg-green/90 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: phase.name,
                  description: phase.description || "",
                  start_date: phase.start_date,
                  end_date: phase.end_date,
                });
              }}
              className="px-3 py-1.5 text-sm border border-green/20 rounded-lg hover:bg-cream/50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-cream/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center text-green font-medium">
          {phaseNumber}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{phase.name}</span>
            <span className={`px-2 py-0.5 text-xs rounded ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted mt-0.5">
            {formatDate(phase.start_date)} → {formatDate(phase.end_date)}
            {phase.description && ` · ${phase.description}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 text-sm text-green hover:bg-green/10 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 text-sm text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? "..." : "Excluir"}
        </button>
      </div>
    </div>
  );
}
