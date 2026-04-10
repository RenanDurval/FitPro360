// ============================================
// FitPro360 - Type Definitions
// ============================================

export type Sexo = 'masculino' | 'feminino' | 'outro';
export type NivelExperiencia = 'iniciante' | 'intermediario' | 'avancado' | 'profissional';
export type ObjetivoFitness = 'perda_peso' | 'ganho_massa' | 'resistencia' | 'flexibilidade' | 'saude_geral' | 'performance' | 'reabilitacao';
export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
export type GrupoMuscular = 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' | 'pernas' | 'gluteos' | 'abdomen' | 'corpo_todo' | 'cardio';
export type TipoProfissional = 'medico' | 'treinador' | 'nutricionista';

export interface CondicaoSaude {
  doencas: string[];
  deficiencias: string[];
  medicamentos: string[];
  suplementos: string[];
  vitaminas: string[];
  alergias: string[];
  restricoesAlimentares: string[];
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  sexo: Sexo;
  dataNascimento: string;
  altura: number; // cm
  peso: number;   // kg
  nivelExperiencia: NivelExperiencia;
  objetivos: ObjetivoFitness[];
  modalidadesPreferidas: string[];
  diasDisponiveis: DiaSemana[];
  condicaoSaude: CondicaoSaude;
  academia?: AcademiaInfo;
  fotoPerfil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademiaInfo {
  nome: string;
  endereco: string;
  telefone: string;
  equipamentosDisponiveis: string[];
}

export interface Profissional {
  id: string;
  nome: string;
  tipo: TipoProfissional;
  especialidade: string;
  registro: string; // CRM, CREF, CRN
  telefone: string;
  email: string;
  observacoes: string;
}

// ===================== TREINO =====================

export interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: GrupoMuscular;
  modalidade: string;
  nivel: NivelExperiencia;
  equipamento: string;
  instrucoes: string;
  imagem?: string;
  videoUrl?: string;
  caloriasPorMinuto: number;
}

export interface SerieExercicio {
  exercicio: Exercicio;
  series: number;
  repeticoes: string; // "12" ou "30s" (tempo)
  carga?: string;
  descanso: number; // segundos
}

export interface TreinoDia {
  dia: DiaSemana;
  titulo: string;
  gruposFoco: GrupoMuscular[];
  exercicios: SerieExercicio[];
  duracaoEstimada: number; // minutos
  caloriasEstimadas: number;
}

export interface ProgramaTreino {
  id: string;
  nome: string;
  modalidade: string;
  nivel: NivelExperiencia;
  objetivo: ObjetivoFitness;
  duracaoSemanas: number;
  diasPorSemana: number;
  treinos: TreinoDia[];
  createdAt: string;
}

// ===================== NUTRIÇÃO =====================

export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  porcao: string;
  calorias: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  fibra: number;
}

export interface Refeicao {
  tipo: 'cafe_manha' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia';
  titulo: string;
  alimentos: { alimento: Alimento; quantidade: number }[];
  caloriasTotal: number;
  proteinaTotal: number;
  carboidratoTotal: number;
  gorduraTotal: number;
}

export interface PlanoDieta {
  id: string;
  caloriasAlvo: number;
  proteinaAlvo: number;
  carboidratoAlvo: number;
  gorduraAlvo: number;
  refeicoes: Refeicao[];
  listCompras: string[];
  createdAt: string;
}

// ===================== SENSORES / TRACKING =====================

export interface SensorData {
  passos: number;
  distancia: number; // km
  caloriasQueimadas: number;
  frequenciaCardiaca?: number;
  velocidadeMedia?: number; // km/h
  tempoAtivo: number; // minutos
  timestamp: string;
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  timestamp: number;
}

export interface AtividadeGPS {
  id: string;
  tipo: string;
  rota: GPSPoint[];
  distanciaTotal: number;
  tempoTotal: number;
  velocidadeMedia: number;
  caloriasQueimadas: number;
  startTime: string;
  endTime: string;
}

// ===================== LOCAIS =====================

export interface Local {
  id: string;
  nome: string;
  tipo: 'academia' | 'parque' | 'pista' | 'quadra' | 'piscina' | 'mercado' | 'feira' | 'loja_suplementos';
  endereco: string;
  latitude: number;
  longitude: number;
  distancia?: number;
  avaliacao: number;
  telefone?: string;
  horarioFuncionamento?: string;
}

// ===================== BLUETOOTH =====================

export interface DispositivoBLE {
  id: string;
  nome: string;
  tipo: 'relogio' | 'balanca' | 'monitor_cardiaco' | 'outro';
  conectado: boolean;
  bateria?: number;
  ultimaSincronizacao?: string;
}

export interface DadosDispositivo {
  frequenciaCardiaca?: number;
  passos?: number;
  calorias?: number;
  sono?: { duracao: number; qualidade: number };
  spo2?: number;
}
