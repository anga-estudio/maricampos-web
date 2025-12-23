"use client";

import Image from "next/image";
import { useState } from "react";

const CTA_LINK = "https://example.com"; // Substituir pelo link real

const faqs = [
  {
    question: "Para quem é o programa Silencie?",
    answer:
      "O Silencie é para qualquer pessoa que busca mais paz interior, clareza mental e uma conexão mais profunda consigo mesma. Não é necessário ter experiência prévia com meditação.",
  },
  {
    question: "Quanto tempo dura a imersão?",
    answer:
      "A imersão completa é estruturada para ser realizada ao longo de algumas semanas, com práticas diárias que se adaptam à sua rotina. Você terá acesso ao conteúdo para seguir no seu próprio ritmo.",
  },
  {
    question: "Preciso de algum material especial?",
    answer:
      "Não. Apenas um espaço tranquilo onde você possa praticar sem interrupções. Recomendamos fones de ouvido para uma experiência mais imersiva.",
  },
  {
    question: "Como funciona o acesso ao programa?",
    answer:
      "Após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso à plataforma onde todo o conteúdo estará disponível.",
  },
  {
    question: "Posso fazer as práticas em qualquer horário?",
    answer:
      "Sim. O conteúdo fica disponível 24 horas por dia. Você escolhe o melhor momento para sua prática, seja ao amanhecer ou antes de dormir.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-green/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-foreground">{question}</span>
        <span className="ml-4 text-2xl text-green">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-foreground font-sans">
      {/* Hero Section with Video Background */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 px-6 text-center text-white">
          <Image
            src="/logo.svg"
            alt="Silencie"
            width={320}
            height={81}
            priority
            className="mx-auto mb-12"
          />
          <p className="mx-auto max-w-xl text-xl leading-relaxed text-white/90 mb-12">
            Uma imersão para silenciar o ruído exterior e despertar a paz que já
            existe em você.
          </p>
          <a
            href={CTA_LINK}
            className="inline-block rounded-full bg-terracotta px-8 py-4 text-lg font-medium text-white transition-all hover:bg-terracotta/90"
          >
            Quero participar
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            className="opacity-70"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-8 text-3xl font-light tracking-tight text-green">
              O que é o Silencie?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted">
              <p>
                Vivemos em um mundo de estímulos constantes. Notificações, prazos,
                preocupações. O Silencie é um convite para pausar.
              </p>
              <p>
                Esta imersão foi criada para guiar você através de práticas de
                meditação que cultivam presença, clareza e serenidade.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
              alt="Meditação ao amanhecer"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <blockquote className="text-2xl font-light leading-relaxed text-green md:text-3xl">
            &ldquo;Não é sobre esvaziar a mente, mas sobre encontrar espaço dentro do caos.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-green">
          O que você vai vivenciar
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Práticas guiadas",
              description:
                "Meditações conduzidas passo a passo para iniciantes e praticantes.",
              image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
            },
            {
              title: "Exercícios de respiração",
              description:
                "Técnicas para acalmar o sistema nervoso e encontrar equilíbrio.",
              image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=600&q=80",
            },
            {
              title: "Reflexões diárias",
              description:
                "Momentos de introspecção para cultivar autoconhecimento.",
              image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80",
            },
            {
              title: "Comunidade de apoio",
              description:
                "Conexão com outras pessoas que compartilham da mesma jornada.",
              image: "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=600&q=80",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-xl font-medium">{benefit.title}</h3>
                <p className="text-white/80">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-green">
            Perguntas frequentes
          </h2>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-light tracking-tight text-green md:text-4xl">
            Pronto para silenciar?
          </h2>
          <p className="mb-12 text-lg text-muted">
            Dê o primeiro passo em direção a uma vida mais presente e serena.
          </p>
          <a
            href={CTA_LINK}
            className="inline-block rounded-full bg-green px-10 py-4 text-lg font-medium text-white transition-all hover:bg-green/90"
          >
            Começar minha jornada
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green/10 px-6 py-12 text-center">
        <Image
          src="/logo.svg"
          alt="Silencie"
          width={120}
          height={30}
          className="mx-auto mb-4"
        />
        <p className="text-sm text-muted">
          Silencie. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
