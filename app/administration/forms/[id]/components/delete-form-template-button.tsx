"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteFormTemplateButtonProps {
  templateId: string;
}

export default function DeleteFormTemplateButton({
  templateId,
}: DeleteFormTemplateButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/forms/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir formulário");
      }

      router.push("/administration/forms");
    } catch (error) {
      console.error("Error deleting form template:", error);
      alert("Erro ao excluir formulário");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 border border-terracotta/20 text-terracotta rounded-lg hover:bg-terracotta/5 transition-colors disabled:opacity-50"
    >
      {deleting ? "Excluindo..." : "Excluir"}
    </button>
  );
}
