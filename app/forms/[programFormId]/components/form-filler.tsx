"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FormQuestionWithOptions,
  FormSectionWithQuestions,
} from "@/lib/types/database";

interface Answer {
  question_id: string;
  answer_text?: string;
  answer_scale?: number;
  answer_options?: string[];
}

interface ProgramFormData {
  id: string;
  program: { name: string };
  form_template: {
    name: string;
    intro_title: string | null;
    intro_description: string | null;
    sections: FormSectionWithQuestions[];
  };
}

interface FormFillerProps {
  programForm: ProgramFormData;
  programFormId: string;
}

export default function FormFiller({
  programForm,
  programFormId,
}: FormFillerProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flatten all questions with section info
  const allQuestions: {
    question: FormQuestionWithOptions;
    section: FormSectionWithQuestions;
    sectionIndex: number;
  }[] = [];

  programForm.form_template.sections.forEach((section, sectionIndex) => {
    section.questions.forEach((question) => {
      allQuestions.push({ question, section, sectionIndex });
    });
  });

  const totalSteps = allQuestions.length + 1; // +1 for intro
  const isIntro = currentStep === 0;
  const isLastQuestion = currentStep === totalSteps - 1;
  const currentQuestion = !isIntro ? allQuestions[currentStep - 1] : null;

  const progress = (currentStep / (totalSteps - 1)) * 100;

  const getCurrentAnswer = (): Answer | undefined => {
    if (!currentQuestion) return undefined;
    return answers[currentQuestion.question.id];
  };

  const isCurrentAnswerValid = (): boolean => {
    if (isIntro) return true;
    if (!currentQuestion) return true;

    const { question } = currentQuestion;
    const answer = getCurrentAnswer();

    if (!question.is_required) return true;
    if (!answer) return false;

    switch (question.question_type) {
      case "scale":
        return answer.answer_scale !== undefined;
      case "text":
      case "textarea":
        return !!answer.answer_text?.trim();
      case "single_choice":
        return !!(answer.answer_options && answer.answer_options.length === 1);
      case "multiple_choice":
        return !!(answer.answer_options && answer.answer_options.length > 0);
      default:
        return true;
    }
  };

  const handleNext = useCallback(() => {
    if (!isCurrentAnswerValid()) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, isCurrentAnswerValid]);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (answer: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [answer.question_id]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!isCurrentAnswerValid()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/forms/${programFormId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(answers) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar formulário");
      }

      router.push(`/forms/${programFormId}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar formulário");
      setSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isLastQuestion) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isLastQuestion, handleNext]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-green/20 z-50">
        <div
          className="h-full bg-green transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-4 left-4 right-4 flex items-center justify-between z-40">
        <div className="text-sm text-muted">
          {programForm.form_template.name}
        </div>
        <div className="text-sm text-muted">
          {currentStep}/{totalSteps - 1}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {isIntro ? (
            <IntroScreen
              title={
                programForm.form_template.intro_title ||
                programForm.form_template.name
              }
              description={programForm.form_template.intro_description}
              programName={programForm.program.name}
              onStart={handleNext}
            />
          ) : currentQuestion ? (
            <QuestionScreen
              question={currentQuestion.question}
              section={currentQuestion.section}
              sectionIndex={currentQuestion.sectionIndex}
              answer={getCurrentAnswer()}
              onAnswer={handleAnswer}
              isValid={isCurrentAnswerValid()}
            />
          ) : null}

          {error && (
            <div className="mt-4 p-3 bg-terracotta/10 text-terracotta rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {!isIntro && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-cream/80 backdrop-blur-sm border-t border-green/10">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-6 py-3 text-green hover:bg-green/10 rounded-lg transition-colors"
            >
              ← Voltar
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentAnswerValid() || submitting}
                className="px-8 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar Respostas"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentAnswerValid()}
                className="px-8 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
              >
                Continuar →
              </button>
            )}
          </div>
          <p className="text-center text-xs text-muted mt-2">
            Pressione Enter para continuar
          </p>
        </div>
      )}
    </div>
  );
}

// Intro Screen Component
function IntroScreen({
  title,
  description,
  programName,
  onStart,
}: {
  title: string;
  description: string | null;
  programName: string;
  onStart: () => void;
}) {
  return (
    <div className="text-center">
      <p className="text-sm text-muted mb-4">{programName}</p>
      <h1 className="text-4xl md:text-5xl font-light text-green mb-6">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted mb-8 whitespace-pre-line">
          {description}
        </p>
      )}
      <button
        onClick={onStart}
        className="px-8 py-4 bg-green text-white text-lg rounded-lg hover:bg-green/90 transition-colors"
      >
        Começar
      </button>
    </div>
  );
}

// Question Screen Component
function QuestionScreen({
  question,
  section,
  sectionIndex,
  answer,
  onAnswer,
  isValid,
}: {
  question: FormQuestionWithOptions;
  section: FormSectionWithQuestions;
  sectionIndex: number;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  isValid: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-green mb-2">
        Parte {sectionIndex + 1} | {section.title}
      </p>
      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
        {question.question_text}
        {question.is_required && <span className="text-terracotta ml-1">*</span>}
      </h2>
      {question.help_text && (
        <p className="text-muted mb-6">{question.help_text}</p>
      )}

      <div className="mt-8">
        {question.question_type === "scale" && (
          <ScaleInput
            question={question}
            value={answer?.answer_scale}
            onChange={(value) =>
              onAnswer({ question_id: question.id, answer_scale: value })
            }
          />
        )}

        {question.question_type === "single_choice" && (
          <SingleChoiceInput
            question={question}
            value={answer?.answer_options?.[0]}
            onChange={(value) =>
              onAnswer({ question_id: question.id, answer_options: [value] })
            }
          />
        )}

        {question.question_type === "multiple_choice" && (
          <MultipleChoiceInput
            question={question}
            value={answer?.answer_options || []}
            onChange={(value) =>
              onAnswer({ question_id: question.id, answer_options: value })
            }
          />
        )}

        {question.question_type === "text" && (
          <TextInput
            value={answer?.answer_text || ""}
            onChange={(value) =>
              onAnswer({ question_id: question.id, answer_text: value })
            }
          />
        )}

        {question.question_type === "textarea" && (
          <TextAreaInput
            value={answer?.answer_text || ""}
            onChange={(value) =>
              onAnswer({ question_id: question.id, answer_text: value })
            }
          />
        )}
      </div>

      {!isValid && answer && (
        <p className="text-terracotta text-sm mt-4">
          Esta pergunta é obrigatória
        </p>
      )}
    </div>
  );
}

// Scale Input Component
function ScaleInput({
  question,
  value,
  onChange,
}: {
  question: FormQuestionWithOptions;
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  const min = question.scale_min ?? 0;
  const max = question.scale_max ?? 10;
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`w-12 h-12 rounded-lg border-2 text-lg font-medium transition-all ${
              value === v
                ? "bg-green text-white border-green"
                : "bg-white text-foreground border-green/20 hover:border-green/50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {(question.scale_min_label || question.scale_max_label) && (
        <div className="flex justify-between mt-3 text-sm text-muted">
          <span>{question.scale_min_label || min}</span>
          <span>{question.scale_max_label || max}</span>
        </div>
      )}
    </div>
  );
}

// Single Choice Input Component
function SingleChoiceInput({
  question,
  value,
  onChange,
}: {
  question: FormQuestionWithOptions;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
            value === option.id
              ? "bg-green/10 border-green text-foreground"
              : "bg-white border-green/20 hover:border-green/50 text-foreground"
          }`}
        >
          {option.option_text}
        </button>
      ))}
    </div>
  );
}

// Multiple Choice Input Component
function MultipleChoiceInput({
  question,
  value,
  onChange,
}: {
  question: FormQuestionWithOptions;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      if (question.max_selections && value.length >= question.max_selections) {
        return;
      }
      onChange([...value, optionId]);
    }
  };

  return (
    <div>
      {question.max_selections && (
        <p className="text-sm text-muted mb-3">
          Escolha até {question.max_selections} opções
        </p>
      )}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
              value.includes(option.id)
                ? "bg-green/10 border-green text-foreground"
                : "bg-white border-green/20 hover:border-green/50 text-foreground"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  value.includes(option.id)
                    ? "bg-green border-green text-white"
                    : "border-green/30"
                }`}
              >
                {value.includes(option.id) && "✓"}
              </span>
              {option.option_text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Text Input Component
function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-6 py-4 text-lg border-2 border-green/20 rounded-lg focus:outline-none focus:border-green bg-white"
      placeholder="Digite sua resposta..."
    />
  );
}

// TextArea Input Component
function TextAreaInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-6 py-4 text-lg border-2 border-green/20 rounded-lg focus:outline-none focus:border-green bg-white resize-none"
      rows={4}
      placeholder="Digite sua resposta..."
    />
  );
}
