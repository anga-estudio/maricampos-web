"use client";

import { useState } from "react";
import AddUserModal from "./add-user-modal";

export default function AddUserButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green/90 transition-colors"
      >
        Adicionar Usuário
      </button>
      {isOpen && <AddUserModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
