import { createAdminClient } from "@/lib/supabase/admin";
import { Profile } from "@/lib/types/database";
import AddUserButton from "./components/add-user-button";
import UserRow from "./components/user-row";

export default async function UsersPage() {
  const supabase = createAdminClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-green">Usuários</h1>
        <AddUserButton />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">
                Nome
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">
                Função
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">
                Criado em
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green/10">
            {(users as Profile[])?.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
