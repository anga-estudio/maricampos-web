"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllContent, saveContent } from "@/lib/supabase/content";

type GeneralSettings = {
  payment_link: string;
  payment_buttons_enabled: boolean;
  whatsapp_number: string;
  header_phrase: string;
  start_date: string;
  weeks_count: number;
  weekly_meeting_minutes: number;
  daily_practice_min: number;
  daily_practice_max: number;
  price: number;
};

type IncludedItem = { title: string; description: string };
type JourneyPhase = {
  weeks: string;
  title: string;
  items: string[];
  outcome: string;
};
type Transformation = { before: string; after: string };
type Testimonial = { name: string; text: string };
type FaqItem = { question: string; answer: string };
type MentorInfo = { title: string; name: string; description: string };

const tabs = [
  { id: "general", label: "Geral" },
  { id: "target_audience", label: "Isso é pra você se" },
  { id: "included", label: "O que está incluso" },
  { id: "journey", label: "A jornada" },
  { id: "transformations", label: "O que muda" },
  { id: "outcomes", label: "O que a Nayá entrega" },
  { id: "mentor", label: "Mentora" },
  { id: "testimonials", label: "Depoimentos" },
  { id: "works_even_if", label: "Funciona mesmo que" },
  { id: "faq", label: "FAQ" },
];

export default function NayaEditor() {
  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAllContent("naya").then((content) => {
      setData(content);
      setLoading(false);
    });
  }, []);

  const save = useCallback(
    async (key: string, value: unknown) => {
      setSaving(true);
      setSaved(false);
      const ok = await saveContent("naya", key, value);
      setSaving(false);
      if (ok) {
        setData((prev) => ({ ...prev, [key]: value }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    },
    []
  );

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

      {/* Tab Content */}
      {activeTab === "general" && (
        <GeneralTab
          data={(data.general as GeneralSettings) || {}}
          onSave={(v) => save("general", v)}
        />
      )}
      {activeTab === "target_audience" && (
        <StringListTab
          title="Isso é pra você se..."
          description="Lista de situações com as quais o público-alvo se identifica."
          items={(data.target_audience as string[]) || []}
          onSave={(v) => save("target_audience", v)}
        />
      )}
      {activeTab === "included" && (
        <IncludedTab
          items={(data.included as IncludedItem[]) || []}
          onSave={(v) => save("included", v)}
        />
      )}
      {activeTab === "journey" && (
        <JourneyTab
          phases={(data.journey as JourneyPhase[]) || []}
          onSave={(v) => save("journey", v)}
        />
      )}
      {activeTab === "transformations" && (
        <TransformationsTab
          items={(data.transformations as Transformation[]) || []}
          onSave={(v) => save("transformations", v)}
        />
      )}
      {activeTab === "outcomes" && (
        <StringListTab
          title="O que a Nayá te entrega ao final de 8 semanas"
          description="Lista de resultados que a participante alcança."
          items={(data.outcomes as string[]) || []}
          onSave={(v) => save("outcomes", v)}
        />
      )}
      {activeTab === "mentor" && (
        <MentorTab
          data={(data.mentor as MentorInfo) || {}}
          onSave={(v) => save("mentor", v)}
        />
      )}
      {activeTab === "testimonials" && (
        <TestimonialsTab
          items={(data.testimonials as Testimonial[]) || []}
          onSave={(v) => save("testimonials", v)}
        />
      )}
      {activeTab === "works_even_if" && (
        <StringListTab
          title="A Nayá funciona mesmo que você..."
          description="Lista de cenários em que o programa ainda funciona."
          items={(data.works_even_if as string[]) || []}
          onSave={(v) => save("works_even_if", v)}
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

function SaveButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-lg bg-sage text-white font-medium hover:bg-sage-dark transition disabled:opacity-50 cursor-pointer"
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
    payment_link: data.payment_link || "",
    payment_buttons_enabled: data.payment_buttons_enabled ?? true,
    whatsapp_number: data.whatsapp_number || "",
    header_phrase: data.header_phrase || "",
    start_date: data.start_date || "",
    weeks_count: data.weeks_count || 8,
    weekly_meeting_minutes: data.weekly_meeting_minutes || 90,
    daily_practice_min: data.daily_practice_min || 10,
    daily_practice_max: data.daily_practice_max || 20,
    price: data.price || 0,
  });

  const set = (key: keyof GeneralSettings, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Botões e Links</h3>
        <Input
          label="Link de pagamento"
          value={form.payment_link}
          onChange={(v) => set("payment_link", v)}
          placeholder="https://..."
        />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="payment_enabled"
            checked={form.payment_buttons_enabled}
            onChange={(e) => set("payment_buttons_enabled", e.target.checked)}
            className="w-4 h-4 rounded border-sand text-sage focus:ring-sage"
          />
          <label htmlFor="payment_enabled" className="text-sm text-foreground">
            Botões de pagamento habilitados
          </label>
        </div>
        <Input
          label="Número do WhatsApp (com DDI)"
          value={form.whatsapp_number}
          onChange={(v) => set("whatsapp_number", v)}
          placeholder="5564992463702"
        />
      </section>

      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Header</h3>
        <Textarea
          label="Frase principal"
          value={form.header_phrase}
          onChange={(v) => set("header_phrase", v)}
          rows={2}
        />
      </section>

      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">
          Detalhes do programa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de início"
            type="date"
            value={form.start_date}
            onChange={(v) => set("start_date", v)}
          />
          <Input
            label="Quantidade de semanas"
            type="number"
            value={form.weeks_count}
            onChange={(v) => set("weeks_count", parseInt(v) || 0)}
          />
          <Input
            label="Duração do encontro semanal (minutos)"
            type="number"
            value={form.weekly_meeting_minutes}
            onChange={(v) => set("weekly_meeting_minutes", parseInt(v) || 0)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Prática diária - mín (min)"
              type="number"
              value={form.daily_practice_min}
              onChange={(v) => set("daily_practice_min", parseInt(v) || 0)}
            />
            <Input
              label="Prática diária - máx (min)"
              type="number"
              value={form.daily_practice_max}
              onChange={(v) => set("daily_practice_max", parseInt(v) || 0)}
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Valor</h3>
        <Input
          label="Preço (R$)"
          type="number"
          value={form.price}
          onChange={(v) => set("price", parseFloat(v) || 0)}
        />
      </section>

      <SaveButton onClick={() => onSave(form)} />
    </div>
  );
}

/* ───────── String List Tab (reusable) ───────── */

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

  const remove = (i: number) => setList((prev) => prev.filter((_, idx) => idx !== i));

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

/* ───────── Included Tab ───────── */

function IncludedTab({
  items,
  onSave,
}: {
  items: IncludedItem[];
  onSave: (v: IncludedItem[]) => void;
}) {
  const [list, setList] = useState<IncludedItem[]>(items);

  const update = (i: number, field: keyof IncludedItem, v: string) =>
    setList((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: v } : item))
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setList((prev) => [...prev, { title: "", description: "" }]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">O que está incluso</h3>
        <p className="text-sm text-text-muted mt-1">
          Itens inclusos no programa com título e descrição.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-sand p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-muted">{i + 1}.</span>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Remover
              </button>
            </div>
            <Input
              label="Título"
              value={item.title}
              onChange={(v) => update(i, "title", v)}
            />
            <Textarea
              label="Descrição"
              value={item.description}
              onChange={(v) => update(i, "description", v)}
              rows={2}
            />
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
        <SaveButton
          onClick={() =>
            onSave(list.filter((i) => i.title.trim() || i.description.trim()))
          }
        />
      </div>
    </div>
  );
}

/* ───────── Journey Tab ───────── */

function JourneyTab({
  phases,
  onSave,
}: {
  phases: JourneyPhase[];
  onSave: (v: JourneyPhase[]) => void;
}) {
  const [list, setList] = useState<JourneyPhase[]>(phases);

  const updatePhase = (i: number, field: keyof JourneyPhase, v: unknown) =>
    setList((prev) =>
      prev.map((phase, idx) => (idx === i ? { ...phase, [field]: v } : phase))
    );

  const updateItem = (phaseIdx: number, itemIdx: number, v: string) =>
    setList((prev) =>
      prev.map((phase, i) =>
        i === phaseIdx
          ? {
              ...phase,
              items: phase.items.map((item, j) => (j === itemIdx ? v : item)),
            }
          : phase
      )
    );

  const addItem = (phaseIdx: number) =>
    setList((prev) =>
      prev.map((phase, i) =>
        i === phaseIdx ? { ...phase, items: [...phase.items, ""] } : phase
      )
    );

  const removeItem = (phaseIdx: number, itemIdx: number) =>
    setList((prev) =>
      prev.map((phase, i) =>
        i === phaseIdx
          ? { ...phase, items: phase.items.filter((_, j) => j !== itemIdx) }
          : phase
      )
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setList((prev) => [
      ...prev,
      { weeks: "", title: "", items: [""], outcome: "" },
    ]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">A jornada</h3>
        <p className="text-sm text-text-muted mt-1">
          Fases do programa com atividades e resultados.
        </p>
      </div>

      <div className="space-y-6">
        {list.map((phase, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-sand p-5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-sage">
                Fase {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Remover fase
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Semanas"
                value={phase.weeks}
                onChange={(v) => updatePhase(i, "weeks", v)}
                placeholder="Semanas 1-2"
              />
              <Input
                label="Título"
                value={phase.title}
                onChange={(v) => updatePhase(i, "title", v)}
                placeholder="Voltar pra casa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Itens
              </label>
              <div className="space-y-2">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(e) => updateItem(i, j, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-sand bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                    />
                    <button
                      onClick={() => removeItem(i, j)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem(i)}
                  className="text-xs text-sage hover:text-sage-dark cursor-pointer"
                >
                  + Adicionar item
                </button>
              </div>
            </div>

            <Textarea
              label="Resultado"
              value={phase.outcome}
              onChange={(v) => updatePhase(i, "outcome", v)}
              rows={2}
            />
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
      >
        + Adicionar fase
      </button>

      <div className="pt-2">
        <SaveButton onClick={() => onSave(list)} />
      </div>
    </div>
  );
}

/* ───────── Transformations Tab ───────── */

function TransformationsTab({
  items,
  onSave,
}: {
  items: Transformation[];
  onSave: (v: Transformation[]) => void;
}) {
  const [list, setList] = useState<Transformation[]>(items);

  const update = (i: number, field: keyof Transformation, v: string) =>
    setList((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: v } : item))
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setList((prev) => [...prev, { before: "", after: "" }]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">
          O que muda em 8 semanas
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Comparação antes e depois para cada transformação.
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
                Transformação {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Remover
              </button>
            </div>
            <Textarea
              label="Antes"
              value={item.before}
              onChange={(v) => update(i, "before", v)}
              rows={2}
            />
            <Textarea
              label="Depois"
              value={item.after}
              onChange={(v) => update(i, "after", v)}
              rows={2}
            />
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
      >
        + Adicionar transformação
      </button>

      <div className="pt-2">
        <SaveButton onClick={() => onSave(list)} />
      </div>
    </div>
  );
}

/* ───────── Mentor Tab ───────── */

function MentorTab({
  data,
  onSave,
}: {
  data: Partial<MentorInfo>;
  onSave: (v: MentorInfo) => void;
}) {
  const [form, setForm] = useState<MentorInfo>({
    title: data.title || "",
    name: data.name || "",
    description: data.description || "",
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">
          Quem vai caminhar com você
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Informações sobre a mentora.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-sand p-6 space-y-4">
        <Input
          label="Título da seção"
          value={form.title}
          onChange={(v) => setForm((prev) => ({ ...prev, title: v }))}
        />
        <Input
          label="Nome"
          value={form.name}
          onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
        />
        <Textarea
          label="Descrição"
          value={form.description}
          onChange={(v) => setForm((prev) => ({ ...prev, description: v }))}
          rows={5}
        />
      </div>

      <SaveButton onClick={() => onSave(form)} />
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

  const update = (i: number, field: keyof Testimonial, v: string) =>
    setList((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: v } : item))
    );

  const remove = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setList((prev) => [...prev, { name: "", text: "" }]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Depoimentos</h3>
        <p className="text-sm text-text-muted mt-1">
          Depoimentos sobre a experiência com a Mari.
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
          onClick={() => onSave(list.filter((i) => i.name.trim() || i.text.trim()))}
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
            onSave(
              list.filter((i) => i.question.trim() || i.answer.trim())
            )
          }
        />
      </div>
    </div>
  );
}
