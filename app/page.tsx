import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Image
              src="/logo-green.svg"
              alt="Mari Campos"
              width={48}
              height={48}
              priority
            />
          </a>

          <ul className="flex items-center gap-8 text-sm font-medium">
            <li>
              <a
                href="#sobre"
                className="text-foreground/70 hover:text-sage-dark transition-colors"
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#pratica"
                className="text-foreground/70 hover:text-sage-dark transition-colors"
              >
                Prática
              </a>
            </li>
            <li>
              <a
                href="https://silencie.maricampos.co"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sage text-white px-5 py-2.5 rounded-full hover:bg-sage-dark transition-colors"
              >
                Silencie
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sand/50 rounded-full blur-3xl" />

        {/* Círculo decorativo com padrão */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <p className="font-script text-3xl md:text-4xl text-sage mb-4 animate-fade-in">
            Bem-vindo ao seu espaço
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6">
            Mari
            <span className="font-script text-sage ml-3">Campos</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Yogi, professora e guia de práticas contemplativas.
            <br className="hidden md:block" />
            Ajudando você a encontrar quietude no movimento.
          </p>

          <a
            href="#sobre"
            className="group inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full hover:bg-sage-dark transition-all"
          >
            Conheça minha jornada
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-sage/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-sage/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-32 bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Placeholder / Decorative */}
            <div className="relative">
              <div className="aspect-[4/5] bg-sand rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-sage-light/30 flex items-center justify-center">
                      <svg className="w-16 h-16 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="font-script text-2xl text-sage">sua foto aqui</p>
                  </div>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-sage/20 rounded-full" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-sage/10 rounded-full" />
            </div>

            {/* Content */}
            <div>
              <p className="font-script text-2xl text-sage mb-4">Sobre mim</p>
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                Uma jornada de
                <br />
                <span className="font-script text-sage">autoconhecimento</span>
              </h2>

              <div className="space-y-4 text-text-muted leading-relaxed">
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

              <div className="mt-10 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-light text-sage">+10</p>
                  <p className="text-sm text-text-muted">anos de prática</p>
                </div>
                <div className="w-px h-12 bg-sage/20" />
                <div className="text-center">
                  <p className="text-3xl font-light text-sage">+500</p>
                  <p className="text-sm text-text-muted">alunos</p>
                </div>
                <div className="w-px h-12 bg-sage/20" />
                <div className="text-center">
                  <p className="text-3xl font-light text-sage">+1000</p>
                  <p className="text-sm text-text-muted">horas de formação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prática Section */}
      <section id="pratica" className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="font-script text-2xl text-sage mb-4">Minha abordagem</p>
            <h2 className="text-4xl md:text-5xl font-light">
              Pilares da <span className="font-script text-sage">prática</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 bg-cream rounded-3xl hover:bg-sand transition-colors duration-500">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Consciência</h3>
              <p className="text-text-muted leading-relaxed">
                Desenvolver a percepção do momento presente, conectando corpo, mente e respiração em cada movimento.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-cream rounded-3xl hover:bg-sand transition-colors duration-500">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Compaixão</h3>
              <p className="text-text-muted leading-relaxed">
                Cultivar gentileza consigo mesmo e com os outros, honrando os limites do corpo e da mente.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-cream rounded-3xl hover:bg-sand transition-colors duration-500">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Transformação</h3>
              <p className="text-text-muted leading-relaxed">
                Permitir que a prática constante traga mudanças profundas em todos os aspectos da vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 bg-sage">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <svg className="w-12 h-12 mx-auto mb-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-3xl md:text-4xl font-light text-white leading-relaxed mb-8">
            O yoga não é sobre tocar os dedos dos pés, é sobre o que você aprende no caminho até lá.
          </blockquote>
          <p className="font-script text-2xl text-white/70">- Judith Hanson Lasater</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-green.svg"
                alt="Mari Campos"
                width={40}
                height={40}
              />
              <div>
                <p className="font-script text-xl text-foreground">Mari Campos</p>
                <p className="text-sm text-text-muted">Yoga & Bem-estar</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center hover:bg-sage/20 transition-colors text-sage"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center hover:bg-sage/20 transition-colors text-sage"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-sage/10 text-center text-sm text-text-muted">
            <p>&copy; {new Date().getFullYear()} Mari Campos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
