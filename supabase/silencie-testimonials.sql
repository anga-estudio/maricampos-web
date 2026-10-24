-- Silencie: importa para o painel os depoimentos que estavam fixos no código de
-- maricampos-silencie-web/app/page.tsx.
--
-- Rodar no SQL Editor do Supabase. Sobrescreve a chave testimonials
-- (do update), ao contrário dos seeds anteriores, que usavam do nothing.
-- A chave testimonials nunca foi editada no painel: ainda estava com o
-- conteúdo e o carimbo do seed original de 06/04/2026.
--
-- As premiações (rewards) NÃO são tocadas aqui, de propósito. A lista de 5
-- itens editada no painel em 23/10/2026 é a versão válida e permanece como
-- está. A lista de 7 itens que existia fixa no site foi descartada.
--
-- Fotos: os caminhos são relativos e os arquivos já existem em
-- maricampos-silencie-web/public/photos/. O site renderiza normalmente. A
-- miniatura dentro do painel fica quebrada, porque o painel roda em outro
-- domínio; ao reenviar a foto pelo painel, o caminho vira uma URL do Storage.

insert into site_content (site, key, value) values
  ('silencie', 'testimonials', '[
  {
    "name": "Roberta Ludwig",
    "photo": "/photos/testimonial-1.jpg",
    "text": "Eu me sentia mais frágil, mais confusa, mais melancólica. Depois das práticas senti muito mais confiança nas técnicas de autoconhecimento, me interessei por entender quais eram os sentimentos que vinham e por que vinham. Entendi que as emoções são ótimas e podemos nos tranquilizar mesmo nos momentos turbulentos. Percebo que raramente senti novamente os batimentos cardíacos excessivamente acelerados, como acontecia antes. Sei perceber quando uma crise vai se instalar... Aceito a tristeza muito bem, prezo muito mais pelo meu descanso. Adoro ficar em silêncio e em ambientes de maior serenidade. Leio sobre yoga, respiração, e escuto muitos e diversos mantras. As aulas com a Mari são como uma massagem, uma comida gostosa, um dia de férias bem leve. São aulas de carinho com meu corpo."
  },
  {
    "name": "Ana Paula de Oliveira",
    "photo": "/photos/testimonial-2.jpg",
    "text": "Tive a felicidade de ser apresentada, por amigas muito queridas, à Mari, essa profissional incrível, que conduz a prática de yoga, além de outras ferramentas de autoconhecimento, com técnica, leveza e intensidade ao mesmo tempo. 🥰 Mari é uma pessoa linda, que conduz seu trabalho com pura doação, sensibilidade e empatia! ❤️"
  },
  {
    "name": "Maria Miguel",
    "photo": "/photos/testimonial-3.jpg",
    "text": "As práticas com a Mari são muito especiais para mim. As aulas vão muito além dos movimentos físicos. As reflexões que ela sempre traz no início e no final da aula trazem foco também para a nossa parte espiritual/energética, o que propicia uma experiência muito mais profunda do que uma aula de yoga comum, proporcionando nos bem estar físico e psicológico. Além disso, ela demonstra uma conexão muito especial com seus alunos, transformando cada prática em momentos de cura para todos."
  }
]')
on conflict (site, key) do update set value = excluded.value;
