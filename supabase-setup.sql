-- ============================================================
-- CONFIGURAÇÃO DO BANCO DE DADOS — App de Testemunhos
-- Copie TODO este arquivo e cole no SQL Editor do Supabase
-- (Painel do projeto → SQL Editor → New query → Run)
-- ============================================================

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_company text,
  message text not null,
  rating int check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ativa segurança em nível de linha (obrigatório no Supabase)
alter table testimonials enable row level security;

-- Qualquer visitante pode ENVIAR um novo testemunho
create policy "Public can submit testimonials"
on testimonials for insert
to anon
with check (true);

-- Qualquer visitante pode LER apenas os testemunhos aprovados (usado pelo widget)
create policy "Public can view approved testimonials"
on testimonials for select
to anon
using (approved = true);

-- Você (logado como admin) pode ver TODOS os testemunhos, incluindo pendentes
create policy "Admins can view all testimonials"
on testimonials for select
to authenticated
using (true);

-- Você (logado como admin) pode aprovar/editar
create policy "Admins can update testimonials"
on testimonials for update
to authenticated
using (true);

-- Você (logado como admin) pode excluir
create policy "Admins can delete testimonials"
on testimonials for delete
to authenticated
using (true);
