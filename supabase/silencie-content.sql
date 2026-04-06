-- Seed Silencie content (requires site_content table from naya-content.sql)
insert into site_content (site, key, value) values
  ('silencie', 'general', '{
    "header_title": "Silencie",
    "header_description": "Programa de meditação guiada de 21 dias para acalmar a mente, sair da ansiedade e criar clareza emocional",
    "payment_link": "https://loja.infinitepay.io/maricamposyogi/ccd7542-silencie",
    "whatsapp_number": "5564992463702",
    "start_date": "2026-01-15",
    "price": 138
  }'),
  ('silencie', 'faq', '[
    {"question": "Nunca meditei. Posso fazer o Silencie?", "answer": "As meditações são guiadas e progressivas. Você não precisa ter experiência prévia."},
    {"question": "Já medito. O programa ainda faz sentido para mim?", "answer": "O Silencie aprofunda a prática, trazendo constância, estrutura e novos olhares sobre presença, mente e cotidiano."},
    {"question": "Quanto tempo por dia preciso dedicar?", "answer": "Entre 15 a 20 minutos por dia."},
    {"question": "Haverá acompanhamento durante o programa?", "answer": "Sim. Conta com grupo exclusivo com suporte diário e encontros ao vivo."},
    {"question": "Por onde recebo os áudios de meditação?", "answer": "Enviados diariamente em comunidade exclusiva no WhatsApp com orientações e acompanhamento."},
    {"question": "E se eu não conseguir fazer a meditação no horário que for enviada?", "answer": "Pode fazer no horário que fizer sentido. Os áudios ficam disponíveis para praticar no seu tempo."},
    {"question": "Se eu perder um dia, atrapalha o processo?", "answer": "Não. Pode retomar no dia seguinte e seguir no seu ritmo."},
    {"question": "Já tentei meditar antes e não consegui. Por que dessa vez seria diferente?", "answer": "Terá um guia experiente, uma comunidade ativa e uma jornada estruturada de 21 dias para criar o hábito."}
  ]'),
  ('silencie', 'testimonials', '[
    {"name": "Roberta Ludwig", "photo": "", "text": "Sentia-me mais frágil, confusa, melancólica. Depois das práticas senti muito mais confiança. Entendi que emoções são positivas e podemos nos tranquilizar em momentos turbulentos. Raramente senti batimentos cardíacos acelerados. Percebo sinais de crises antecipadamente. Aceito tristeza bem, prezo pelo descanso. Adoro silêncio e serenidade. As aulas são como massagem, comida gostosa, férias leves."}
  ]'),
  ('silencie', 'daily_training', '[
    "Desacelerar o barulho da mente",
    "Sair do modo alerta constante e reatividade",
    "Dar clareza a pensamentos embaralhados",
    "Soltar peso emocional acumulado",
    "Acalmar irritação e ansiedade",
    "Construir presença",
    "Criar espaço interno e capacidade de escolher",
    "Reconstruir o centro pessoal",
    "Fortalecer estabilidade emocional",
    "Aprender a lidar com mente divagante",
    "Acessar descanso genuíno",
    "Sentir-se em casa dentro de si"
  ]'),
  ('silencie', 'rewards', '[
    "Mentoria com Mari Campos",
    "Tiragem de carta de oráculo",
    "Um mês de aulas de yoga",
    "Almofada de meditação",
    "Kit de produtos naturais e suplementos",
    "Vaga no programa Desinflame (programa de emagrecimento consciente)",
    "Journal exclusivo do Silencie"
  ]'),
  ('silencie', 'program_includes', '{
    "meditation": [
      "21 dias de meditação guiada",
      "Práticas diárias, progressivas e acessíveis",
      "Acesso via celular",
      "Acompanhamento em grupo exclusivo WhatsApp"
    ],
    "meetings": [
      "Dois encontros ao vivo com a mentora",
      "Uma aula de yoga presencial",
      "Uma aula de yoga online"
    ],
    "bonus": [
      "Workshop de Pranayama (respiração consciente)",
      "Aula com nutricionista sobre alimentação consciente e desinflamação"
    ]
  }')
on conflict (site, key) do nothing;
