-- Script Automático de Setup de Banco de Dados: FitPro360
-- Execute este script inteiro no editor SQL do seu projeto Supabase

-- 1. Cria a tabela de Perfis atrelada à Autenticação
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nome text,
  sexo text,
  data_nascimento text,
  peso text,
  altura text,
  nivel text,
  objetivos jsonb,
  modalidades jsonb,
  dias_treino jsonb,
  doencas text,
  medicamentos text,
  suplementos text,
  alergias text,
  onboarding_feito boolean default false
);

-- 2. Habilita RLS (Row Level Security) para segurança militar
alter table public.profiles enable row level security;

-- 3. Cria Políticas de RLS
create policy "Usuários podem ver seu próprio perfil." on public.profiles
  for select using (auth.uid() = id);

create policy "Usuários podem inserir seu próprio perfil." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil." on public.profiles
  for update using (auth.uid() = id);

-- 4. Função gatilho para criar um perfil automaticamente quando registrar
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- 5. Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
