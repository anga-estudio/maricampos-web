"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

const WHATSAPP_URL = "https://wa.me/5564992463702";
const INSTAGRAM_URL = "https://www.instagram.com/maricamposyogi";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const startAudio = useCallback(() => {
    if (hasInteracted) return;
    setHasInteracted(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [hasInteracted]);

  useEffect(() => {
    const handler = () => startAudio();
    window.addEventListener("scroll", handler, { once: true });
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [startAudio]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.3;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <audio ref={audioRef} src="/audio/water-ambient.mp3?v=6" loop preload="auto" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Image
              src="/logo-blue.svg"
              alt="Mari Campos"
              width={44}
              height={44}
              priority
            />
          </a>

          <div className="flex items-center gap-4">
            {/* Audio toggle */}
            <button
              onClick={toggleAudio}
              className="w-10 h-10 rounded-full border border-sage/20 flex items-center justify-center text-sage hover:bg-sage/5 transition-colors"
              aria-label={isPlaying ? "Pausar som" : "Tocar som"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
            </button>

            <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
              <li>
                <a
                  href="#sobre"
                  className="text-foreground/60 hover:text-sage transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#servicos"
                  className="text-foreground/60 hover:text-sage transition-colors"
                >
                  Experiências
                </a>
              </li>
              <li>
                <a
                  href="#para-quem"
                  className="text-foreground/60 hover:text-sage transition-colors"
                >
                  Para quem
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sage text-white px-5 py-2 rounded-full hover:bg-sage-dark transition-colors"
                >
                  Fale comigo
                </a>
              </li>
            </ul>

            {/* Mobile menu button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden bg-sage text-white px-4 py-2 rounded-full text-sm hover:bg-sage-dark transition-colors"
            >
              Fale comigo
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/water-bg.mp4?v=5" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 w-full text-center">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8 border border-white/10">
            Yoga, Meditação & Transformação
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] mb-8 text-white">
            Mari
            <br />
            <span className="text-white/70">Campos</span>
          </h1>

          <div className="space-y-3 max-w-sm mx-auto mb-10">
            <p className="italic text-sm tracking-widest text-white/55 font-light">Voltar para si.</p>
            <p className="italic text-sm tracking-widest text-white/55 font-light">Respirar com consciência.</p>
            <p className="italic text-sm tracking-widest text-white/55 font-light">Viver com presença.</p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="#sobre"
              className="group inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-7 py-4 rounded-full hover:bg-white/30 transition-all border border-white/10"
            >
              Conhecer
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/40 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left - Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-80 h-[26rem] md:w-96 md:h-[32rem] rounded-[2rem] overflow-hidden relative">
                  <Image
                    src="/photos/mari.webp"
                    alt="Mari Campos"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Decorative rectangles */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-sage/20 rounded-[2rem]" />
                <div className="absolute -z-20 -bottom-8 -right-8 w-full h-full bg-sage/5 rounded-[2rem]" />
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex flex-col justify-center">
              <p className="text-sage text-sm uppercase tracking-widest mb-4">Sobre mim</p>
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
                Mais do que prática.
                <br />
                <span className="text-sage">É um caminho de retorno.</span>
              </h2>

              <div className="space-y-4 text-text-muted text-lg leading-relaxed mb-10">
                <p>Durante anos, eu vi mulheres exaustas tentando dar conta de tudo.</p>
                <p>Carregando o mundo nas costas. Silenciando a própria voz.</p>
                <p>Eu também já estive ali.</p>
                <p>A yoga, a respiração consciente e a meditação não foram apenas práticas para mim. Foram ferramentas de reconstrução.</p>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-medium text-foreground mb-6">
                  Hoje, eu facilito experiências que ajudam mulheres a:
                </h3>
                <div className="space-y-3">
                  {[
                    "Desacelerar sem culpa",
                    "Reorganizar o caos interno",
                    "Criar rituais simples de presença",
                    "Transformar cansaço em consciência",
                    "Sair do automático e voltar para o essencial",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-sage mt-1.5 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-text-muted text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-6">
                  Meu trabalho integra:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Yoga",
                    "Meditação guiada",
                    "Respiração consciente",
                    "Journaling terapêutico",
                    "Filosofia prática aplicada à vida real",
                    "Rituais de transição e ciclos",
                    "Ritual do cacau",
                    "Dança terapêutica",
                    "Sound healing",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage/40 shrink-0" />
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Transformação Section - Night Sky */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-sage via-[#0d2438] to-[#050d14]">
        {/* Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-[20%] left-[80%] w-1.5 h-1.5 bg-white/30 rounded-full" />
          <div className="absolute top-[35%] left-[25%] w-0.5 h-0.5 bg-white/50 rounded-full" />
          <div className="absolute top-[15%] left-[60%] w-1 h-1 bg-white/20 rounded-full" />
          <div className="absolute top-[45%] left-[90%] w-0.5 h-0.5 bg-white/40 rounded-full" />
          <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-white/25 rounded-full" />
          <div className="absolute top-[70%] left-[45%] w-0.5 h-0.5 bg-white/35 rounded-full" />
          <div className="absolute top-[25%] left-[35%] w-1 h-1 bg-white/15 rounded-full" />
          <div className="absolute top-[55%] left-[70%] w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="absolute top-[80%] left-[85%] w-0.5 h-0.5 bg-white/30 rounded-full" />
        </div>

        {/* Moon glow */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-white/50 text-sm uppercase tracking-widest mb-6">A Transformação</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed mb-16">
            O que muda quando você silencia
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-16">
            {[
              { from: "exaustão", to: "presença" },
              { from: "sobrecarga", to: "clareza" },
              { from: "ruído interno", to: "direção" },
              { from: "desconexão", to: "pertencimento" },
              { from: "sobrevivência", to: "consciência" },
              { from: "desregulação", to: "sustentação" },
            ].map((item) => (
              <div key={item.from} className="flex items-center gap-3 bg-white/5 rounded-xl px-6 py-4 border border-white/10">
                <span className="text-white/40">De {item.from}</span>
                <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-white font-medium">{item.to}</span>
              </div>
            ))}
          </div>

          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Meu trabalho não é sobre fazer você &ldquo;dar conta&rdquo;.
            <br />
            É sobre te ensinar a viver com mais verdade, ritmo próprio e equilíbrio interno.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white text-sage px-8 py-4 rounded-full hover:bg-white/90 transition-all font-medium"
          >
            Saiba mais
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <p className="text-sage text-sm uppercase tracking-widest mb-4">Experiências</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Como você pode viver
              <br />
              <span className="text-sage">essa experiência</span>
            </h2>
          </div>

          <div className="space-y-16">
            {/* Programas Online */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-sage/10 rounded-full text-sage text-sm mb-4">01</div>
                <h3 className="text-3xl font-light mb-4">Programas Online</h3>
                <h4 className="text-xl text-sage mb-6">Silencie — Jornada de 21 dias</h4>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Programa estruturado em cinco fases:
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Despertar", "Esvaziar", "Cultivar", "Enraizar", "Florescer"].map((fase) => (
                    <span key={fase} className="px-4 py-2 bg-sage/10 text-sage rounded-full text-sm">{fase}</span>
                  ))}
                </div>
              </div>
              <div className="bg-cream rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-4">Inclui:</h4>
                <div className="space-y-3">
                  {[
                    "Meditações guiadas",
                    "Tarefas diárias",
                    "Encontros ao vivo",
                    "Yoga integrativa",
                    "Comunidade",
                    "Rituais de fechamento de ciclo",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-sage">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sage hover:text-sage-dark transition-colors group text-sm font-medium"
                >
                  Quero participar da próxima turma
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="w-full h-px bg-sage/10" />

            {/* Jornadas e Comunidades */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-sage/10 rounded-full text-sage text-sm mb-4">02</div>
                <h3 className="text-3xl font-light mb-4">Jornadas e Comunidades</h3>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Ideal para mulheres que precisam de estrutura e pertencimento.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Escuta", "Presença", "Ritmo", "Comunidade", "Sustentação"].map((palavra) => (
                    <span key={palavra} className="px-4 py-2 bg-sage/10 text-sage rounded-full text-sm">{palavra}</span>
                  ))}
                </div>
              </div>
              <div className="bg-cream rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-4">Experiências em grupo com:</h4>
                <div className="space-y-3">
                  {[
                    "Áudios diários",
                    "Reflexões filosóficas",
                    "Desafios práticos",
                    "Encontros ao vivo",
                    "Suporte comunitário",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-sage">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-sage/10" />

            {/* Retiros Presenciais */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-sage/10 rounded-full text-sage text-sm mb-4">03</div>
                <h3 className="text-3xl font-light mb-4">Retiros Presenciais</h3>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Imersões profundas para reconexão e transformação.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Natureza", "Corpo", "Silêncio", "Ritual", "Retorno"].map((palavra) => (
                    <span key={palavra} className="px-4 py-2 bg-sage/10 text-sage rounded-full text-sm">{palavra}</span>
                  ))}
                </div>
              </div>
              <div className="bg-cream rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-4">Incluem:</h4>
                <div className="space-y-3">
                  {[
                    "Yoga diária",
                    "Meditação",
                    "Cerimônia com cacau",
                    "Práticas de respiração",
                    "Silêncio guiado",
                    "Ritual de transição",
                    "Alimentação consciente",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-sage">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-sage/10" />

            {/* Mentoria */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-sage/10 rounded-full text-sage text-sm mb-4">04</div>
                <h3 className="text-3xl font-light mb-4">Mentoria</h3>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Um acompanhamento individual para mulheres que sentem que precisam aprender a se sustentar emocionalmente, energeticamente e na própria rotina.
                </p>
                <p className="text-text-muted text-lg leading-relaxed">
                  A mentoria é um espaço de estrutura e presença.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-cream rounded-2xl p-8">
                  <h4 className="text-lg font-medium mb-4">Trabalhamos para que você:</h4>
                  <div className="space-y-3">
                    {[
                      "Sustente sua prática sem depender de motivação",
                      "Sustente sua energia sem entrar em colapso",
                      "Sustente sua maternidade sem se abandonar",
                      "Sustente seus limites sem culpa",
                      "Sustente sua espiritualidade na vida real",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="text-sage mt-1 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-sage/5 rounded-2xl p-8 border border-sage/10">
                  <h4 className="text-lg font-medium mb-4">Integra:</h4>
                  <div className="space-y-3">
                    {[
                      "Respiração consciente aplicada ao cotidiano",
                      "Meditação personalizada",
                      "Organização de ritmo e rotina",
                      "Construção de rituais possíveis",
                      "Fortalecimento interno e autonomia prática",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-sage/40 shrink-0" />
                        <span className="text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-sage/10" />

            {/* Experiências Corporativas */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-sage/10 rounded-full text-sage text-sm mb-4">05</div>
                <h3 className="text-3xl font-light mb-4">Experiências Corporativas</h3>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Workshops e vivências para empresas que desejam:
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Reduzir estresse",
                    "Melhorar foco",
                    "Desenvolver inteligência emocional",
                    "Criar cultura de bem-estar",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-sage">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-text-muted text-lg">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-sage text-white px-7 py-4 rounded-full hover:bg-sage-dark transition-all"
                >
                  Tenho interesse em saber mais
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              <div className="bg-cream rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-4">Formatos:</h4>
                <div className="space-y-4">
                  {[
                    { title: "Palestras", desc: "Inspiração e consciência para equipes" },
                    { title: "Workshops práticos", desc: "Vivências guiadas de respiração e meditação" },
                    { title: "Jornadas internas", desc: "Programas de desenvolvimento contínuo" },
                    { title: "Programas contínuos", desc: "Acompanhamento recorrente de bem-estar" },
                  ].map((item) => (
                    <div key={item.title} className="p-4 bg-background rounded-xl">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-text-muted text-sm mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quem É */}
      <section id="para-quem" className="py-24 md:py-32 bg-cream">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm uppercase tracking-widest mb-4">Para quem é</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Esse trabalho é
              <br />
              <span className="text-sage">para você que:</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Sente que vive em estado de alerta constante",
              "Acorda já cansada, mesmo depois de dormir",
              "Cuida de tudo e todos, mas por dentro está no limite",
              "Perdeu o ritmo próprio tentando acompanhar o ritmo do mundo",
              "Sente que a vida está passando no automático",
              "Quer espiritualidade com aterramento, não fuga",
              "Precisa aprender a se regular, não apenas relaxar",
              "Quer criar base interna antes de expandir",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 p-5 bg-background rounded-xl">
                <span className="text-sage mt-0.5 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                <span className="text-text-muted text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm uppercase tracking-widest mb-4">Depoimentos</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              O que dizem quem
              <br />
              <span className="text-sage">já viveu essa experiência</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Roberta Ludwig",
                image: "/photos/testimonial-1.jpg",
                message: "Eu me sentia mais frágil, mais confusa, mais melancólica. Depois das práticas senti muito mais confiança nas técnicas de autoconhecimento, me interessei por entender quais eram os sentimentos que vinham e por que vinham. Entendi que as emoções são ótimas e podemos nos tranquilizar mesmo nos momentos turbulentos. Percebo que raramente senti novamente os batimentos cardíacos excessivamente acelerados, como acontecia antes. Sei perceber quando uma crise vai se instalar... Aceito a tristeza muito bem, prezo muito mais pelo meu descanso. Adoro ficar em silêncio e em ambientes de maior serenidade. Leio sobre yoga, respiração, e escuto muitos e diversos mantras. As aulas com a Mari são como uma massagem, uma comida gostosa, um dia de férias bem leve. São aulas de carinho com meu corpo.",
              },
              {
                name: "Ana Paula de Oliveira",
                image: "/photos/testimonial-2.jpg",
                message: "Tive a felicidade de ser apresentada, por amigas muito queridas, à Mari, essa profissional incrível, que conduz a prática de yoga, além de outras ferramentas de autoconhecimento, com técnica, leveza e intensidade ao mesmo tempo. Mari é uma pessoa linda, que conduz seu trabalho com pura doação, sensibilidade e empatia!",
              },
              {
                name: "Maria Miguel",
                image: "/photos/testimonial-3.jpg",
                message: "As práticas com a Mari são muito especiais para mim. As aulas vão muito além dos movimentos físicos. As reflexões que ela sempre traz no início e no final da aula trazem foco também para a nossa parte espiritual/energética, o que propicia uma experiência muito mais profunda do que uma aula de yoga comum, proporcionando nos bem estar físico e psicológico. Além disso, ela demonstra uma conexão muito especial com seus alunos, transformando cada prática em momentos de cura para todos.",
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-cream rounded-2xl p-8 flex flex-col">
                <svg className="w-8 h-8 text-sage/20 mb-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-text-muted leading-relaxed mb-6 flex-1 line-clamp-[8]">
                  {testimonial.message}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-sage/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative bg-sage/10 shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-foreground">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Convite Final - Night Sky */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#050d14] via-[#0d2438] to-sage">
        {/* Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-[25%] left-[75%] w-1.5 h-1.5 bg-white/25 rounded-full" />
          <div className="absolute top-[40%] left-[50%] w-0.5 h-0.5 bg-white/50 rounded-full" />
          <div className="absolute top-[60%] left-[30%] w-1 h-1 bg-white/20 rounded-full" />
          <div className="absolute top-[50%] left-[85%] w-0.5 h-0.5 bg-white/35 rounded-full" />
          <div className="absolute top-[75%] left-[15%] w-1 h-1 bg-white/15 rounded-full" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed mb-6">
            O que você precisa não é fazer mais.
          </h2>
          <p className="text-2xl md:text-3xl font-light text-white/70 mb-12">
            E sim voltar ao seu próprio ritmo.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white text-sage px-8 py-4 rounded-full hover:bg-white/90 transition-all font-medium text-lg"
          >
            Quero começar minha jornada
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-blue.svg"
                alt="Mari Campos"
                width={32}
                height={32}
              />
              <span className="text-foreground font-medium">Mari Campos</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-sage transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-sage transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

            </div>

            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
