"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormQuestionWithOptions, QuestionType } from "@/lib/types/database";

interface QuestionRowProps {
  question: FormQuestionWithOptions;
  questionNumber: number;
}

const questionTypeLabels: Record<QuestionType, string> = {
  single_choice: "Escolha única",
  multiple_choice: "Múltipla escolha",
  scale: "Escala",
  text: "Texto",
  textarea: "Texto longo",
};

export default function QuestionRow({
  question,
  questionNumber,
}: QuestionRowProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta pergunta?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/forms/questions/${question.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir pergunta");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Erro ao excluir pergunta");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-cream/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted">{questionNumber}.</span>
            <span className="text-foreground">{question.question_text}</span>
            {question.is_required && (
              <span className="text-terracotta text-sm">*</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 text-xs bg-green/10 text-green rounded">
              {questionTypeLabels[question.question_type]}
            </span>

            {question.scoring_category && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                {question.scoring_category === "ruido_mental"
                  ? "Ruído Mental"
                  : "Potência"}
              </span>
            )}

            {question.is_inverted && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                Invertida
              </span>
            )}

            {question.question_type === "scale" && (
              <span className="text-xs text-muted">
                {question.scale_min} - {question.scale_max}
                {question.scale_min_label && ` (${question.scale_min_label}`}
                {question.scale_max_label &&
                  `${question.scale_min_label ? " → " : " ("}${question.scale_max_label})`}
              </span>
            )}

            {question.max_selections && (
              <span className="text-xs text-muted">
                (máx. {question.max_selections})
              </span>
            )}
          </div>

          {question.options && question.options.length > 0 && (
            <div className="mt-2 pl-4 text-sm text-muted">
              {question.options.map((opt, i) => (
                <span key={opt.id}>
                  {i > 0 && " · "}
                  {opt.option_text}
                </span>
              ))}
            </div>
          )}

          {question.help_text && (
            <p className="text-xs text-muted mt-1 italic">
              {question.help_text}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-terracotta hover:text-terracotta/80 transition-colors disabled:opacity-50"
        >
          {deleting ? "..." : "Excluir"}
        </button>
      </div>
    </div>
  );
}
