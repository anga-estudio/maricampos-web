import Link from "next/link";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⏰</span>
        </div>
        <h1 className="text-3xl font-light text-green mb-4">
          Prazo Encerrado
        </h1>
        <p className="text-muted mb-8">
          O prazo para preenchimento deste formulário já expirou. Entre em
          contato com o administrador se você acredita que isso é um erro.
        </p>
        <Link
          href="/home"
          className="inline-block px-6 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
