"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllContent, saveContent } from "@/lib/supabase/content";
import { createClient } from "@/lib/supabase/client";

type GeneralSettings = {
  header_title: string;
  header_description: string;
  payment_link: string;
  whatsapp_number: string;
  start_date: string;
  price: number;
};

type FaqItem = { question: string; answer: string };
type Testimonial = { name: string; photo: string; text: string };
type ProgramIncludes = {
  meditation: string[];
  meetings: string[];
  bonus: string[];
};

const tabs = [
  { id: "general", label: "Geral" },
  { id: "daily_training", label: "Treino diário" },
  { id: "rewards", label: "Premiações" },
  { id: "program_includes", label: "O que recebe" },
  { id: "testimonials", label: "Depoimentos" },
  { id: "faq", label: "FAQ" },
];

export default function SilencieEditor() {
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAllContent("silencie").then((content) => {
      setData(content);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (key: string, value: unknown) => {
    setSaving(true);
    setSaved(false);
    const ok = await saveContent("silencie", key, value);
    setSaving(false);
    if (ok) {
      setData((prev) => ({ ...prev, [key]: value }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-text-muted text-sm py-12 text-center">
        Carregando...
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-sand pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-sage text-white"
                : "text-text-muted hover:bg-sand/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="h-6 mb-4">
        {saving && (
          <span className="text-sm text-text-muted">Salvando...</span>
        )}
        {saved && (
          <span className="text-sm text-green-600">Salvo com sucesso!</span>
        )}
      </div>

      {activeTab === "general" && (
        <GeneralTab
          data={(data.general as GeneralSettings) || {}}
          onSave={(v) => save("general", v)}
        />
      )}
      {activeTab === "daily_training" && (
        <StringListTab
          title="Um treino diário, simples e guiado que vai te ajudar a..."
          description="Lista de benefícios do treino diário."
          items={(data.daily_training as string[]) || []}
          onSave={(v) => save("daily_training", v)}
        />
      )}
      {activeTab === "rewards" && (
        <StringListTab
          title="Premiações por comprometimento"
          description="Lista de premiações para as participantes mais engajadas."
          items={(data.rewards as string[]) || []}
          onSave={(v) => save("rewards", v)}
        />
      )}
      {activeTab === "program_includes" && (
        <ProgramIncludesTab
          data={(data.program_includes as ProgramIncludes) || {}}
          onSave={(v) => save("program_includes", v)}
        />
      )}
      {activeTab === "testimonials" && (
        <TestimonialsTab
          items={(data.testimonials as Testimonial[]) || []}
          onSave={(v) => save("testimonials", v)}
        />
      )}
      {activeTab === "faq" && (
        <FaqTab
          items={(data.faq as FaqItem[]) || []}
          onSave={(v) => save("faq", v)}
        />
      )}
    </div>
  );
}

/* ───────── Shared Components ───────── */

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 rounded-lg bg-sage text-white font-medium hover:bg-sage-dark transition cursor-pointer"
    >
      Salvar alterações
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition resize-y"
      />
    </div>
  );
}

/* ───────── General Tab ───────── */

function GeneralTab({
  data,
  onSave,
}: {
  data: Partial<GeneralSettings>;
  onSave: (v: GeneralSettings) => void;
}) {
  const [form, setForm] = useState<GeneralSettings>({
    header_title: data.header_title || "",
    header_description: data.header_description || "",
    payment_link: data.payment_link || "",
    whatsapp_number: data.whatsapp_number || "",
    start_date: data.start_date || "",
    price: data.price || 0,
  });

  const set = (key: keyof GeneralSettings, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Header</h3>
        <Input
          label="Título"
          value={form.header_title}
          onChange={(v) => set("header_title", v)}
        />
        <Textarea
          label="Descrição"
          value={form.header_description}
          onChange={(v) => set("header_description", v)}
          rows={2}
        />
      </section>

      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Links</h3>
        <Input
          label="Link de pagamento"
          value={form.payment_link}
          onChange={(v) => set("payment_link", v)}
          placeholder="https://..."
        />
        <Input
          label="Número do WhatsApp (com DDI)"
          value={form.whatsapp_number}
          onChange={(v) => set("whatsapp_number", v)}
          placeholder="5564992463702"
        />
      </section>

      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Programa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de início"
            type="date"
            value={form.start_date}
            onChange={(v) => set("start_date", v)}
          />
          <Input
            label="Preço (R$)"
            type="number"
            value={form.price}
            onChange={(v) => set("price", parseFloat(v) || 0)}
          />
        </div>
      </section>

      <SaveButton onClick={() => onSave(form)} />
    </div>
  );
}

/* ───────── String List Tab ───────── */

function StringListTab({
  title,
  description,
  items,
  onSave,
}: {
  title: string;
  description: string;
  items: string[];
  onSave: (v: string[]) => void;
}) {
  const [list, setList] = useState<string[]>(items);

  const update = (i: number, v: string) =>
    setList((prev) => prev.map((item, idx) => (idx === i ? v : item)));

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setList((prev) => [...prev, ""]);

  const move = (i: number, dir: -1 | 1) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-text-muted mt-1">{description}</p>
      </div>

      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-xs text-text-muted mt-3 w-6 text-right shrink-0">
              {i + 1}.
            </span>
            <textarea
              value={item}
              onChange={(e) => update(i, e.target.value)}
              rows={2}
              className="flex-1 px-4 py-2.5 rounded-lg border border-sand bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition resize-y text-sm"
            />
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-xs text-text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                className="text-xs text-text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
              >
                ▼
              </button>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
      >
        + Adicionar item
      </button>

      <div className="pt-2">
        <SaveButton onClick={() => onSave(list.filter((s) => s.trim()))} />
      </div>
    </div>
  );
}

/* ───────── Program Includes Tab ───────── */

function ProgramIncludesTab({
  data,
  onSave,
}: {
  data: Partial<ProgramIncludes>;
  onSave: (v: ProgramIncludes) => void;
}) {
  const [form, setForm] = useState<ProgramIncludes>({
    meditation: data.meditation || [],
    meetings: data.meetings || [],
    bonus: data.bonus || [],
  });

  const updateList = (
    category: keyof ProgramIncludes,
    i: number,
    v: string
  ) =>
    setForm((prev) => ({
      ...prev,
      [category]: prev[category].map((item, idx) => (idx === i ? v : item)),
    }));

  const removeFromList = (category: keyof ProgramIncludes, i: number) =>
    setForm((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== i),
    }));

  const addToList = (category: keyof ProgramIncludes) =>
    setForm((prev) => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));

  const sections: { key: keyof ProgramIncludes; label: string }[] = [
    { key: "meditation", label: "Meditação Guiada" },
    { key: "meetings", label: "Encontros e Yoga" },
    { key: "bonus", label: "Bônus Exclusivos" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground">
          Durante os 21 dias do Silencie você vai receber
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Itens organizados por categoria.
        </p>
      </div>

      {sections.map((section) => (
        <div
          key={section.key}
          className="bg-white rounded-xl border border-sand p-5 space-y-3"
        >
          <h4 className="text-sm font-semibold text-sage">{section.label}</h4>
          <div className="space-y-2">
            {form[section.key].map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) =>
                    updateList(section.key, i, e.target.value)
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-sand bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                />
                <button
                  onClick={() => removeFromList(section.key, i)}
                  className="text-xs text-red-500 hover:text-red-700 px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addToList(section.key)}
              className="text-xs text-sage hover:text-sage-dark cursor-pointer"
            >
              + Adicionar item
            </button>
          </div>
        </div>
      ))}

      <SaveButton
        onClick={() =>
          onSave({
            meditation: form.meditation.filter((s) => s.trim()),
            meetings: form.meetings.filter((s) => s.trim()),
            bonus: form.bonus.filter((s) => s.trim()),
          })
        }
      />
    </div>
  );
}

/* ───────── Testimonials Tab ───────── */

function TestimonialsTab({
  items,
  onSave,
}: {
  items: Testimonial[];
  onSave: (v: Testimonial[]) => void;
}) {
  const [list, setList] = useState<Testimonial[]>(items);
  const [uploading, setUploading] = useState<number | null>(null);

  const update = (i: number, field: keyof Testimonial, v: string) =>
    setList((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: v } : item))
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setList((prev) => [...prev, { name: "", photo: "", text: "" }]);

  const handlePhotoUpload = async (i: number, file: File) => {
    setUploading(i);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `silencie/testimonials/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: true });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(path);
      update(i, "photo", publicUrl);
    }
    setUploading(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Depoimentos</h3>
        <p className="text-sm text-text-muted mt-1">
          Depoimentos com nome, foto e texto.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-sand p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-muted">
                Depoimento {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Remover
              </button>
            </div>
            <Input
              label="Nome"
              value={item.name}
              onChange={(v) => update(i, "name", v)}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Foto
              </label>
              <div className="flex items-center gap-3">
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border border-sand"
                  />
                )}
                <label className="text-sm text-sage hover:text-sage-dark transition cursor-pointer">
                  {uploading === i
                    ? "Enviando..."
                    : item.photo
                      ? "Trocar foto"
                      : "Enviar foto"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(i, file);
                    }}
                  />
                </label>
                {item.photo && (
                  <button
                    onClick={() => update(i, "photo", "")}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
            <Textarea
              label="Depoimento"
              value={item.text}
              onChange={(v) => update(i, "text", v)}
              rows={4}
            />
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
      >
        + Adicionar depoimento
      </button>

      <div className="pt-2">
        <SaveButton
          onClick={() =>
            onSave(list.filter((i) => i.name.trim() || i.text.trim()))
          }
        />
      </div>
    </div>
  );
}

/* ───────── FAQ Tab ───────── */

function FaqTab({
  items,
  onSave,
}: {
  items: FaqItem[];
  onSave: (v: FaqItem[]) => void;
}) {
  const [list, setList] = useState<FaqItem[]>(items);

  const update = (i: number, field: keyof FaqItem, v: string) =>
    setList((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: v } : item))
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setList((prev) => [...prev, { question: "", answer: "" }]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Perguntas frequentes</h3>
        <p className="text-sm text-text-muted mt-1">
          Perguntas e respostas exibidas no FAQ do site.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-sand p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-muted">
                Pergunta {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Remover
              </button>
            </div>
            <Input
              label="Pergunta"
              value={item.question}
              onChange={(v) => update(i, "question", v)}
            />
            <Textarea
              label="Resposta"
              value={item.answer}
              onChange={(v) => update(i, "answer", v)}
              rows={3}
            />
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
      >
        + Adicionar pergunta
      </button>

      <div className="pt-2">
        <SaveButton
          onClick={() =>
            onSave(list.filter((i) => i.question.trim() || i.answer.trim()))
          }
        />
      </div>
    </div>
  );
}
