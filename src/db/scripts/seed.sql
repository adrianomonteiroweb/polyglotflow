-- USERS 
INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
VALUES
  (1, 'Adriano', 'adriano@email.com', '$2b$12$N1HEuK9ast/WubWoHRv56.xAziPhRlz2NuBQ.aZLc6VPpJYmImAM6', NOW(), NOW()),
  (2, 'Jéssica', 'jessica@email.com', '$2b$12$N1HEuK9ast/WubWoHRv56.xAziPhRlz2NuBQ.aZLc6VPpJYmImAM6', NOW(), NOW()),
  (3, 'Neto', 'neto@email.com', '$2b$12$N1HEuK9ast/WubWoHRv56.xAziPhRlz2NuBQ.aZLc6VPpJYmImAM6', NOW(), NOW());

-- LANGUAGES
INSERT INTO languages (id, user_id, name, background_image_url, created_at)
VALUES
  (1, 1, 'Inglês', 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1000&auto=format&fit=crop', NOW()),
  (2, 1, 'Espanhol', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop', NOW()),
  (3, 1, 'Francês', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', NOW());

-- NOTES
INSERT INTO notes (
  id, user_id, language_id, title, content, category,
  difficulty, status, reviewed_at, archived_at,
  created_at, updated_at
) VALUES
  (1, 1, 1, 'Verbos irregulares', 'Lista dos principais verbos irregulares em inglês e suas conjugações no passado e particípio.', 'grammar', 'medium', 'pending', NULL, NULL, NOW(), NOW()),
  (2, 1, 1, 'Vocabulário de viagem', 'Palavras e frases úteis para usar durante viagens: aeroporto, hotel, restaurante, etc.', 'speaking', 'easy', 'reviewed', NOW(), NULL, NOW(), NOW()),
  (3, 1, 1, 'Pronúncia do TH', 'Dicas para melhorar a pronúncia dos sons ''th'' em inglês, com exemplos e exercícios.', 'speaking', 'hard', 'pending', NULL, NULL, NOW(), NOW()),
  (4, 1, 1, 'Tempos verbais', 'Explicação sobre os diferentes tempos verbais em inglês e quando usar cada um.', 'grammar', 'medium', 'archived', NOW(), NOW(), NOW(), NOW()),
  (5, 1, 1, 'Podcast: English with Lucy', 'Notas sobre o episódio #42 do podcast English with Lucy sobre expressões idiomáticas.', 'listening', 'medium', 'pending', NULL, NULL, NOW(), NOW()),
  (6, 1, 1, 'Artigo: The New York Times', 'Resumo e vocabulário do artigo sobre mudanças climáticas do NYT.', 'reading', 'hard', 'reviewed', NOW(), NULL, NOW(), NOW()),
  (7, 1, 1, 'Email formal', 'Modelo e dicas para escrever emails formais em inglês para contextos profissionais.', 'writing', 'medium', 'pending', NULL, NULL, NOW(), NOW()),
  (8, 1, 2, 'Conjugação de verbos', 'Regras para conjugar verbos regulares em espanhol nos tempos presente, passado e futuro.', 'grammar', 'medium', 'pending', NULL, NULL, NOW(), NOW());

-- NOTE_TAGS
INSERT INTO note_tags (id, note_id, tag) VALUES
  (1, 1, 'verbos'),
  (2, 1, 'gramática'),
  (3, 2, 'vocabulário'),
  (4, 2, 'viagem'),
  (5, 3, 'pronúncia'),
  (6, 3, 'fonética'),
  (7, 4, 'gramática'),
  (8, 4, 'verbos'),
  (9, 5, 'podcast'),
  (10, 5, 'expressões'),
  (11, 6, 'notícias'),
  (12, 6, 'vocabulário'),
  (13, 7, 'formal'),
  (14, 7, 'profissional'),
  (15, 8, 'verbos'),
  (16, 8, 'conjugação');