-- Supabase Schema for Silencie
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum for user roles
create type user_role as enum ('admin', 'member');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role user_role not null default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Programs table
create table programs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Phases table (program phases/stages)
create table phases (
  id uuid default uuid_generate_v4() primary key,
  program_id uuid references programs on delete cascade not null,
  name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enrollments table (many-to-many: users <-> programs)
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles on delete cascade not null,
  program_id uuid references programs on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, program_id)
);

-- Indexes for better performance
create index idx_phases_program_id on phases(program_id);
create index idx_enrollments_user_id on enrollments(user_id);
create index idx_enrollments_program_id on enrollments(program_id);
create index idx_profiles_role on profiles(role);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at
  before update on profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_programs_updated_at
  before update on programs
  for each row execute procedure public.handle_updated_at();

create trigger handle_phases_updated_at
  before update on phases
  for each row execute procedure public.handle_updated_at();

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table programs enable row level security;
alter table phases enable row level security;
alter table enrollments enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Programs policies
create policy "Anyone authenticated can view programs"
  on programs for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert programs"
  on programs for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update programs"
  on programs for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete programs"
  on programs for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Phases policies
create policy "Anyone authenticated can view phases"
  on phases for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert phases"
  on phases for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update phases"
  on phases for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete phases"
  on phases for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Enrollments policies
create policy "Users can view their own enrollments"
  on enrollments for select
  using (auth.uid() = user_id);

create policy "Admins can view all enrollments"
  on enrollments for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can insert enrollments"
  on enrollments for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete enrollments"
  on enrollments for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ===========================================
-- FORM SYSTEM (Anamnese / Typeform-like)
-- ===========================================

-- Enum for question types
create type question_type as enum (
  'single_choice',      -- Radio buttons (uma opção)
  'multiple_choice',    -- Checkboxes (múltiplas opções)
  'scale',              -- Escala numérica (0-10)
  'text',               -- Texto livre
  'textarea'            -- Texto longo
);

-- Form templates (e.g., "Anamnese Silencie")
create table form_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  intro_title text,
  intro_description text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Form sections (e.g., "Parte 1 | Contexto e ponto de partida")
create table form_sections (
  id uuid default uuid_generate_v4() primary key,
  form_template_id uuid references form_templates on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Form questions
create table form_questions (
  id uuid default uuid_generate_v4() primary key,
  section_id uuid references form_sections on delete cascade not null,
  question_text text not null,
  question_type question_type not null,
  help_text text,
  is_required boolean default true not null,
  is_inverted boolean default false not null,  -- For inverted scale questions
  scale_min integer default 0,                  -- For scale questions
  scale_max integer default 10,                 -- For scale questions
  scale_min_label text,                         -- Label for min value (e.g., "ótimo")
  scale_max_label text,                         -- Label for max value (e.g., "péssimo")
  max_selections integer,                       -- For multiple_choice (e.g., "escolha até 2")
  scoring_category text,                        -- Category for scoring (e.g., "ruido_mental", "potencia")
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Question options (for single_choice and multiple_choice)
create table form_options (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references form_questions on delete cascade not null,
  option_text text not null,
  option_value text,                            -- Optional value for scoring
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Association between programs and form templates
create table program_forms (
  id uuid default uuid_generate_v4() primary key,
  program_id uuid references programs on delete cascade not null,
  form_template_id uuid references form_templates on delete cascade not null,
  available_until timestamp with time zone,     -- Deadline for form submission
  is_required boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(program_id, form_template_id)
);

-- Form submissions (one per user per program_form)
create table form_submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles on delete cascade not null,
  program_form_id uuid references program_forms on delete cascade not null,
  noise_score numeric(5,2),                     -- Nota de Ruído Interno (0-100)
  power_score numeric(5,2),                     -- Índice de Potência (0-100)
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, program_form_id)
);

-- Individual answers
create table form_answers (
  id uuid default uuid_generate_v4() primary key,
  submission_id uuid references form_submissions on delete cascade not null,
  question_id uuid references form_questions on delete cascade not null,
  answer_text text,                             -- For text/textarea questions
  answer_scale integer,                         -- For scale questions
  answer_options uuid[],                        -- Array of selected option IDs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(submission_id, question_id)
);

-- Indexes for form system
create index idx_form_sections_template_id on form_sections(form_template_id);
create index idx_form_questions_section_id on form_questions(section_id);
create index idx_form_options_question_id on form_options(question_id);
create index idx_program_forms_program_id on program_forms(program_id);
create index idx_program_forms_template_id on program_forms(form_template_id);
create index idx_form_submissions_user_id on form_submissions(user_id);
create index idx_form_submissions_program_form_id on form_submissions(program_form_id);
create index idx_form_answers_submission_id on form_answers(submission_id);

-- Triggers for updated_at on form tables
create trigger handle_form_templates_updated_at
  before update on form_templates
  for each row execute procedure public.handle_updated_at();

create trigger handle_form_sections_updated_at
  before update on form_sections
  for each row execute procedure public.handle_updated_at();

create trigger handle_form_questions_updated_at
  before update on form_questions
  for each row execute procedure public.handle_updated_at();

create trigger handle_form_submissions_updated_at
  before update on form_submissions
  for each row execute procedure public.handle_updated_at();

-- RLS for form tables
alter table form_templates enable row level security;
alter table form_sections enable row level security;
alter table form_questions enable row level security;
alter table form_options enable row level security;
alter table program_forms enable row level security;
alter table form_submissions enable row level security;
alter table form_answers enable row level security;

-- Form templates policies (anyone can view, admins can manage)
create policy "Anyone authenticated can view form templates"
  on form_templates for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert form templates"
  on form_templates for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update form templates"
  on form_templates for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete form templates"
  on form_templates for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Form sections policies
create policy "Anyone authenticated can view form sections"
  on form_sections for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert form sections"
  on form_sections for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update form sections"
  on form_sections for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete form sections"
  on form_sections for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Form questions policies
create policy "Anyone authenticated can view form questions"
  on form_questions for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert form questions"
  on form_questions for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update form questions"
  on form_questions for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete form questions"
  on form_questions for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Form options policies
create policy "Anyone authenticated can view form options"
  on form_options for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert form options"
  on form_options for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update form options"
  on form_options for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete form options"
  on form_options for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Program forms policies
create policy "Anyone authenticated can view program forms"
  on program_forms for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert program forms"
  on program_forms for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update program forms"
  on program_forms for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete program forms"
  on program_forms for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Form submissions policies
create policy "Users can view their own submissions"
  on form_submissions for select
  using (auth.uid() = user_id);

create policy "Admins can view all submissions"
  on form_submissions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Users can insert their own submissions"
  on form_submissions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own submissions"
  on form_submissions for update
  using (auth.uid() = user_id);

-- Form answers policies
create policy "Users can view their own answers"
  on form_answers for select
  using (
    exists (
      select 1 from form_submissions
      where form_submissions.id = form_answers.submission_id
      and form_submissions.user_id = auth.uid()
    )
  );

create policy "Admins can view all answers"
  on form_answers for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Users can insert their own answers"
  on form_answers for insert
  with check (
    exists (
      select 1 from form_submissions
      where form_submissions.id = form_answers.submission_id
      and form_submissions.user_id = auth.uid()
    )
  );

create policy "Users can update their own answers"
  on form_answers for update
  using (
    exists (
      select 1 from form_submissions
      where form_submissions.id = form_answers.submission_id
      and form_submissions.user_id = auth.uid()
    )
  );
