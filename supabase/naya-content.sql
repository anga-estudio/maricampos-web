-- Table to store CMS content for all sites (naya, silencie, mari-campos)
create table if not exists site_content (
  id uuid default gen_random_uuid() primary key,
  site text not null,
  key text not null,
  value jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique (site, key)
);

-- Enable RLS
alter table site_content enable row level security;

-- Allow authenticated users to read and write
create policy "Authenticated users can read site_content"
  on site_content for select
  to authenticated
  using (true);

create policy "Authenticated users can insert site_content"
  on site_content for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update site_content"
  on site_content for update
  to authenticated
  using (true);

-- Allow anonymous reads (for the public sites to fetch content)
create policy "Anonymous users can read site_content"
  on site_content for select
  to anon
  using (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_content_updated_at
  before update on site_content
  for each row
  execute function update_updated_at();

-- Seed initial Nayá content
insert into site_content (site, key, value) values
  ('naya', 'general', '{
    "payment_link": "https://invoice.infinitepay.io/maricamposyogi/3myfGGJ8SF",
    "payment_buttons_enabled": true,
    "whatsapp_number": "5564992463702",
    "header_phrase": "O caminho de volta para a mulher que você era antes de se perder.",
    "start_date": "2026-04-22",
    "weeks_count": 8,
    "weekly_meeting_minutes": 90,
    "daily_practice_min": 10,
    "daily_practice_max": 20,
    "price": 988
  }'),
  ('naya', 'target_audience', '[
    "Acorda cansada mesmo depois de dormir. O descanso nunca chega de verdade.",
    "Sente ansiedade como um estado permanente. O peito aperta sem motivo.",
    "Tem culpa de descansar, de dizer não, de não dar conta de tudo.",
    "Se cobra mais do que qualquer pessoa ao redor.",
    "Engole o desconforto pra agradar. Depois explode ou adoece.",
    "Começa com empolgação, desiste na segunda semana quando a vida aperta.",
    "Não se reconhece no espelho. O corpo, a energia, a motivação mudaram.",
    "Se irrita com coisas pequenas e depois se odeia por isso.",
    "Tem a mente nublada. Pensamentos acelerados, pouca concentração, cansaço mental.",
    "Cuida de todo mundo. No final do dia, não sobra nada pra si.",
    "Se sente sozinha mesmo rodeada de gente. Ninguém entende o peso que carrega."
  ]'),
  ('naya', 'included', '[
    {"title": "Encontros ao vivo com a Mari", "description": "8 encontros de 90 minutos em grupo com conteúdo, prática guiada e troca real."},
    {"title": "Meditação guiada", "description": "Áudios exclusivos para cada fase. Práticas de 10 a 20 minutos, no seu ritmo."},
    {"title": "Ferramentas práticas", "description": "Uma ferramenta por semana: mapeamento de crenças, mapas emocionais, protocolos de respiração, etc."},
    {"title": "Comunidade no WhatsApp", "description": "Troca diária, acolhimento e conexão com as participantes e com a Mari."},
    {"title": "Especialistas convidadas", "description": "Saúde hormonal, nutrição, bioenergia — abrangendo todas as dimensões do bem-estar."},
    {"title": "Diagnóstico Raio-X", "description": "Mapeamento completo no início e no final. Resultado visível de antes e depois."},
    {"title": "Aulas de yoga com a Mari", "description": "Práticas que liberam o que a mente não consegue. Corpo, respiração e movimento."},
    {"title": "Bônus: Workshop Pratyahara", "description": "Prática imersiva de presença e respiração. Aprender a se desconectar do externo e voltar pra dentro a qualquer momento."}
  ]'),
  ('naya', 'journey', '[
    {"weeks": "Semanas 1-2", "title": "Voltar pra casa", "items": ["Reaprender a habitar seu corpo.", "Entender os padrões que se repetem.", "Identificar crenças da infância que nunca foram suas."], "outcome": "Um mapa pessoal que você nunca teve antes."},
    {"weeks": "Semanas 3-4", "title": "Nutrir e aprofundar", "items": ["Entender que o cansaço não se resolve só com sono.", "Aprender como alimentação e consumo de informação afetam suas emoções."], "outcome": "Clareza sobre o que te nutre e o que te intoxica."},
    {"weeks": "Semanas 5-6", "title": "Estruturar e integrar", "items": ["Reorganizar a rotina a partir do seu ritmo real, não das demandas externas.", "Entender como os ciclos hormonais impactam energia, humor e foco.", "Aprender a dizer não sem culpa. Colocar limites sem precisar se explicar."], "outcome": "Saber o que é seu, o que é do outro e onde traçar a linha."},
    {"weeks": "Semanas 7-8", "title": "Florescer e sustentar", "items": ["Confiar nas suas decisões sem buscar aprovação.", "Celebrar conquistas.", "Criar práticas que não dependem de motivação."], "outcome": "Uma estrutura sustentável mesmo quando a vida apertar de novo."}
  ]'),
  ('naya', 'transformations', '[
    {"before": "Reage com explosão ou paralisia. Sistema nervoso em modo de sobrevivência.", "after": "Sente a ativação, respira, escolhe a resposta. Emoções presentes, mas não controlam."},
    {"before": "Acorda assustada, começa atrasada, resolve tudo pros outros até o fim do dia.", "after": "Ritual matinal inegociável, planeja a partir da energia real, se prioriza."},
    {"before": "Aceita demandas que não são suas. Engole, acumula, explode ou adoece em silêncio.", "after": "\"Não\" sereno mas firme. Recusa ser sua própria última prioridade."},
    {"before": "\"Não aguento mais.\" \"Só queria sumir pra descansar.\"", "after": "\"Tenho base.\" \"Sei voltar pra mim.\" \"Meu descanso é sagrado.\""},
    {"before": "Um fardo. Dores ignoradas, mente nublada, não se reconhece no espelho.", "after": "Sua casa. Entende os sinais, age de acordo, sustenta o autocuidado."}
  ]'),
  ('naya', 'outcomes', '[
    "Reduzir ansiedade e ruminação com ferramentas aplicáveis no dia a dia.",
    "Decidir com mais clareza e menos culpa.",
    "Criar limites e sustentar o autocuidado sem esperar chegar ao limite.",
    "Recuperar energia e confiança através da consistência, não da motivação.",
    "Entender de onde vêm os padrões e aprender a responder em vez de apenas reagir.",
    "Desenvolver uma prática diária simples que se torna base, não mais uma tarefa."
  ]'),
  ('naya', 'mentor', '{
    "title": "Quem vai caminhar com você",
    "name": "Mari Campos",
    "description": "Professora de yoga e meditação, facilitadora de transformação, criadora do programa Silencie e da mentoria Nayá. Mais de 10 anos dedicados à meditação, yoga, respiração consciente e técnicas de presença no Brasil e no exterior. Sua abordagem combina profundidade, consistência e compaixão — criando espaços seguros para o silêncio, a escuta e a transformação sustentável."
  }'),
  ('naya', 'testimonials', '[
    {"name": "Ana Lúcia Fonseca", "text": "Os três primeiros dias revolucionaram minha vida! Incorporei a respiração na rotina diária. Sem mais dificuldade para dormir, descanso melhor, acordo revigorada. Mais importante: sem mais crises de ansiedade na sexta-feira. (Trabalho secundário exige foco/agilidade sábado-domingo.) Obrigada Mari e participantes!"},
    {"name": "Andre Nascimento", "text": "Reflexão final da jornada: inspirador ver um projeto de tanta qualidade e profundidade, com conteúdo e práticas transformadoras. A atenção aos detalhes mostra cuidado e dedicação. Muito grato! Parabéns!"},
    {"name": "Lu Mangoni", "text": "Esses dias foram profundamente significativos. Trouxeram consciência da presença no momento, percebendo padrões automáticos, puxando de volta para viver o agora com mais presença, alegria e intenção em cada momento."}
  ]'),
  ('naya', 'works_even_if', '[
    "Nunca meditou na vida.",
    "Acha que não tem tempo (são só 10-20 min/dia + 1 sessão semanal).",
    "Já desistiu várias vezes (aqui você tem estrutura, não só força de vontade).",
    "Acredita que \"não consegue aquietar a mente\" (ninguém consegue no início).",
    "Está na perimenopausa ou menopausa (trabalhamos com o corpo que você tem agora).",
    "Não se considera \"espiritualizada\" (a Nayá é baseada em prática, fisiologia e ferramentas concretas)."
  ]'),
  ('naya', 'faq', '[
    {"question": "Quanto tempo diário é necessário?", "answer": "10 a 20 minutos de meditação diária + 90 minutos na sessão semanal. As ferramentas se integram à rotina — sem tempo extra."},
    {"question": "As sessões são ao vivo? Ficam gravadas?", "answer": "Sim, ao vivo com gravações disponíveis. A troca em grupo é essencial — recomendamos fortemente participar ao vivo."},
    {"question": "Nunca meditei. Consigo acompanhar?", "answer": "Sim. As práticas são guiadas, progressivas e acessíveis. Não precisa de experiência prévia, apenas disposição."},
    {"question": "Faço terapia. A Nayá substitui?", "answer": "Não. A Nayá complementa a terapia. Prática diária e regulação do sistema nervoso frequentemente potencializam o trabalho terapêutico."},
    {"question": "O grupo é grande?", "answer": "Não. Vagas limitadas intencionalmente. Grupos pequenos para que a Mari veja e ouça cada pessoa."}
  ]')
on conflict (site, key) do nothing;
