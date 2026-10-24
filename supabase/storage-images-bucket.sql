-- Cria o bucket "images" usado pelo upload de fotos do painel.
--
-- O editor do Silencie (app/panel/silencie/editor.tsx) grava em
-- storage.from("images"), mas o bucket nunca existiu: toda tentativa de upload
-- falhava com "Bucket not found". Rodar no SQL Editor do Supabase.

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Leitura pública: os sites consomem as URLs sem autenticação.
drop policy if exists "Public read images" on storage.objects;
create policy "Public read images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'images');

-- Escrita apenas para quem está logado no painel.
drop policy if exists "Authenticated upload images" on storage.objects;
create policy "Authenticated upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

drop policy if exists "Authenticated update images" on storage.objects;
create policy "Authenticated update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'images');

drop policy if exists "Authenticated delete images" on storage.objects;
create policy "Authenticated delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images');
