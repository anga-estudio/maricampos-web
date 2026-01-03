"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const CTA_LINK = "https://wa.me/5564992463702";

function BoldSilencie({ children }: { children: string }) {
  const parts = children.split(/(Silencie)/g);
  return (
    <>
      {parts.map((part, index) =>
        part === "Silencie" ? <strong key={index}>{part}</strong> : part
      )}
    </>
  );
}

const faqs = [
  {
    question: "Nunca meditei. Posso fazer o Silencie?",
    answer: "Sim. As meditações são guiadas e progressivas. Você não precisa ter experiência prévia.",
  },
  {
    question: "Já medito. O programa ainda faz sentido para mim?",
    answer: "Sim. O Silencie aprofunda a prática, trazendo constância, estrutura e novos olhares sobre presença, mente e cotidiano.",
  },
  {
    question: "Quanto tempo por dia preciso dedicar?",
    answer: "Entre 15 a 20 minutos por dia.",
  },
  {
    question: "Haverá acompanhamento durante o programa?",
    answer: "Sim. O Silencie conta com um grupo exclusivo onde a Mentora dá suporte diário, além de encontros ao vivo.",
  },
  {
    question: "Por onde recebo os áudios de meditação?",
    answer: "Os áudios de meditação são enviados diariamente em uma comunidade exclusiva no WhatsApp, criada para sustentar a prática ao longo dos 21 dias. É nesse espaço que você recebe as orientações, os áudios e o acompanhamento do Silencie, caminhando junto com outras pessoas comprometidas com o processo.",
  },
  {
    question: "E se eu não conseguir fazer a meditação no horário que for enviada?",
    answer: "Você pode fazer a meditação no horário que fizer mais sentido para a sua rotina. Os áudios ficam disponíveis para que você pratique no seu tempo.",
  },
  {
    question: "Se eu perder um dia, atrapalha o processo?",
    answer: "Não. Você pode retomar no dia seguinte e seguir no seu ritmo.",
  },
  {
    question: "Já tentei meditar antes e não consegui. Por que dessa vez seria diferente?",
    answer: "Porque você não estará sozinha. Terá um guia experiente, uma comunidade ativa e uma jornada estruturada de 21 dias para criar o hábito de verdade.",
  },
];

const programContent = [
  {
    title: "Meditação guiada",
    items: [
      "Vinte e um dias de meditação guiada",
      "Práticas diárias, progressivas e acessíveis",
      "Acesso simples, direto no celular",
      "Acompanhamento e condução cuidadosa ao longo da jornada",
    ],
    image: "/photos/card-1.webp",
  },
  {
    title: "Encontros e Yoga",
    items: [
      "Dois encontros ao vivo com a mentora para aprofundar presença, respiração e sustentação da prática",
      "Uma aula de yoga presencial",
      "Uma aula de yoga online para quem não puder estar presencialmente",
    ],
    image: "/photos/card-2.png",
  },
  {
    title: "Bônus exclusivos",
    items: [
      "Workshop exclusivo de Pranayama (respiração consciente aplicada à vida real)",
      "Aula extra com nutricionista convidada sobre comida limpa, alimentação consciente e inflamação",
    ],
    image: "/photos/card-3.png",
  },
  {
    title: "Premiações",
    items: [
      "Reconhecimento para quem se comprometer com o processo",
      "As pessoas mais engajadas concorrem a prêmios especiais",
    ],
    image: "/photos/card-4.png",
  },
];

const rewards: { text: string; bold?: string; suffix?: string }[] = [
  { text: "Uma vaga de mentoria individual com Mari Campos" },
  { text: "Uma tiragem de carta de oráculo" },
  { text: "Um mês de aulas de yoga" },
  { text: "Uma almofada de meditação" },
  { text: "Um kit de produtos naturais e suplementos" },
  { text: "Uma vaga no programa ", bold: "Desinflame", suffix: ", da nutricionista Mari Ulhoa (programa de emagrecimento consciente)" },
];

function FAQItem({
  question,
  answer,
  isLast = false,
}: {
  question: string;
  answer: string;
  isLast?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isLast ? "" : "border-b border-green/20"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-green"><BoldSilencie>{question}</BoldSilencie></span>
        <span className="ml-4 text-2xl text-green">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-green leading-relaxed"><BoldSilencie>{answer}</BoldSilencie></p>
      </div>
    </div>
  );
}

export default function Home() {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsSoundOn(!isSoundOn);
    }
  };

  return (
    <div className="min-h-screen bg-background text-green font-sans">
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

        {/* Ocean Sound */}
        <audio ref={audioRef} loop>
          <source
            src="https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3"
            type="audio/mpeg"
          />
        </audio>

        {/* Header Buttons */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white transition-all hover:bg-white/30"
            aria-label={isSoundOn ? "Desativar som" : "Ativar som"}
          >
          {isSoundOn ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
          <span className="text-sm">{isSoundOn ? "Som ligado" : "Som desligado"}</span>
          </button>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 px-6 text-center text-white">
          <Image
            src="/logo-white.svg"
            alt="Silencie"
            width={480}
            height={121}
            priority
            className="mx-auto mb-12"
          />
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 mb-12">
            O <strong>Silencie</strong> ensina, por meio da prática diária de meditação, como sair do piloto automático, parar de viver reativo e ansioso, e aprender a habitar a própria mente com mais clareza, gentileza e confiança.
          </p>
          <a
            href={CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-green px-8 py-4 text-lg font-medium text-white transition-all hover:bg-green/90"
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
              O que é o <strong>Silencie</strong>?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-green">
              <p>
                O <strong>Silencie</strong> é um programa de meditação guiada de 21 dias, criado para pessoas que sentem a mente acelerada, cansada e sobrecarregada, e querem aprender, na prática, a desligar o piloto automático e criar mais clareza emocional no dia a dia.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/photos/mari.webp"
              alt="Mari Campos"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Training Benefits Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-3xl font-light tracking-tight text-green">
            O que você recebe no <strong>Silencie</strong>
          </h2>
          <p className="mb-12 text-center text-green max-w-2xl mx-auto">
            Uma experiência completa de presença ao longo de vinte e um dias
          </p>
          <div className="flex flex-col gap-6 max-w-lg mx-auto">
            {[
              "Acesso ao programa de meditação guiada de vinte e um dias",
              "Práticas diárias organizadas e progressivas",
              "Dois encontros online ao vivo com a mentora",
              "Uma aula de yoga presencial e uma online",
              "Workshop bônus de Pranayama (respiração)",
              "Aula bônus com nutricionista (alimentação consciente)",
              "Participação nas premiações por comprometimento",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-lg text-green">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-green mb-4">Mesmo que você:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Nunca tenha meditado",
                `Ache que "não consegue parar a cabeça"`,
                "Tenha uma rotina corrida",
              ].map((item) => (
                <span key={item} className="rounded-full bg-green/10 px-4 py-2 text-sm text-green">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-24 bg-green">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-white">
            Um treino diário, simples e guiado
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Desacelerar o barulho da mente que nunca para e te deixa exausta",
              "Sair do modo alerta constante, onde o corpo vive tensionado e reagindo a tudo",
              "Dar clareza pra pensamentos embaralhados, pra você conseguir finalmente se ouvir",
              "Soltar o peso emocional acumulado — o que você sente, pensa e nem sabe nomear",
              "Acalmar a irritação e a ansiedade, que viram sua companhia diária sem você querer",
              "Construir presença, quando tudo em volta parece te puxar pra mil direções",
              "Criar espaço interno, pra parar de viver só reagindo e começar a escolher",
              "Reconstruir o seu centro, pra que o caos de fora não vire caos dentro",
              "Fortalecer sua estabilidade emocional, pra parar de oscilar entre euforia e exaustão",
              "Aprender a lidar com a mente que divaga o tempo todo (a famosa \"mente macaco\")",
              "Acessar descanso de verdade, não só sono — descanso no corpo, na mente, no emocional",
              "Se sentir em casa dentro de você, mesmo depois de anos vivendo no automático",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4">
                <span className="text-white/80 mt-1">•</span>
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Content Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-3xl font-light tracking-tight text-green">
            Durante os vinte e um dias do <strong>Silencie</strong>
          </h2>
          <p className="mb-12 text-center text-green max-w-2xl mx-auto">
            Você vai participar de uma experiência completa de presença, que inclui:
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            {programContent.map((section) => (
              <div key={section.title} className="rounded-2xl border border-green/20 p-8">
                <h3 className="mb-4 text-xl font-medium text-green">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-green">
                      <span className="text-green">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section - Mari Campos */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/photos/mari2.jpg"
              alt="Mari Campos"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="mb-8 text-3xl font-light tracking-tight text-green">
              Quem vai te guiar?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-green">
              <p>
                <strong className="text-green">Mari Campos</strong> é professora de yoga e meditação e facilitadora de processos de autoconhecimento.
              </p>
              <p>
                Há mais de uma década, dedica-se ao estudo, à prática e à transmissão de técnicas de meditação, yoga, respiração consciente e presença, conduzindo alunos e jornadas no Brasil e no exterior.
              </p>
              <p>
                Sua abordagem une profundidade, constância e acolhimento. Mari conduz pessoas em jornadas de reconexão interior com firmeza e sensibilidade, criando espaços seguros para o silêncio, a escuta e a transformação acontecerem de forma sustentada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-24 border-b border-green/10">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-sm uppercase tracking-widest text-green/60 mb-4">Premiações por comprometimento</p>
          <h2 className="mb-6 text-center text-3xl font-light tracking-tight text-green">
            Reconhecimento para quem se comprometer
          </h2>
          <p className="mb-12 text-center text-green max-w-2xl mx-auto">
            Durante os vinte e um dias, vamos reconhecer quem realmente se comprometer com o processo. As pessoas mais engajadas concorrem a:
          </p>
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-3">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-4 p-5 rounded-lg border border-green/20 bg-white">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green/10 flex items-center justify-center">
                  <span className="text-green text-lg">✦</span>
                </span>
                <span className="text-green">
                  {reward.text}
                  {reward.bold && <strong>{reward.bold}</strong>}
                  {reward.suffix}
                </span>
              </div>
            ))}
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

      {/* Divider */}
      <div className="border-t border-green/10" />

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-green">
            Perguntas frequentes
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} isLast={index === faqs.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-light tracking-tight text-green md:text-4xl">
            Pronto para o <strong>Silencie</strong>?
          </h2>
          <p className="mb-12 text-lg text-green">
            Dê o primeiro passo em direção a uma vida mais presente e serena.
          </p>
          <a
            href={CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
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
        <a
          href="https://www.instagram.com/maricamposyogi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center mb-4 text-green hover:text-green/80 transition-colors"
          aria-label="Instagram de Mari Campos"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <p className="text-sm text-green">
          <strong>Silencie</strong>. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
