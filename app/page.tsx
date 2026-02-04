import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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

          <ul className="flex items-center gap-8 text-sm font-medium">
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
                href="https://silencie.maricampos.co"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sage text-white px-5 py-2 rounded-full hover:bg-sage-dark transition-colors"
              >
                Silencie
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cream" />

        {/* Decorative line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sage/5" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 bg-sage/10 rounded-full text-sage text-sm mb-8">
                Yoga & Bem-estar
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] mb-8">
                Mari
                <br />
                <span className="text-sage">Campos</span>
              </h1>

              <p className="text-xl text-text-muted max-w-md leading-relaxed mb-10">
                Yogi e guia de práticas contemplativas. Ajudando você a encontrar quietude no movimento.
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="#sobre"
                  className="group inline-flex items-center gap-3 bg-sage text-white px-7 py-4 rounded-full hover:bg-sage-dark transition-all"
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
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-sage/20 flex items-center justify-center text-sage hover:bg-sage/5 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - Photo */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main image container */}
                <div className="w-80 h-[26rem] md:w-96 md:h-[32rem] rounded-[2rem] overflow-hidden relative">
                  <Image
                    src="/photo.svg"
                    alt="Mari Campos"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-sage/20 rounded-[2rem]" />
                <div className="absolute -z-20 -bottom-8 -right-8 w-full h-full bg-sage/5 rounded-[2rem]" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 border border-sage/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-sage/40 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Stats - Left */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="space-y-8">
                <div className="group">
                  <p className="text-5xl md:text-6xl font-light text-sage mb-2">+10</p>
                  <p className="text-text-muted">anos dedicados ao yoga</p>
                </div>
                <div className="w-16 h-px bg-sage/20" />
                <div className="group">
                  <p className="text-5xl md:text-6xl font-light text-sage mb-2">+500</p>
                  <p className="text-text-muted">alunos transformados</p>
                </div>
                <div className="w-16 h-px bg-sage/20" />
                <div className="group">
                  <p className="text-5xl md:text-6xl font-light text-sage mb-2">+1000h</p>
                  <p className="text-text-muted">de formação</p>
                </div>
              </div>
            </div>

            {/* Text - Right */}
            <div className="lg:col-span-3">
              <p className="text-sage text-sm uppercase tracking-widest mb-4">Sobre mim</p>
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
                Uma jornada de
                <br />
                <span className="text-sage">autoconhecimento</span>
              </h2>

              <div className="space-y-6 text-text-muted text-lg leading-relaxed">
                <p>
                  Há anos dedico minha vida ao estudo e à prática do yoga, não apenas como
                  exercício físico, mas como um caminho completo de transformação interior.
                </p>
                <p>
                  Minha missão é criar espaços seguros onde cada pessoa possa se reconectar
                  consigo mesma, encontrando paz em meio ao caos do cotidiano.
                </p>
                <p>
                  Acredito que a prática contemplativa pode ser integrada à rotina de qualquer
                  pessoa, tornando a jornada do bem-estar acessível a todos.
                </p>
              </div>

              <div className="mt-10">
                <a
                  href="https://silencie.maricampos.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sage hover:text-sage-dark transition-colors group"
                >
                  Conheça o Silencie
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote - Night Sky */}
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
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed">
            "O yoga não é sobre tocar os dedos dos pés, é sobre o que você aprende no caminho até lá."
          </blockquote>
          <p className="mt-8 text-white/50">Judith Hanson Lasater</p>
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

            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
