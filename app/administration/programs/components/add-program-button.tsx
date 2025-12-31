"use client";

import { useState } from "react";
import AddProgramModal from "./add-program-modal";

export default function AddProgramButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green/90 transition-colors"
      >
        Adicionar Programa
      </button>
      {isOpen && <AddProgramModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
