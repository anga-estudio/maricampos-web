"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Profile, UserRole } from "@/lib/types/database";

interface UserRowProps {
  user: Profile;
}

export default function UserRow({ user }: UserRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);

  const handleRoleChange = async (newRole: UserRole) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setRole(newRole);
        router.refresh();
      }
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="hover:bg-cream/30 transition-colors">
      <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {user.full_name || "-"}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            disabled={loading}
            className="text-sm border border-green/20 rounded px-2 py-1 bg-white"
          >
            <option value="member">Membro</option>
            <option value="admin">Administrador</option>
          </select>
        ) : (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
              role === "admin"
                ? "bg-green/10 text-green"
                : "bg-cream text-muted"
            }`}
          >
            {role === "admin" ? "Administrador" : "Membro"}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-muted">
        {formatDate(user.created_at)}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-green hover:text-green/70 transition-colors"
        >
          {isEditing ? "Concluir" : "Editar"}
        </button>
      </td>
    </tr>
  );
}
