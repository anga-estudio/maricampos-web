import { createAdminClient } from "@/lib/supabase/admin";
import { Program } from "@/lib/types/database";
import Link from "next/link";
import AddProgramButton from "./components/add-program-button";

export default async function ProgramsPage() {
  const supabase = createAdminClient();

  const { data: programs, error } = await supabase
    .from("programs")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching programs:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: "Em breve", color: "bg-blue-100 text-blue-700" };
    if (now > end) return { label: "Concluído", color: "bg-gray-100 text-gray-700" };
    return { label: "Ativo", color: "bg-green/10 text-green" };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-green">Programas</h1>
        <AddProgramButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(programs as Program[])?.map((program) => {
          const status = getStatus(program.start_date, program.end_date);
          return (
            <Link
              key={program.id}
              href={`/administration/programs/${program.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">
                  {program.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
              {program.description && (
                <p className="text-muted text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted">
                <span>{formatDate(program.start_date)}</span>
                <span>→</span>
                <span>{formatDate(program.end_date)}</span>
              </div>
            </Link>
          );
        })}
        {(!programs || programs.length === 0) && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-muted">
            Nenhum programa encontrado. Crie seu primeiro programa para começar.
          </div>
        )}
      </div>
    </div>
  );
}
