"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createClient();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/authentication/callback`,
      },
    });

    if (error) {
      if (error.message.includes("Signups not allowed")) {
        setError("Este email não está cadastrado no sistema.");
      } else {
        setError(error.message);
      }
    } else {
      setEmailSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="block mb-12">
          <Image
            src="/logo.svg"
            alt="Silencie"
            width={180}
            height={45}
            className="mx-auto"
          />
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-light text-green text-center mb-2">
            Área do Aluno
          </h1>

          {!emailSent ? (
            <>
              <p className="text-muted text-center mb-8 text-sm">
                Entre com seu email para acessar
              </p>

              {error && (
                <div className="mb-6 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-terracotta text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendMagicLink}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-3 border border-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green/30 bg-cream/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green text-white py-3 rounded-full font-medium hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar link de acesso"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-green"
                >
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2" />
                  <path d="M22 6v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </div>
              <p className="text-muted mb-2">
                Enviamos um link de acesso para
              </p>
              <p className="font-medium text-foreground mb-6">{email}</p>
              <p className="text-muted text-sm mb-6">
                Verifique sua caixa de entrada e clique no link para entrar.
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="text-muted text-sm hover:text-foreground transition-colors"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-muted text-sm mt-8">
          <Link href="/" className="hover:text-green transition-colors">
            Voltar para o início
          </Link>
        </p>
      </div>
    </div>
  );
}
