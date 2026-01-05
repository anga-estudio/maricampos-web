"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const CTA_LINK = "https://loja.infinitepay.io/maricamposyogi/ccd7542-silencie";

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
      "21 dias de meditação guiada",
      "Práticas diárias, progressivas e acessíveis",
      "Acesso simples, direto no celular",
      "Acompanhamento e condução cuidadosa ao longo da jornada através de um grupo exclusivo no WhatsApp",
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
      "Aula com a nutricionista convidada Mariane Ulhôa sobre comida limpa, alimentação consciente e desinflamação",
    ],
    image: "/photos/card-3.png",
  },
];

const rewards: { text: string; bold?: string; suffix?: string }[] = [
  { text: "Uma vaga de mentoria com Mari Campos" },
  { text: "Uma tiragem de carta de oráculo" },
  { text: "Um mês de aulas de yoga" },
  { text: "Uma almofada de meditação" },
  { text: "Um kit de produtos naturais e suplementos" },
  { text: "Uma vaga no programa Desinflame, da nutricionista Mariane Ulhôa (programa de emagrecimento consciente)" },
  { text: "Journal exclusivo do Silencie" },
];

const testimonials = [
  {
    name: "Roberta Ludwig",
    image: "/photos/testimonial-1.jpg",
    message: "Eu me sentia mais frágil, mais confusa, mais melancólica. Depois das práticas senti muito mais confiança nas técnicas de autoconhecimento, me interessei por entender quais eram os sentimentos que vinham e por que vinham. Entendi que as emoções são ótimas e podemos nos tranquilizar mesmo nos momentos turbulentos. Percebo que raramente senti novamente os batimentos cardíacos excessivamente acelerados, como acontecia antes. Sei perceber quando uma crise vai se instalar... Aceito a tristeza muito bem, prezo muito mais pelo meu descanso. Adoro ficar em silêncio e em ambientes de maior serenidade. Leio sobre yoga, respiração, e escuto muitos e diversos mantras. As aulas com a Mari são como uma massagem, uma comida gostosa, um dia de férias bem leve. São aulas de carinho com meu corpo.",
  },
  {
    name: "Ana Paula de Oliveira",
    image: "/photos/testimonial-2.jpg",
    message: "Tive a felicidade de ser apresentada, por amigas muito queridas, à Mari, essa profissional incrível, que conduz a prática de yoga, além de outras ferramentas de autoconhecimento, com técnica, leveza e intensidade ao mesmo tempo. 🥰 Mari é uma pessoa linda, que conduz seu trabalho com pura doação, sensibilidade e empatia! ❤️",
  },
  {
    name: "Maria Miguel",
    image: "/photos/testimonial-3.jpg",
    message: "As práticas com a Mari são muito especiais para mim. As aulas vão muito além dos movimentos físicos. As reflexões que ela sempre traz no início e no final da aula trazem foco também para a nossa parte espiritual/energética, o que propicia uma experiência muito mais profunda do que uma aula de yoga comum, proporcionando nos bem estar físico e psicológico. Além disso, ela demonstra uma conexão muito especial com seus alunos, transformando cada prática em momentos de cura para todos.",
  },
];

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative">
      {testimonials.length > 1 && (
        <>
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 w-10 h-10 rounded-full border border-green/20 flex items-center justify-center text-green hover:bg-green/5 transition-colors bg-white z-10"
            aria-label="Depoimento anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 w-10 h-10 rounded-full border border-green/20 flex items-center justify-center text-green hover:bg-green/5 transition-colors bg-white z-10"
            aria-label="Próximo depoimento"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <div className="grid gap-12 md:grid-cols-[200px_1fr] md:items-center min-h-[400px] md:min-h-[280px]">
        <div className="relative aspect-square rounded-full overflow-hidden mx-auto md:mx-0 w-48 md:w-full bg-green/10">
          {current.image ? (
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-green/40">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <blockquote className="text-lg leading-relaxed text-green/90 mb-6">
            &ldquo;{current.message}&rdquo;
          </blockquote>
          <p className="font-medium text-green">{current.name}</p>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-green" : "bg-green/20"
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PricingCard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-green/60 text-xl">R$</span>
          <span className="text-5xl md:text-6xl font-light text-green">
            138,00
          </span>
        </div>
      </div>

      <div className="pt-4">
        <a
          href={CTA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full rounded-full bg-green px-8 py-4 text-lg font-medium text-white transition-all hover:bg-green/90"
        >
          Garantir minha vaga
        </a>
      </div>
    </div>
  );
}

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
    <div className={isLast ? "" : "border-b border-white/20"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-white"><BoldSilencie>{question}</BoldSilencie></span>
        <span className="ml-4 text-2xl text-white">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-white/90 leading-relaxed"><BoldSilencie>{answer}</BoldSilencie></p>
      </div>
    </div>
  );
}

export default function Home() {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Tenta iniciar o áudio na primeira interação do usuário (necessário para mobile)
  useEffect(() => {
    let audioStarted = false;

    const startAudioOnInteraction = () => {
      if (!audioStarted && audioRef.current) {
        audioStarted = true;
        audioRef.current.play().then(() => {
          setIsSoundOn(true);
        }).catch(() => {
          // Se falhar, o usuário pode ativar manualmente
        });
      }
    };

    // Garantir que o vídeo sempre toque
    const ensureVideoPlays = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    // Eventos que indicam interação do usuário
    const events = ["click", "touchstart", "scroll", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, startAudioOnInteraction, { once: true });
    });

    // Tentar iniciar vídeo imediatamente
    ensureVideoPlays();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, startAudioOnInteraction);
      });
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
        setIsSoundOn(false);
      } else {
        audioRef.current.play().then(() => {
          setIsSoundOn(true);
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-green font-sans">
      {/* Hero Section with Video Background */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          style={{
            WebkitAppearance: "none",
          }}
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
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90">
            O <strong>Silencie</strong> ensina, por meio da prática diária de meditação, como sair do piloto automático, parar de viver reativo e ansioso, e aprender a habitar a própria mente com mais clareza, gentileza e confiança.
          </p>
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
      <section className="mx-auto max-w-4xl px-6 pt-24">
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

      {/* Program Content Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-green">
            Durante os 21 dias do <strong>Silencie</strong> você vai receber
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
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

      {/* Rewards Section */}
      <section className="pb-24 border-b border-green/10">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-center text-3xl font-light tracking-tight text-green">
            Premiações por comprometimento
          </h2>
          <p className="mb-12 text-center text-green max-w-2xl mx-auto">
            Durante os 21 dias, vamos reconhecer quem realmente se comprometer com o processo. As pessoas mais engajadas ganham:
          </p>
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-3">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-4 p-5 rounded-lg bg-white">
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
          <div className="mt-12 text-center">
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-green px-8 py-4 text-lg font-medium text-white transition-all hover:bg-green/90"
            >
              Quero participar
            </a>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-24 bg-green">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-white">
            Um treino diário, simples e guiado que vai te ajudar
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Desacelerar o barulho da mente que nunca para e te deixa exausta",
              "Sair do modo alerta constante, onde o corpo vive tensionado e reagindo a tudo",
              "Dar clareza pra pensamentos embaralhados, pra você conseguir finalmente se ouvir",
              "Soltar o peso emocional acumulado, o que você sente, pensa e nem sabe nomear",
              "Acalmar a irritação e a ansiedade, que viram sua companhia diária sem você querer",
              "Construir presença, quando tudo em volta parece te puxar pra mil direções",
              "Criar espaço interno, pra parar de viver só reagindo e começar a escolher",
              "Reconstruir o seu centro, pra que o caos de fora não vire caos dentro",
              "Fortalecer sua estabilidade emocional, pra parar de oscilar entre euforia e exaustão",
              "Aprender a lidar com a mente que divaga o tempo todo (a famosa \"mente macaco\")",
              "Acessar descanso de verdade, não só sono, descanso no corpo, na mente, no emocional",
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

      {/* Even If Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
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

      {/* Pricing Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-green">
            Pronto para o <strong>Silencie</strong>?
          </h2>
          <p className="mb-4 text-green/80">
            Dê o primeiro passo em direção a uma vida mais presente e serena.
          </p>
          <p className="mb-12 text-sm text-green/60">
            Início do programa: <strong className="text-green">15 de janeiro de 2026</strong>
          </p>

          <div>
            <PricingCard />
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
            <a
              href="https://wa.me/5564992463702?text=Oi%2C%20Mari!%0AVim%20pelo%20site%20e%20queria%20tirar%20algumas%20d%C3%BAvidas%20sobre%20o%20Silencie%20antes%20de%20me%20inscrever."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-green/20 px-6 py-3 text-green transition-all hover:bg-green/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Tem alguma dúvida? Fale comigo
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <blockquote className="text-2xl font-light leading-relaxed text-green md:text-3xl">
            &ldquo;Não é sobre esvaziar a mente, mas sobre encontrar espaço dentro do caos.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-b border-green/10">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-green">
            O que dizem sobre a experiência
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-green">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight text-white">
            Perguntas frequentes
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} isLast={index === faqs.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green/10 px-6 py-12 text-center">
        <Image
          src="/mari-campos-logo-green.png"
          alt="Mari Campos"
          width={80}
          height={80}
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
