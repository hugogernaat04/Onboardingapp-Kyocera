-- Kyocera productonboarding: tabellen, rollen, Row Level Security en opslag.
-- Uitvoeren in de Supabase SQL Editor (of via `supabase db push`), vóór 20260101000002_seed_producten.sql.

-- ---------------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  naam text not null default '',
  email text not null default '',
  rol text not null default 'gebruiker' check (rol in ('admin', 'gebruiker')),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  naam text not null,
  categorie text not null,
  korte_omschrijving text not null default '',
  omschrijving text not null default '',
  kenmerken text[] not null default '{}',
  doelgroep text not null default '',
  verkoopargumenten text[] not null default '{}',
  afbeelding_url text not null default '',
  video_url text not null default '',
  volgorde integer not null default 0,
  gepubliceerd boolean not null default false,
  -- Engelse vertaling van de teksten (zelfde vorm als ProductTranslation in de app); optioneel.
  en jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  vraag text not null,
  opties text[] not null check (cardinality(opties) = 4),
  juiste_antwoord integer not null check (juiste_antwoord between 0 and 3),
  uitleg text not null default '',
  volgorde integer not null default 0
);

create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  score integer not null check (score >= 0),
  gehaald boolean not null,
  created_at timestamptz not null default now()
);

create index products_volgorde_idx on public.products (volgorde);
create index quiz_questions_product_idx on public.quiz_questions (product_id, volgorde);
create index quiz_results_user_idx on public.quiz_results (user_id);
create index quiz_results_product_idx on public.quiz_results (product_id);

-- ---------------------------------------------------------------------------
-- Hulpfuncties en triggers
-- ---------------------------------------------------------------------------

-- Is de ingelogde gebruiker een admin? security definer, zodat de functie in policies
-- van profiles zelf gebruikt kan worden zonder oneindige recursie.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and rol = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Maakt automatisch een profiel aan bij elke nieuwe gebruiker (uitnodiging of registratie).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, naam, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'naam', ''), split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Houdt het e-mailadres in profiles gelijk aan dat in auth.users.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.sync_profile_email();

-- Beschermt de rol: alleen een admin mag een rol wijzigen, nooit die van zichzelf,
-- en id/e-mail van een profiel zijn onveranderlijk via de API.
-- Directe databasetoegang (SQL Editor, service role) heeft geen auth.uid() en mag alles,
-- zodat je jezelf de eerste admin kunt maken.
create or replace function public.protect_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    return new;
  end if;
  if new.id <> old.id or new.email <> old.email or new.created_at <> old.created_at then
    raise exception 'Dit profielveld kan niet worden gewijzigd';
  end if;
  if new.rol <> old.rol then
    if not public.is_admin() then
      raise exception 'Alleen een admin mag een rol wijzigen';
    end if;
    if old.id = (select auth.uid()) then
      raise exception 'Je kunt je eigen rol niet wijzigen';
    end if;
  end if;
  return new;
end;
$$;

create trigger protect_profile_trigger
  before update on public.profiles
  for each row execute function public.protect_profile();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_results enable row level security;

-- profiles
create policy "eigen profiel of admin leest"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

create policy "eigen profiel of admin wijzigt"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()))
  with check ((select auth.uid()) = id or (select public.is_admin()));
-- Geen insert- of delete-policy: profielen ontstaan via de trigger en verdwijnen met de gebruiker.

-- products
create policy "gepubliceerde producten lezen, admin alles"
  on public.products for select to authenticated
  using (gepubliceerd or (select public.is_admin()));

create policy "admin voegt producten toe"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));

create policy "admin wijzigt producten"
  on public.products for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admin verwijdert producten"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

-- quiz_questions
create policy "vragen van gepubliceerde producten lezen, admin alles"
  on public.quiz_questions for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.products p where p.id = quiz_questions.product_id and p.gepubliceerd
    )
  );

create policy "admin voegt vragen toe"
  on public.quiz_questions for insert to authenticated
  with check ((select public.is_admin()));

create policy "admin wijzigt vragen"
  on public.quiz_questions for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admin verwijdert vragen"
  on public.quiz_questions for delete to authenticated
  using ((select public.is_admin()));

-- quiz_results
create policy "eigen resultaten of admin leest"
  on public.quiz_results for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));

create policy "eigen resultaten toevoegen"
  on public.quiz_results for insert to authenticated
  with check ((select auth.uid()) = user_id);
-- Geen update- of delete-policy: resultaten zijn onveranderlijk.

-- ---------------------------------------------------------------------------
-- Storage: bucket product-media (publiek leesbaar, alleen admins schrijven)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  52428800, -- 50 MB: de limiet van het gratis Supabase-abonnement
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "product-media is voor iedereen leesbaar"
  on storage.objects for select
  using (bucket_id = 'product-media');

create policy "admin uploadt product-media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and (select public.is_admin()));

create policy "admin vervangt product-media"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and (select public.is_admin()))
  with check (bucket_id = 'product-media' and (select public.is_admin()));

create policy "admin verwijdert product-media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Functies die alleen als trigger bedoeld zijn mogen niet via de API (/rest/v1/rpc) aanroepbaar zijn.
-- Triggers blijven werken: daarvoor is geen EXECUTE-recht van de gebruiker nodig.
-- ---------------------------------------------------------------------------

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.protect_profile() from public, anon, authenticated;
revoke all on function public.sync_profile_email() from public, anon, authenticated;
