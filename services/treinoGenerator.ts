// ============================================
// FitPro360 - Training Program Generator
// ============================================
import { EXERCICIOS } from '../data/exercicios';
import {
  UserProfile, ProgramaTreino, TreinoDia, SerieExercicio, Exercicio,
  NivelExperiencia, ObjetivoFitness, GrupoMuscular, DiaSemana,
} from '../types';

const DIAS_SEMANA: DiaSemana[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

// Mapeamento de divisões de treino por frequência semanal
const DIVISOES: Record<number, GrupoMuscular[][]> = {
  2: [['peito', 'costas', 'ombros', 'abdomen'], ['pernas', 'gluteos', 'biceps', 'triceps']],
  3: [['peito', 'triceps', 'abdomen'], ['costas', 'biceps'], ['pernas', 'gluteos', 'ombros']],
  4: [['peito', 'triceps'], ['costas', 'biceps'], ['pernas', 'gluteos'], ['ombros', 'abdomen']],
  5: [['peito'], ['costas'], ['pernas', 'gluteos'], ['ombros', 'triceps'], ['biceps', 'abdomen']],
  6: [['peito'], ['costas'], ['pernas'], ['ombros'], ['biceps', 'triceps'], ['gluteos', 'abdomen']],
};

// Config por nível
const CONFIG_NIVEL: Record<NivelExperiencia, { series: number; reps: string; descanso: number; exerciciosPorGrupo: number }> = {
  iniciante: { series: 3, reps: '12-15', descanso: 90, exerciciosPorGrupo: 2 },
  intermediario: { series: 4, reps: '10-12', descanso: 75, exerciciosPorGrupo: 3 },
  avancado: { series: 4, reps: '8-10', descanso: 60, exerciciosPorGrupo: 4 },
  profissional: { series: 5, reps: '6-8', descanso: 45, exerciciosPorGrupo: 5 },
};

// Config por objetivo
const getRepsPorObjetivo = (objetivo: ObjetivoFitness): string => {
  switch (objetivo) {
    case 'perda_peso': return '15-20';
    case 'ganho_massa': return '8-12';
    case 'resistencia': return '15-25';
    case 'performance': return '3-6';
    case 'flexibilidade': return '30s'; // tempo
    default: return '10-15';
  }
};

const getDescansoObjetivo = (objetivo: ObjetivoFitness): number => {
  switch (objetivo) {
    case 'perda_peso': return 45;
    case 'ganho_massa': return 90;
    case 'resistencia': return 30;
    case 'performance': return 120;
    default: return 60;
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selecionarExercicios(
  grupo: GrupoMuscular,
  nivel: NivelExperiencia,
  modalidade: string,
  quantidade: number
): Exercicio[] {
  // Filtrar exercícios compatíveis
  const niveisPossiveis: NivelExperiencia[] =
    nivel === 'iniciante' ? ['iniciante'] :
    nivel === 'intermediario' ? ['iniciante', 'intermediario'] :
    ['iniciante', 'intermediario', 'avancado'];

  let exercicios = EXERCICIOS.filter(
    e => e.grupoMuscular === grupo && niveisPossiveis.includes(e.nivel)
  );

  // Priorizar a modalidade do usuário
  const daModalidade = exercicios.filter(e => e.modalidade === modalidade);
  const outros = exercicios.filter(e => e.modalidade !== modalidade);

  const combinados = [...shuffleArray(daModalidade), ...shuffleArray(outros)];
  return combinados.slice(0, quantidade);
}

function gerarTreinoDia(
  dia: DiaSemana,
  grupos: GrupoMuscular[],
  nivel: NivelExperiencia,
  objetivo: ObjetivoFitness,
  modalidade: string,
): TreinoDia {
  const config = CONFIG_NIVEL[nivel];
  const reps = getRepsPorObjetivo(objetivo);
  const descanso = getDescansoObjetivo(objetivo);

  const exercicios: SerieExercicio[] = [];
  let caloriasEstimadas = 0;

  for (const grupo of grupos) {
    const selecionados = selecionarExercicios(grupo, nivel, modalidade, config.exerciciosPorGrupo);

    for (const exercicio of selecionados) {
      const tempoExercicio = config.series * 1.5; // ~1.5 min por série
      caloriasEstimadas += exercicio.caloriasPorMinuto * tempoExercicio;

      exercicios.push({
        exercicio,
        series: config.series,
        repeticoes: reps,
        descanso,
      });
    }
  }

  const nomesGrupos: Record<GrupoMuscular, string> = {
    peito: 'Peito', costas: 'Costas', ombros: 'Ombros', biceps: 'Bíceps',
    triceps: 'Tríceps', pernas: 'Pernas', gluteos: 'Glúteos', abdomen: 'Abdômen',
    corpo_todo: 'Full Body', cardio: 'Cardio',
  };

  return {
    dia,
    titulo: grupos.map(g => nomesGrupos[g]).join(' + '),
    gruposFoco: grupos,
    exercicios,
    duracaoEstimada: Math.round(exercicios.length * (config.series * 1.5 + descanso / 60 * config.series)),
    caloriasEstimadas: Math.round(caloriasEstimadas),
  };
}

// Gerador para modalidades de cardio (corrida, ciclismo, natação)
function gerarTreinoCardio(
  dia: DiaSemana,
  modalidade: string,
  nivel: NivelExperiencia,
  objetivo: ObjetivoFitness,
): TreinoDia {
  const duracao =
    nivel === 'iniciante' ? 30 :
    nivel === 'intermediario' ? 45 :
    nivel === 'avancado' ? 60 : 75;

  const exerciciosCardio = EXERCICIOS.filter(
    e => e.modalidade === modalidade || e.modalidade === 'hiit'
  ).slice(0, 3);

  const caloriasEstimadas = exerciciosCardio.reduce(
    (total, e) => total + e.caloriasPorMinuto * (duracao / exerciciosCardio.length), 0
  );

  return {
    dia,
    titulo: `${modalidade.charAt(0).toUpperCase() + modalidade.slice(1)} - ${nivel}`,
    gruposFoco: ['cardio', 'corpo_todo'],
    exercicios: exerciciosCardio.map(e => ({
      exercicio: e,
      series: 1,
      repeticoes: `${Math.round(duracao / exerciciosCardio.length)} min`,
      descanso: 120,
    })),
    duracaoEstimada: duracao,
    caloriasEstimadas: Math.round(caloriasEstimadas),
  };
}

export function gerarProgramaTreino(user: UserProfile): ProgramaTreino {
  const diasDisponiveis = user.diasDisponiveis.length || 3;
  const modalidade = user.modalidadesPreferidas[0] || 'musculacao';
  const objetivo = user.objetivos[0] || 'saude_geral';
  const nivel = user.nivelExperiencia;

  const isCardioModalidade = ['corrida', 'ciclismo', 'natacao'].includes(modalidade);
  const isCorpoCompleto = ['yoga', 'pilates', 'crossfit', 'funcional', 'hiit'].includes(modalidade);

  const treinos: TreinoDia[] = [];
  const diasParaUsar = DIAS_SEMANA.filter(d => user.diasDisponiveis.includes(d)).slice(0, diasDisponiveis);

  if (isCardioModalidade) {
    // Para modalidades de cardio, alternar sessionType
    for (let i = 0; i < diasParaUsar.length; i++) {
      if (i % 2 === 0) {
        treinos.push(gerarTreinoCardio(diasParaUsar[i], modalidade, nivel, objetivo));
      } else {
        // Dia de fortalecimento
        const grupos: GrupoMuscular[] = i % 4 === 1
          ? ['pernas', 'gluteos', 'abdomen']
          : ['peito', 'costas', 'ombros'];
        treinos.push(gerarTreinoDia(diasParaUsar[i], grupos, nivel, objetivo, 'musculacao'));
      }
    }
  } else if (isCorpoCompleto) {
    // Para modalidades full-body
    for (const dia of diasParaUsar) {
      treinos.push(gerarTreinoDia(dia, ['corpo_todo', 'abdomen'], nivel, objetivo, modalidade));
    }
  } else {
    // Musculação / Calistenia - usar divisões
    const divisao = DIVISOES[Math.min(diasDisponiveis, 6)] || DIVISOES[3];
    for (let i = 0; i < diasParaUsar.length; i++) {
      const grupos = divisao[i % divisao.length];
      treinos.push(gerarTreinoDia(diasParaUsar[i], grupos, nivel, objetivo, modalidade));
    }
  }

  // Ajustes baseados em condições de saúde
  if (user.condicaoSaude.doencas.some(d =>
    d.toLowerCase().includes('coluna') || d.toLowerCase().includes('hernia') || d.toLowerCase().includes('lombar')
  )) {
    // Reduzir exercícios de alto impacto na coluna
    for (const treino of treinos) {
      treino.exercicios = treino.exercicios.filter(
        se => !['Agachamento Livre', 'Stiff', 'Remada Curvada com Barra'].includes(se.exercicio.nome)
      );
    }
  }

  const nomeModalidade = modalidade.charAt(0).toUpperCase() + modalidade.slice(1);

  return {
    id: `programa_${Date.now()}`,
    nome: `${nomeModalidade} - ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`,
    modalidade,
    nivel,
    objetivo,
    duracaoSemanas: nivel === 'iniciante' ? 8 : nivel === 'intermediario' ? 10 : 12,
    diasPorSemana: diasParaUsar.length,
    treinos,
    createdAt: new Date().toISOString(),
  };
}

// Gerar treino rápido (para quem tem pouco tempo)
export function gerarTreinoRapido(minutos: number = 20): TreinoDia {
  const exerciciosRapidos = shuffleArray(
    EXERCICIOS.filter(e => e.equipamento === 'Nenhum' && e.caloriasPorMinuto >= 8)
  ).slice(0, Math.floor(minutos / 4));

  return {
    dia: 'segunda',
    titulo: `Treino Rápido ${minutos}min`,
    gruposFoco: ['corpo_todo'],
    exercicios: exerciciosRapidos.map(e => ({
      exercicio: e,
      series: 3,
      repeticoes: '30s',
      descanso: 15,
    })),
    duracaoEstimada: minutos,
    caloriasEstimadas: exerciciosRapidos.reduce((t, e) => t + e.caloriasPorMinuto * (minutos / exerciciosRapidos.length), 0),
  };
}
