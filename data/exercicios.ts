import { Exercicio } from '../types';

export const MODALIDADES = [
  { id: 'musculacao', nome: 'Musculação', icone: 'fitness-center', cor: '#FF6B35' },
  { id: 'corrida', nome: 'Corrida', icone: 'directions-run', cor: '#00D4AA' },
  { id: 'ciclismo', nome: 'Ciclismo', icone: 'pedal-bike', cor: '#74B9FF' },
  { id: 'natacao', nome: 'Natação', icone: 'pool', cor: '#0984E3' },
  { id: 'yoga', nome: 'Yoga', icone: 'self-improvement', cor: '#A29BFE' },
  { id: 'crossfit', nome: 'CrossFit', icone: 'flash-on', cor: '#E94560' },
  { id: 'artes_marciais', nome: 'Artes Marciais', icone: 'sports-martial-arts', cor: '#FDCB6E' },
  { id: 'calistenia', nome: 'Calistenia', icone: 'accessibility-new', cor: '#55EFC4' },
  { id: 'hiit', nome: 'HIIT', icone: 'local-fire-department', cor: '#FF7675' },
  { id: 'funcional', nome: 'Funcional', icone: 'sports', cor: '#81ECEC' },
  { id: 'pilates', nome: 'Pilates', icone: 'spa', cor: '#DFE6E9' },
  { id: 'alongamento', nome: 'Alongamento', icone: 'accessibility', cor: '#B2BEC3' },
];

export const EXERCICIOS: Exercicio[] = [
  // ============ PEITO ============
  { id: 'e001', nome: 'Supino Reto com Barra', grupoMuscular: 'peito', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Barra e banco', instrucoes: 'Deite no banco, segure a barra na largura dos ombros, desça até o peito e empurre para cima.', caloriasPorMinuto: 8 },
  { id: 'e002', nome: 'Supino Inclinado com Halteres', grupoMuscular: 'peito', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Halteres e banco inclinado', instrucoes: 'Incline o banco a 30-45°, segure os halteres e realize o movimento de pressão.', caloriasPorMinuto: 7 },
  { id: 'e003', nome: 'Crucifixo com Halteres', grupoMuscular: 'peito', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Halteres e banco', instrucoes: 'Com os braços estendidos, abra lateralmente controlando o peso, e junte novamente.', caloriasPorMinuto: 6 },
  { id: 'e004', nome: 'Flexão de Braço', grupoMuscular: 'peito', modalidade: 'calistenia', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Posição de prancha, desça o corpo controladamente até quase tocar o chão e empurre.', caloriasPorMinuto: 8 },
  { id: 'e005', nome: 'Crossover na Polia', grupoMuscular: 'peito', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Polia (cabo crossover)', instrucoes: 'Puxe os cabos de cima para baixo cruzando à frente do corpo.', caloriasPorMinuto: 6 },
  { id: 'e006', nome: 'Supino Declinado', grupoMuscular: 'peito', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Barra e banco declinado', instrucoes: 'Banco declinado, desça a barra até a parte inferior do peito.', caloriasPorMinuto: 8 },

  // ============ COSTAS ============
  { id: 'e010', nome: 'Barra Fixa (Pull-up)', grupoMuscular: 'costas', modalidade: 'calistenia', nivel: 'intermediario', equipamento: 'Barra fixa', instrucoes: 'Pendure-se na barra com pegada pronada e puxe o corpo até o queixo passar da barra.', caloriasPorMinuto: 10 },
  { id: 'e011', nome: 'Remada Curvada com Barra', grupoMuscular: 'costas', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Barra', instrucoes: 'Incline o tronco a 45°, puxe a barra em direção ao abdômen contraindo as costas.', caloriasPorMinuto: 8 },
  { id: 'e012', nome: 'Puxada Frontal', grupoMuscular: 'costas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina puxada', instrucoes: 'Sentado, puxe a barra até a altura do peito, controlando a descida.', caloriasPorMinuto: 7 },
  { id: 'e013', nome: 'Remada Unilateral', grupoMuscular: 'costas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Halter e banco', instrucoes: 'Apoie um joelho e mão no banco e puxe o halter com a outra mão.', caloriasPorMinuto: 6 },
  { id: 'e014', nome: 'Remada Cavalinho', grupoMuscular: 'costas', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Máquina T-bar', instrucoes: 'Incline o tronco e puxe a barra em T direção ao abdômen.', caloriasPorMinuto: 8 },
  { id: 'e015', nome: 'Pullover com Halter', grupoMuscular: 'costas', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Halter e banco', instrucoes: 'Deitado no banco, segure o halter acima do peito e leve atrás da cabeça.', caloriasPorMinuto: 6 },

  // ============ OMBROS ============
  { id: 'e020', nome: 'Desenvolvimento com Halteres', grupoMuscular: 'ombros', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Halteres', instrucoes: 'Sentado ou em pé, empurre os halteres acima da cabeça.', caloriasPorMinuto: 7 },
  { id: 'e021', nome: 'Elevação Lateral', grupoMuscular: 'ombros', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Halteres', instrucoes: 'Em pé, eleve os halteres lateralmente até a altura dos ombros.', caloriasPorMinuto: 5 },
  { id: 'e022', nome: 'Elevação Frontal', grupoMuscular: 'ombros', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Halteres', instrucoes: 'Em pé, eleve os halteres à frente até a altura dos ombros.', caloriasPorMinuto: 5 },
  { id: 'e023', nome: 'Desenvolvimento Arnold', grupoMuscular: 'ombros', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Halteres', instrucoes: 'Comece com pegada supinada à frente e gire durante a subida.', caloriasPorMinuto: 7 },
  { id: 'e024', nome: 'Face Pull', grupoMuscular: 'ombros', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Polia com corda', instrucoes: 'Puxe a corda em direção ao rosto, abrindo os cotovelos.', caloriasPorMinuto: 5 },

  // ============ BÍCEPS ============
  { id: 'e030', nome: 'Rosca Direta com Barra', grupoMuscular: 'biceps', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Barra reta', instrucoes: 'Em pé, flexione os braços contraindo os bíceps, sem balançar o corpo.', caloriasPorMinuto: 5 },
  { id: 'e031', nome: 'Rosca Alternada com Halteres', grupoMuscular: 'biceps', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Halteres', instrucoes: 'Alterne a flexão dos braços com rotação de punho (supinação).', caloriasPorMinuto: 5 },
  { id: 'e032', nome: 'Rosca Martelo', grupoMuscular: 'biceps', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Halteres', instrucoes: 'Pegada neutra (martelo), flexione os braços sem girar o punho.', caloriasPorMinuto: 5 },
  { id: 'e033', nome: 'Rosca Concentrada', grupoMuscular: 'biceps', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Halter', instrucoes: 'Sentado, apoie o cotovelo na coxa e flexione isolando o bíceps.', caloriasPorMinuto: 4 },

  // ============ TRÍCEPS ============
  { id: 'e040', nome: 'Tríceps Pulley', grupoMuscular: 'triceps', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Polia com barra reta', instrucoes: 'Em pé, empurre a barra para baixo estendendo os braços.', caloriasPorMinuto: 5 },
  { id: 'e041', nome: 'Tríceps Testa', grupoMuscular: 'triceps', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Barra EZ e banco', instrucoes: 'Deitado, flexione os braços levando a barra à testa e empurre de volta.', caloriasPorMinuto: 6 },
  { id: 'e042', nome: 'Mergulho no Banco', grupoMuscular: 'triceps', modalidade: 'calistenia', nivel: 'iniciante', equipamento: 'Banco', instrucoes: 'Mãos no banco, desça o corpo flexionando os braços e empurre.', caloriasPorMinuto: 7 },
  { id: 'e043', nome: 'Tríceps Corda', grupoMuscular: 'triceps', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Polia com corda', instrucoes: 'Empurre a corda para baixo e abra as mãos no final do movimento.', caloriasPorMinuto: 5 },

  // ============ PERNAS ============
  { id: 'e050', nome: 'Agachamento Livre', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Barra (ou peso corporal)', instrucoes: 'Pés na largura dos ombros, desça como se fosse sentar mantendo o peito erguido.', caloriasPorMinuto: 10 },
  { id: 'e051', nome: 'Leg Press 45°', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina leg press', instrucoes: 'Empurre a plataforma sem travar os joelhos.', caloriasPorMinuto: 9 },
  { id: 'e052', nome: 'Cadeira Extensora', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina extensora', instrucoes: 'Sentado, estenda as pernas contraindo o quadríceps.', caloriasPorMinuto: 5 },
  { id: 'e053', nome: 'Mesa Flexora', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina flexora', instrucoes: 'Deitado, flexione as pernas contraindo os posteriores.', caloriasPorMinuto: 5 },
  { id: 'e054', nome: 'Avanço (Lunge)', grupoMuscular: 'pernas', modalidade: 'funcional', nivel: 'intermediario', equipamento: 'Halteres (opcional)', instrucoes: 'Dê um passo à frente e desça o joelho de trás até perto do chão.', caloriasPorMinuto: 8 },
  { id: 'e055', nome: 'Agachamento Búlgaro', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'avancado', equipamento: 'Banco e halteres', instrucoes: 'Pé traseiro no banco, desça o corpo em agachamento unilateral.', caloriasPorMinuto: 9 },
  { id: 'e056', nome: 'Panturrilha em Pé', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina ou step', instrucoes: 'Fique na ponta dos pés elevando o calcanhar ao máximo.', caloriasPorMinuto: 4 },
  { id: 'e057', nome: 'Stiff', grupoMuscular: 'pernas', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Barra ou halteres', instrucoes: 'Com pernas semiflexionadas, incline o tronco à frente e retorne.', caloriasPorMinuto: 7 },

  // ============ GLÚTEOS ============
  { id: 'e060', nome: 'Hip Thrust', grupoMuscular: 'gluteos', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Barra e banco', instrucoes: 'Costas apoiadas no banco, empurre o quadril para cima com a barra.', caloriasPorMinuto: 8 },
  { id: 'e061', nome: 'Elevação Pélvica', grupoMuscular: 'gluteos', modalidade: 'calistenia', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Deitado, pés no chão, eleve o quadril contraindo os glúteos.', caloriasPorMinuto: 5 },
  { id: 'e062', nome: 'Abdução de Quadril', grupoMuscular: 'gluteos', modalidade: 'musculacao', nivel: 'iniciante', equipamento: 'Máquina abdutora', instrucoes: 'Sentado, abra as pernas contra a resistência.', caloriasPorMinuto: 4 },
  { id: 'e063', nome: 'Coice na Polia', grupoMuscular: 'gluteos', modalidade: 'musculacao', nivel: 'intermediario', equipamento: 'Polia baixa', instrucoes: 'Em pé, chute a perna para trás contra a resistência do cabo.', caloriasPorMinuto: 5 },

  // ============ ABDÔMEN ============
  { id: 'e070', nome: 'Abdominal Crunch', grupoMuscular: 'abdomen', modalidade: 'calistenia', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Deitado, eleve apenas os ombros do chão contraindo o abdômen.', caloriasPorMinuto: 5 },
  { id: 'e071', nome: 'Prancha Isométrica', grupoMuscular: 'abdomen', modalidade: 'funcional', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Apoie-se nos antebraços e pontas dos pés, mantendo o corpo reto.', caloriasPorMinuto: 4 },
  { id: 'e072', nome: 'Abdominal Bicicleta', grupoMuscular: 'abdomen', modalidade: 'calistenia', nivel: 'intermediario', equipamento: 'Nenhum', instrucoes: 'Deitado, alterne cotovelo ao joelho oposto com movimento de pedalar.', caloriasPorMinuto: 7 },
  { id: 'e073', nome: 'Elevação de Pernas', grupoMuscular: 'abdomen', modalidade: 'calistenia', nivel: 'avancado', equipamento: 'Barra fixa ou banco', instrucoes: 'Pendurado ou deitado, eleve as pernas retas até a horizontal.', caloriasPorMinuto: 6 },
  { id: 'e074', nome: 'Prancha Lateral', grupoMuscular: 'abdomen', modalidade: 'funcional', nivel: 'intermediario', equipamento: 'Nenhum', instrucoes: 'Apoie-se no antebraço lateral, corpo reto, segure a posição.', caloriasPorMinuto: 4 },
  { id: 'e075', nome: 'Russian Twist', grupoMuscular: 'abdomen', modalidade: 'funcional', nivel: 'intermediario', equipamento: 'Peso ou medicine ball', instrucoes: 'Sentado com tronco inclinado, gire o tronco levando o peso de um lado ao outro.', caloriasPorMinuto: 6 },

  // ============ CARDIO ============
  { id: 'e080', nome: 'Corrida (esteira ou rua)', grupoMuscular: 'cardio', modalidade: 'corrida', nivel: 'iniciante', equipamento: 'Tênis', instrucoes: 'Mantenha uma passada confortável com respiração controlada.', caloriasPorMinuto: 12 },
  { id: 'e081', nome: 'Caminhada Rápida', grupoMuscular: 'cardio', modalidade: 'corrida', nivel: 'iniciante', equipamento: 'Tênis', instrucoes: 'Caminhe em ritmo acelerado mantendo os braços em movimento.', caloriasPorMinuto: 6 },
  { id: 'e082', nome: 'Bicicleta Ergométrica', grupoMuscular: 'cardio', modalidade: 'ciclismo', nivel: 'iniciante', equipamento: 'Bicicleta ergométrica', instrucoes: 'Pedale em ritmo constante ajustando a resistência.', caloriasPorMinuto: 8 },
  { id: 'e083', nome: 'Pular Corda', grupoMuscular: 'cardio', modalidade: 'hiit', nivel: 'intermediario', equipamento: 'Corda', instrucoes: 'Salte com os dois pés mantendo os cotovelos próximos ao corpo.', caloriasPorMinuto: 14 },
  { id: 'e084', nome: 'Burpee', grupoMuscular: 'corpo_todo', modalidade: 'hiit', nivel: 'avancado', equipamento: 'Nenhum', instrucoes: 'Agache, chute os pés para trás (prancha), flexão, retorne e salte.', caloriasPorMinuto: 15 },
  { id: 'e085', nome: 'Mountain Climber', grupoMuscular: 'corpo_todo', modalidade: 'hiit', nivel: 'intermediario', equipamento: 'Nenhum', instrucoes: 'Em posição de prancha, alterne trazendo os joelhos ao peito rapidamente.', caloriasPorMinuto: 12 },
  { id: 'e086', nome: 'Jumping Jack', grupoMuscular: 'corpo_todo', modalidade: 'funcional', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Salte abrindo pernas e braços simultaneamente, retorne à posição inicial.', caloriasPorMinuto: 10 },
  { id: 'e087', nome: 'Natação (crawl)', grupoMuscular: 'corpo_todo', modalidade: 'natacao', nivel: 'intermediario', equipamento: 'Piscina', instrucoes: 'Braçadas alternadas com respiração lateral e batida de pernas.', caloriasPorMinuto: 11 },
  { id: 'e088', nome: 'Ciclismo Outdoor', grupoMuscular: 'cardio', modalidade: 'ciclismo', nivel: 'iniciante', equipamento: 'Bicicleta', instrucoes: 'Pedale em terreno variado mantendo cadência constante.', caloriasPorMinuto: 10 },

  // ============ YOGA / ALONGAMENTO ============
  { id: 'e090', nome: 'Saudação ao Sol', grupoMuscular: 'corpo_todo', modalidade: 'yoga', nivel: 'iniciante', equipamento: 'Tapete de yoga', instrucoes: 'Sequência fluida de 12 posturas conectadas pela respiração.', caloriasPorMinuto: 5 },
  { id: 'e091', nome: 'Postura do Guerreiro I', grupoMuscular: 'pernas', modalidade: 'yoga', nivel: 'iniciante', equipamento: 'Tapete de yoga', instrucoes: 'Passo largo, joelho à frente flexionado, braços estendidos para cima.', caloriasPorMinuto: 4 },
  { id: 'e092', nome: 'Postura do Guerreiro II', grupoMuscular: 'pernas', modalidade: 'yoga', nivel: 'intermediario', equipamento: 'Tapete de yoga', instrucoes: 'Passo largo, braços abertos paralelos ao chão, olhe para frente.', caloriasPorMinuto: 4 },
  { id: 'e093', nome: 'Postura da Árvore', grupoMuscular: 'pernas', modalidade: 'yoga', nivel: 'iniciante', equipamento: 'Tapete de yoga', instrucoes: 'Equilibre-se em uma perna com o pé apoiado na coxa oposta.', caloriasPorMinuto: 3 },
  { id: 'e094', nome: 'Alongamento de Isquiotibiais', grupoMuscular: 'pernas', modalidade: 'alongamento', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Sentado, estenda a perna e alcance os dedos do pé.', caloriasPorMinuto: 2 },
  { id: 'e095', nome: 'Alongamento de Quadríceps', grupoMuscular: 'pernas', modalidade: 'alongamento', nivel: 'iniciante', equipamento: 'Nenhum', instrucoes: 'Em pé, segure o pé atrás puxando o calcanhar ao glúteo.', caloriasPorMinuto: 2 },
];

export const getExerciciosPorModalidade = (modalidade: string): Exercicio[] =>
  EXERCICIOS.filter(e => e.modalidade === modalidade);

export const getExerciciosPorGrupo = (grupo: string): Exercicio[] =>
  EXERCICIOS.filter(e => e.grupoMuscular === grupo);

export const getExerciciosPorNivel = (nivel: string): Exercicio[] =>
  EXERCICIOS.filter(e => e.nivel === nivel || (nivel === 'profissional' && e.nivel === 'avancado'));
