"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormSectionWithQuestions } from "@/lib/types/database";
import AddQuestionButton from "./add-question-button";
import QuestionRow from "./question-row";

interface SectionCardProps {
  section: FormSectionWithQuestions;
  sectionNumber: number;
}

export default function SectionCard({
  section,
  sectionNumber,
}: SectionCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: section.title,
    description: section.description || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/forms/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar seção");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Erro ao atualizar seção");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta seção e todas as suas perguntas?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/forms/sections/${section.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir seção");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Erro ao excluir seção");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-green/10">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
            />
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
              rows={2}
              placeholder="Descrição (opcional)"
            />
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
                    title: section.title,
                    description: section.description || "",
                  });
                }}
                className="px-3 py-1.5 text-sm border border-green/20 rounded-lg hover:bg-cream/50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-green">
                Parte {sectionNumber} | {section.title}
              </h3>
              {section.description && (
                <p className="text-sm text-muted mt-1">{section.description}</p>
              )}
              <p className="text-xs text-muted mt-2">
                {section.questions?.length || 0} pergunta(s)
              </p>
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
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-green/5">
        {section.questions?.map((question, index) => (
          <QuestionRow key={question.id} question={question} questionNumber={index + 1} />
        ))}
      </div>

      <div className="px-6 py-3 bg-cream/30 border-t border-green/10">
        <AddQuestionButton sectionId={section.id} />
      </div>
    </div>
  );
}
