import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdministrationPage() {
  const supabase = createAdminClient();

  const [
    { count: usersCount },
    { count: programsCount },
    { count: enrollmentsCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total de Usuários", value: usersCount ?? 0 },
    { label: "Programas Ativos", value: programsCount ?? 0 },
    { label: "Inscrições", value: enrollmentsCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-light text-green mb-8">Painel</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-muted text-sm mb-1">{stat.label}</p>
            <p className="text-4xl font-light text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
