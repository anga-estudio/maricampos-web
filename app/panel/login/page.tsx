"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/panel/auth/reset-callback`,
    });

    if (error) {
      setError("Erro ao enviar o e-mail. Tente novamente.");
      setLoading(false);
      return;
    }

    setResetSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src="/logo-blue.svg"
              alt="Mari Campos"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-xl font-semibold text-sage-dark">
              Painel Administrativo
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {forgotMode
                ? "Recuperar acesso"
                : "Faça login para continuar"}
            </p>
          </div>

          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="bg-sage/5 rounded-xl p-6">
                <p className="text-foreground text-sm leading-relaxed">
                  Enviamos um link de recuperação para{" "}
                  <strong className="text-sage-dark">{email}</strong>. Verifique
                  seu e-mail.
                </p>
              </div>
              <button
                onClick={() => {
                  setForgotMode(false);
                  setResetSent(false);
                  setError("");
                }}
                className="text-sm text-text-muted hover:text-foreground transition cursor-pointer"
              >
                Voltar ao login
              </button>
            </div>
          ) : forgotMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                  placeholder="seu@email.com"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-sage text-white font-medium hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(false);
                    setError("");
                  }}
                  className="text-sm text-text-muted hover:text-foreground transition cursor-pointer"
                >
                  Voltar ao login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                  placeholder="********"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-sage text-white font-medium hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true);
                    setError("");
                  }}
                  className="text-sm text-text-muted hover:text-foreground transition cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
