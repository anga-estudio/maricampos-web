"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/panel/login");
      } else {
        setEmail(user.email!);
      }
    });
  }, [router]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao alterar a senha. Tente novamente.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (!email) return null;

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar email={email} />

      <main className="flex-1 p-8">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold text-sage-dark mb-2">
            Alterar senha
          </h2>
          <p className="text-text-muted mb-8">
            Digite sua nova senha abaixo.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-sand p-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-green-800 text-sm">
                    Senha alterada com sucesso!
                  </p>
                </div>
                <button
                  onClick={() => router.push("/panel")}
                  className="text-sm text-sage hover:text-sage-dark transition cursor-pointer"
                >
                  Voltar ao painel
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Nova senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-sand bg-background text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                    placeholder="Repita a nova senha"
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
                  {loading ? "Salvando..." : "Alterar senha"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
