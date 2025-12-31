"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/administration", label: "Painel" },
  { href: "/administration/users", label: "Usuários" },
  { href: "/administration/programs", label: "Programas" },
  { href: "/administration/forms", label: "Formulários" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/administration"
            ? pathname === "/administration"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              isActive
                ? "bg-green/10 text-green font-medium"
                : "text-muted hover:text-foreground hover:bg-cream"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
