-- Seed: Anamnese Silencie
-- Execute this after running schema.sql
-- Uses gen_random_uuid() for proper UUID generation

DO $$
DECLARE
  -- Form template
  v_template_id UUID := gen_random_uuid();

  -- Sections
  v_section_1_id UUID := gen_random_uuid();
  v_section_2_id UUID := gen_random_uuid();
  v_section_3_id UUID := gen_random_uuid();
  v_section_4_id UUID := gen_random_uuid();
  v_section_5_id UUID := gen_random_uuid();
  v_section_6_id UUID := gen_random_uuid();
  v_section_7_id UUID := gen_random_uuid();
  v_section_8_id UUID := gen_random_uuid();
  v_section_9_id UUID := gen_random_uuid();

  -- Questions - Part 1
  v_q1_1_id UUID := gen_random_uuid();
  v_q1_2_id UUID := gen_random_uuid();
  v_q1_3_id UUID := gen_random_uuid();

  -- Questions - Part 2
  v_q2_1_id UUID := gen_random_uuid();
  v_q2_2_id UUID := gen_random_uuid();
  v_q2_3_id UUID := gen_random_uuid();
  v_q2_4_id UUID := gen_random_uuid();
  v_q2_5_id UUID := gen_random_uuid();
  v_q2_6_id UUID := gen_random_uuid();
  v_q2_7_id UUID := gen_random_uuid();

  -- Questions - Part 3
  v_q3_1_id UUID := gen_random_uuid();
  v_q3_2_id UUID := gen_random_uuid();
  v_q3_3_id UUID := gen_random_uuid();
  v_q3_4_id UUID := gen_random_uuid();
  v_q3_5_id UUID := gen_random_uuid();
  v_q3_6_id UUID := gen_random_uuid();

  -- Questions - Part 4
  v_q4_1_id UUID := gen_random_uuid();
  v_q4_2_id UUID := gen_random_uuid();
  v_q4_3_id UUID := gen_random_uuid();
  v_q4_4_id UUID := gen_random_uuid();
  v_q4_5_id UUID := gen_random_uuid();
  v_q4_6_id UUID := gen_random_uuid();

  -- Questions - Part 5
  v_q5_1_id UUID := gen_random_uuid();
  v_q5_2_id UUID := gen_random_uuid();
  v_q5_3_id UUID := gen_random_uuid();
  v_q5_4_id UUID := gen_random_uuid();
  v_q5_5_id UUID := gen_random_uuid();
  v_q5_6_id UUID := gen_random_uuid();

  -- Questions - Part 6
  v_q6_1_id UUID := gen_random_uuid();
  v_q6_2_id UUID := gen_random_uuid();
  v_q6_3_id UUID := gen_random_uuid();
  v_q6_4_id UUID := gen_random_uuid();
  v_q6_5_id UUID := gen_random_uuid();
  v_q6_6_id UUID := gen_random_uuid();

  -- Questions - Part 7
  v_q7_1_id UUID := gen_random_uuid();
  v_q7_2_id UUID := gen_random_uuid();
  v_q7_3_id UUID := gen_random_uuid();
  v_q7_4_id UUID := gen_random_uuid();
  v_q7_5_id UUID := gen_random_uuid();

  -- Questions - Part 8
  v_q8_1_id UUID := gen_random_uuid();
  v_q8_2_id UUID := gen_random_uuid();
  v_q8_3_id UUID := gen_random_uuid();
  v_q8_4_id UUID := gen_random_uuid();
  v_q8_5_id UUID := gen_random_uuid();

  -- Questions - Part 9
  v_q9_1_id UUID := gen_random_uuid();
  v_q9_2_id UUID := gen_random_uuid();
  v_q9_3_id UUID := gen_random_uuid();

BEGIN
  -- ==========================================
  -- Create the form template
  -- ==========================================
  INSERT INTO form_templates (id, name, description, intro_title, intro_description, is_active)
  VALUES (
    v_template_id,
    'Anamnese Silencie',
    'Diagnóstico de Mente, Presença e Regulação Emocional',
    'ANAMNESE SILENCIE',
    'Diagnóstico de Mente, Presença e Regulação Emocional

Objetivo: medir seu estado atual antes do início do Silencie e repetir no final para comparar evolução.
Tempo: 6 a 10 minutos.
Escala padrão: 0 a 10 (quanto maior, pior, exceto quando indicado).

Como a nota funciona:
Você vai receber uma Nota de Ruído Interno (0 a 100).
• 0 a 20: mente mais calma e regulada
• 21 a 40: ruído moderado, com bons recursos
• 41 a 60: ruído alto, atenção e energia bem drenadas
• 61 a 80: sobrecarga, piloto automático dominando
• 81 a 100: alerta máximo, urgência de reorganização interna

No final do programa, a meta é reduzir a nota. Quanto menor, mais transformação.',
    true
  );

  -- ==========================================
  -- PARTE 1 | Contexto e ponto de partida
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_1_id, v_template_id, 'Contexto e ponto de partida', NULL, 0);

  -- Pergunta 1: Você já meditou antes?
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, order_index)
  VALUES (v_q1_1_id, v_section_1_id, 'Você já meditou antes?', 'single_choice', true, 0);

  INSERT INTO form_options (question_id, option_text, order_index) VALUES
  (v_q1_1_id, 'Nunca', 0),
  (v_q1_1_id, 'Já tentei, mas não mantive', 1),
  (v_q1_1_id, 'Medito às vezes', 2),
  (v_q1_1_id, 'Medito com frequência', 3);

  -- Pergunta 2: Qual seu objetivo principal agora?
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, max_selections, order_index)
  VALUES (v_q1_2_id, v_section_1_id, 'Qual seu objetivo principal agora? (escolha até 2)', 'multiple_choice', true, 2, 1);

  INSERT INTO form_options (question_id, option_text, order_index) VALUES
  (v_q1_2_id, 'Acalmar a mente e ansiedade', 0),
  (v_q1_2_id, 'Dormir melhor', 1),
  (v_q1_2_id, 'Parar ruminação e autocrítica', 2),
  (v_q1_2_id, 'Ter mais foco e presença', 3),
  (v_q1_2_id, 'Regular emoções e reatividade', 4),
  (v_q1_2_id, 'Criar constância e disciplina interna', 5),
  (v_q1_2_id, 'Fortalecer amor próprio e autocompaixão', 6),
  (v_q1_2_id, 'Fazer as pazes com passado', 7),
  (v_q1_2_id, 'Diminuir comparação e dependência de validação', 8);

  -- Pergunta 3: Qual frase mais descreve seu momento?
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, order_index)
  VALUES (v_q1_3_id, v_section_1_id, 'Qual frase mais descreve seu momento?', 'single_choice', true, 2);

  INSERT INTO form_options (question_id, option_text, order_index) VALUES
  (v_q1_3_id, 'Minha mente nunca desliga', 0),
  (v_q1_3_id, 'Eu vivo no automático', 1),
  (v_q1_3_id, 'Eu me cobro demais', 2),
  (v_q1_3_id, 'Eu me comparo e isso me drena', 3),
  (v_q1_3_id, 'Eu tenho dificuldade de sustentar hábitos', 4),
  (v_q1_3_id, 'Eu sinto que perdi meu centro', 5),
  (v_q1_3_id, 'Eu estou bem, mas quero aprofundar', 6);

  -- ==========================================
  -- PARTE 2 | Índice de Ruído Mental e Atenção
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_2_id, v_template_id, 'Índice de Ruído Mental e Atenção', '0 a 10, onde 10 = muito forte / quase sempre', 1);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, order_index) VALUES
  (v_q2_1_id, v_section_2_id, 'Ruminação sobre passado (repetir conversas, erros, "devia ter sido diferente")', 'scale', true, 'ruido_mental', 0),
  (v_q2_2_id, v_section_2_id, 'Preocupação com futuro (antecipação, cenários, medo do que pode acontecer)', 'scale', true, 'ruido_mental', 1),
  (v_q2_3_id, v_section_2_id, 'Mente acelerada (dificuldade de desligar, sensação de urgência interna)', 'scale', true, 'ruido_mental', 2),
  (v_q2_4_id, v_section_2_id, 'Dificuldade de ficar no presente (corpo aqui, mente longe)', 'scale', true, 'ruido_mental', 3),
  (v_q2_5_id, v_section_2_id, 'Pensamentos intrusivos (aparecem sem convite e te puxam)', 'scale', true, 'ruido_mental', 4),
  (v_q2_6_id, v_section_2_id, 'Sensação de confusão mental (excesso de ideias, dificuldade de priorizar)', 'scale', true, 'ruido_mental', 5),
  (v_q2_7_id, v_section_2_id, 'Desatenção nas tarefas (começa e pula, dispersa fácil)', 'scale', true, 'ruido_mental', 6);

  -- ==========================================
  -- PARTE 3 | Corpo e Sistema Nervoso
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_3_id, v_template_id, 'Corpo e Sistema Nervoso', '0 a 10, onde 10 = muito forte / quase sempre', 2);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, is_inverted, scale_min_label, scale_max_label, order_index) VALUES
  (v_q3_1_id, v_section_3_id, 'Tensão corporal (mandíbula, ombro, pescoço, peito, estômago)', 'scale', true, 'ruido_mental', false, NULL, NULL, 0),
  (v_q3_2_id, v_section_3_id, 'Sensação de alerta/ansiedade no corpo (aperto, agitação, taquicardia, nó)', 'scale', true, 'ruido_mental', false, NULL, NULL, 1),
  (v_q3_3_id, v_section_3_id, 'Cansaço mental (exaustão sem motivo físico claro)', 'scale', true, 'ruido_mental', false, NULL, NULL, 2),
  (v_q3_4_id, v_section_3_id, 'Qualidade do sono', 'scale', true, 'ruido_mental', false, 'ótimo', 'péssimo', 3),
  (v_q3_5_id, v_section_3_id, 'Uso de telas como anestesia (scroll para escapar, aliviar, adormecer)', 'scale', true, 'ruido_mental', false, NULL, NULL, 4),
  (v_q3_6_id, v_section_3_id, 'Capacidade de recuperar o centro quando você desregula', 'scale', true, 'ruido_mental', true, 'recupero fácil', 'não consigo', 5);

  -- ==========================================
  -- PARTE 4 | Piloto Automático e Reatividade
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_4_id, v_template_id, 'Piloto Automático e Reatividade', '0 a 10, onde 10 = muito forte / quase sempre', 3);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, order_index) VALUES
  (v_q4_1_id, v_section_4_id, 'Eu reajo no impulso e só percebo depois', 'scale', true, 'ruido_mental', 0),
  (v_q4_2_id, v_section_4_id, 'Eu me arrependo do tom ou da forma como respondo', 'scale', true, 'ruido_mental', 1),
  (v_q4_3_id, v_section_4_id, 'Eu entro em ciclos repetidos (mesma emoção, mesma resposta)', 'scale', true, 'ruido_mental', 2),
  (v_q4_4_id, v_section_4_id, 'Eu "sei o que fazer" mas não faço (travamento, não ação)', 'scale', true, 'ruido_mental', 3),
  (v_q4_5_id, v_section_4_id, 'Eu fujo do desconforto (comida, tela, procrastinação, distração)', 'scale', true, 'ruido_mental', 4),
  (v_q4_6_id, v_section_4_id, 'Eu sinto que não tenho escolha, só acontece', 'scale', true, 'ruido_mental', 5);

  -- ==========================================
  -- PARTE 5 | Autocrítica, culpa e diálogo interno
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_5_id, v_template_id, 'Autocrítica, culpa e diálogo interno', '0 a 10, onde 10 = muito forte / quase sempre', 4);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, is_inverted, scale_min_label, scale_max_label, order_index) VALUES
  (v_q5_1_id, v_section_5_id, 'Eu falo comigo de forma dura', 'scale', true, 'ruido_mental', false, NULL, NULL, 0),
  (v_q5_2_id, v_section_5_id, 'Eu sinto culpa por coisas do passado', 'scale', true, 'ruido_mental', false, NULL, NULL, 1),
  (v_q5_3_id, v_section_5_id, 'Eu sinto que nunca é suficiente (perfeccionismo)', 'scale', true, 'ruido_mental', false, NULL, NULL, 2),
  (v_q5_4_id, v_section_5_id, 'Eu me cobro como se estivesse sempre devendo algo', 'scale', true, 'ruido_mental', false, NULL, NULL, 3),
  (v_q5_5_id, v_section_5_id, 'Eu tenho dificuldade de me perdoar', 'scale', true, 'ruido_mental', false, NULL, NULL, 4),
  (v_q5_6_id, v_section_5_id, 'Eu consigo ser gentil comigo quando erro', 'scale', true, 'ruido_mental', true, 'sim', 'não', 5);

  -- ==========================================
  -- PARTE 6 | Eu, Meu e Identidade rígida
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_6_id, v_template_id, 'Eu, Meu e Identidade rígida', '0 a 10, onde 10 = muito forte / quase sempre', 5);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, is_inverted, scale_min_label, scale_max_label, order_index) VALUES
  (v_q6_1_id, v_section_6_id, 'Eu me prendo em "minha opinião", "meu jeito", "minha verdade"', 'scale', true, 'ruido_mental', false, NULL, NULL, 0),
  (v_q6_2_id, v_section_6_id, 'Eu sinto necessidade de controlar situações e pessoas', 'scale', true, 'ruido_mental', false, NULL, NULL, 1),
  (v_q6_3_id, v_section_6_id, 'Eu tenho dificuldade de aceitar mudanças e imprevistos', 'scale', true, 'ruido_mental', false, NULL, NULL, 2),
  (v_q6_4_id, v_section_6_id, 'Eu tomo tudo como pessoal', 'scale', true, 'ruido_mental', false, NULL, NULL, 3),
  (v_q6_5_id, v_section_6_id, 'Eu me defino pelo que sinto (se estou mal, eu sou mal)', 'scale', true, 'ruido_mental', false, NULL, NULL, 4),
  (v_q6_6_id, v_section_6_id, 'Eu consigo ver emoções como passagem', 'scale', true, 'ruido_mental', true, 'sim', 'não', 5);

  -- ==========================================
  -- PARTE 7 | Comparação, validação e lugar no mundo
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_7_id, v_template_id, 'Comparação, validação e lugar no mundo', '0 a 10, onde 10 = muito forte / quase sempre', 6);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, is_inverted, scale_min_label, scale_max_label, order_index) VALUES
  (v_q7_1_id, v_section_7_id, 'Eu me comparo e me sinto menor', 'scale', true, 'ruido_mental', false, NULL, NULL, 0),
  (v_q7_2_id, v_section_7_id, 'Eu dependo de reconhecimento externo para me sentir bem', 'scale', true, 'ruido_mental', false, NULL, NULL, 1),
  (v_q7_3_id, v_section_7_id, 'Eu mudo minha forma de ser por medo de julgamento', 'scale', true, 'ruido_mental', false, NULL, NULL, 2),
  (v_q7_4_id, v_section_7_id, 'Eu tenho dificuldade de ficar comigo em silêncio', 'scale', true, 'ruido_mental', false, NULL, NULL, 3),
  (v_q7_5_id, v_section_7_id, 'Eu elogio e celebro outros sem me diminuir', 'scale', true, 'ruido_mental', true, 'sim', 'não', 4);

  -- ==========================================
  -- PARTE 8 | Presença, sentido e consistência (POTÊNCIA)
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_8_id, v_template_id, 'Presença, sentido e consistência', 'Aqui mede recurso, não dor. Escala 0 a 10, onde 10 = melhor', 7);

  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, scoring_category, scale_min_label, scale_max_label, order_index) VALUES
  (v_q8_1_id, v_section_8_id, 'Eu consigo perceber meus padrões com clareza', 'scale', true, 'potencia', 'não consigo', 'consigo muito bem', 0),
  (v_q8_2_id, v_section_8_id, 'Eu consigo pausar antes de responder', 'scale', true, 'potencia', 'não consigo', 'consigo muito bem', 1),
  (v_q8_3_id, v_section_8_id, 'Eu tenho constância mínima em um hábito (mesmo pequeno)', 'scale', true, 'potencia', 'nenhuma constância', 'constância total', 2),
  (v_q8_4_id, v_section_8_id, 'Eu sinto que tenho um motivo, um norte', 'scale', true, 'potencia', 'nenhum', 'muito claro', 3),
  (v_q8_5_id, v_section_8_id, 'Eu consigo sustentar um compromisso comigo por 21 dias', 'scale', true, 'potencia', 'não consigo', 'consigo tranquilamente', 4);

  -- ==========================================
  -- PARTE 9 | Compromisso e contexto prático
  -- ==========================================
  INSERT INTO form_sections (id, form_template_id, title, description, order_index)
  VALUES (v_section_9_id, v_template_id, 'Compromisso e contexto prático', NULL, 8);

  -- Pergunta: Horário mais provável
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, order_index)
  VALUES (v_q9_1_id, v_section_9_id, 'Qual horário mais provável para sua prática diária?', 'single_choice', true, 0);

  INSERT INTO form_options (question_id, option_text, order_index) VALUES
  (v_q9_1_id, 'Ao acordar', 0),
  (v_q9_1_id, 'Meio do dia', 1),
  (v_q9_1_id, 'Final da tarde', 2),
  (v_q9_1_id, 'Antes de dormir', 3),
  (v_q9_1_id, 'Não sei ainda', 4);

  -- Pergunta: Maior obstáculo
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, order_index)
  VALUES (v_q9_2_id, v_section_9_id, 'Qual maior obstáculo para você manter consistência?', 'single_choice', true, 1);

  INSERT INTO form_options (question_id, option_text, order_index) VALUES
  (v_q9_2_id, 'Falta de tempo', 0),
  (v_q9_2_id, 'Falta de energia', 1),
  (v_q9_2_id, 'Procrastinação', 2),
  (v_q9_2_id, 'Esquecimento', 3),
  (v_q9_2_id, 'Ceticismo ("não funciona pra mim")', 4),
  (v_q9_2_id, 'Ambiente/barulho', 5),
  (v_q9_2_id, 'Emoções intensas me derrubam', 6);

  -- Pergunta: O que você quer sentir
  INSERT INTO form_questions (id, section_id, question_text, question_type, is_required, help_text, order_index)
  VALUES (v_q9_3_id, v_section_9_id, 'Em uma frase: o que você quer sentir ao final do Silencie?', 'textarea', true, 'Resposta livre - escreva com suas palavras', 2);

  RAISE NOTICE 'Anamnese Silencie criada com sucesso! Template ID: %', v_template_id;
END $$;
