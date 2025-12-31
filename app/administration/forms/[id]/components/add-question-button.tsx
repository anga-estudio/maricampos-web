"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/lib/types/database";

interface AddQuestionButtonProps {
  sectionId: string;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "single_choice", label: "Escolha única" },
  { value: "multiple_choice", label: "Múltipla escolha" },
  { value: "scale", label: "Escala numérica (0-10)" },
  { value: "text", label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
];

const scoringCategories = [
  { value: "", label: "Nenhuma (não pontua)" },
  { value: "ruido_mental", label: "Ruído Mental" },
  { value: "potencia", label: "Potência" },
];

export default function AddQuestionButton({
  sectionId,
}: AddQuestionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "scale" as QuestionType,
    help_text: "",
    is_required: true,
    is_inverted: false,
    scale_min: 0,
    scale_max: 10,
    scale_min_label: "",
    scale_max_label: "",
    max_selections: null as number | null,
    scoring_category: "",
    options: [{ option_text: "" }],
  });

  const resetForm = () => {
    setFormData({
      question_text: "",
      question_type: "scale",
      help_text: "",
      is_required: true,
      is_inverted: false,
      scale_min: 0,
      scale_max: 10,
      scale_min_label: "",
      scale_max_label: "",
      max_selections: null,
      scoring_category: "",
      options: [{ option_text: "" }],
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        question_text: formData.question_text,
        question_type: formData.question_type,
        help_text: formData.help_text || null,
        is_required: formData.is_required,
        is_inverted: formData.is_inverted,
        scoring_category: formData.scoring_category || null,
      };

      if (formData.question_type === "scale") {
        payload.scale_min = formData.scale_min;
        payload.scale_max = formData.scale_max;
        payload.scale_min_label = formData.scale_min_label || null;
        payload.scale_max_label = formData.scale_max_label || null;
      }

      if (
        formData.question_type === "single_choice" ||
        formData.question_type === "multiple_choice"
      ) {
        payload.options = formData.options.filter((o) => o.option_text.trim());
        if (formData.question_type === "multiple_choice" && formData.max_selections) {
          payload.max_selections = formData.max_selections;
        }
      }

      const response = await fetch(
        `/api/admin/forms/sections/${sectionId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pergunta");
      }

      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pergunta");
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { option_text: "" }],
    });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { option_text: value };
    setFormData({ ...formData, options: newOptions });
  };

  const showOptions =
    formData.question_type === "single_choice" ||
    formData.question_type === "multiple_choice";
  const showScale = formData.question_type === "scale";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-green hover:text-green/80 transition-colors"
      >
        + Adicionar pergunta
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
          />
          <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-light text-green mb-6">
              Nova Pergunta
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-terracotta/10 text-terracotta rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pergunta *
                </label>
                <textarea
                  value={formData.question_text}
                  onChange={(e) =>
                    setFormData({ ...formData, question_text: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50 resize-none"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Tipo de Resposta *
                  </label>
                  <select
                    value={formData.question_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question_type: e.target.value as QuestionType,
                      })
                    }
                    className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Categoria de Pontuação
                  </label>
                  <select
                    value={formData.scoring_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scoring_category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  >
                    {scoringCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {showScale && (
                <div className="p-4 bg-cream/50 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-foreground">
                    Configuração da Escala
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Valor mínimo
                      </label>
                      <input
                        type="number"
                        value={formData.scale_min}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scale_min: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Valor máximo
                      </label>
                      <input
                        type="number"
                        value={formData.scale_max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scale_max: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Label mínimo (ex: &quot;ótimo&quot;)
                      </label>
                      <input
                        type="text"
                        value={formData.scale_min_label}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scale_min_label: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Label máximo (ex: &quot;péssimo&quot;)
                      </label>
                      <input
                        type="text"
                        value={formData.scale_max_label}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scale_max_label: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {showOptions && (
                <div className="p-4 bg-cream/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                      Opções de Resposta
                    </h4>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-green hover:text-green/80"
                    >
                      + Adicionar opção
                    </button>
                  </div>
                  {formData.question_type === "multiple_choice" && (
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Máximo de seleções (deixe vazio para ilimitado)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.max_selections || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_selections: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          })
                        }
                        className="w-24 px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option.option_text}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-white"
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-terracotta hover:text-terracotta/80 px-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Texto de ajuda (opcional)
                </label>
                <input
                  type="text"
                  value={formData.help_text}
                  onChange={(e) =>
                    setFormData({ ...formData, help_text: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  placeholder="Instruções adicionais para o usuário"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_required"
                    checked={formData.is_required}
                    onChange={(e) =>
                      setFormData({ ...formData, is_required: e.target.checked })
                    }
                    className="w-4 h-4 text-green border-green/20 rounded focus:ring-green/30"
                  />
                  <label htmlFor="is_required" className="text-sm text-foreground">
                    Obrigatória
                  </label>
                </div>

                {showScale && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_inverted"
                      checked={formData.is_inverted}
                      onChange={(e) =>
                        setFormData({ ...formData, is_inverted: e.target.checked })
                      }
                      className="w-4 h-4 text-green border-green/20 rounded focus:ring-green/30"
                    />
                    <label htmlFor="is_inverted" className="text-sm text-foreground">
                      Escala invertida (10-X)
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-green/20 rounded-lg hover:bg-cream/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Criando..." : "Criar Pergunta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
