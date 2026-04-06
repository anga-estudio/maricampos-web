"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./sign-out-button";

const projects = [
  { name: "Mari Campos", href: "/panel/mari-campos", icon: "M" },
  { name: "Silencie", href: "/panel/silencie", icon: "S" },
  { name: "Nayá", href: "/panel/naya", icon: "N" },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-sand flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sand">
        <Link href="/panel" className="flex items-center gap-3">
          <img src="/logo-blue.svg" alt="Painel" className="h-8" />
          <span className="text-lg font-semibold text-sage-dark">Painel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-3 mb-3">
          Projetos
        </p>
        {projects.map((project) => {
          const isActive = pathname.startsWith(project.href);
          return (
            <Link
              key={project.href}
              href={project.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-sage text-white"
                  : "text-foreground hover:bg-cream"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-sage/10 text-sage"
                }`}
              >
                {project.icon}
              </span>
              {project.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sand space-y-3">
        <Link
          href="/panel/change-password"
          className="block text-sm text-text-muted hover:text-foreground transition px-3"
        >
          Alterar senha
        </Link>
        <div className="px-3">
          <p className="text-xs text-text-muted truncate mb-2">{email}</p>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
