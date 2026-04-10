// ============================================
// FitPro360 - Diet Plan Generator
// ============================================
import { ALIMENTOS } from '../data/alimentos';
import { UserProfile, PlanoDieta, Refeicao, Alimento, ObjetivoFitness } from '../types';

// Calcular Taxa Metabólica Basal (Mifflin-St Jeor)
export function calcularTMB(peso: number, altura: number, idade: number, sexo: string): number {
  if (sexo === 'masculino') {
    return 10 * peso + 6.25 * altura - 5 * idade + 5;
  } else {
    return 10 * peso + 6.25 * altura - 5 * idade - 161;
  }
}

// Calcular GET (Gasto Energético Total)
export function calcularGET(tmb: number, nivelAtividade: string): number {
  const fatores: Record<string, number> = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    muito_intenso: 1.9,
  };
  return tmb * (fatores[nivelAtividade] || 1.55);
}

// Ajustar calorias pelo objetivo
function ajustarCaloriasPorObjetivo(get: number, objetivo: ObjetivoFitness): number {
  switch (objetivo) {
    case 'perda_peso': return Math.round(get * 0.80); // Déficit de 20%
    case 'ganho_massa': return Math.round(get * 1.15); // Superávit de 15%
    case 'performance': return Math.round(get * 1.10);
    case 'resistencia': return Math.round(get * 1.05);
    default: return Math.round(get);
  }
}

// Distribuir macros
function distribuirMacros(calorias: number, objetivo: ObjetivoFitness, peso: number) {
  let proteinaPorKg: number;
  let gorduraPct: number;

  switch (objetivo) {
    case 'ganho_massa':
      proteinaPorKg = 2.0;
      gorduraPct = 0.25;
      break;
    case 'perda_peso':
      proteinaPorKg = 2.2;
      gorduraPct = 0.25;
      break;
    case 'performance':
      proteinaPorKg = 1.8;
      gorduraPct = 0.20;
      break;
    default:
      proteinaPorKg = 1.6;
      gorduraPct = 0.30;
  }

  const proteina = Math.round(proteinaPorKg * peso);
  const gordura = Math.round((calorias * gorduraPct) / 9);
  const caloriasRestantes = calorias - (proteina * 4) - (gordura * 9);
  const carboidrato = Math.round(caloriasRestantes / 4);

  return { proteina, gordura, carboidrato };
}

// Selecionar alimentos por categoria
function selecionarAlimentos(categoria: string, quantidade: number): Alimento[] {
  const disponiveis = ALIMENTOS.filter(a => a.categoria === categoria);
  const shuffled = [...disponiveis].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, quantidade);
}

// Gerar uma refeição
function gerarRefeicao(
  tipo: Refeicao['tipo'],
  titulo: string,
  caloriaAlvo: number,
  proteinaAlvo: number,
): Refeicao {
  const alimentos: { alimento: Alimento; quantidade: number }[] = [];
  let calAtual = 0;
  let protAtual = 0;

  // Adicionar proteína
  const proteinas = selecionarAlimentos('Proteínas', 1);
  if (proteinas.length) {
    const qtd = Math.max(1, Math.round(proteinaAlvo / proteinas[0].proteina));
    alimentos.push({ alimento: proteinas[0], quantidade: qtd });
    calAtual += proteinas[0].calorias * qtd;
    protAtual += proteinas[0].proteina * qtd;
  }

  // Adicionar carboidrato
  const carboidratos = selecionarAlimentos('Carboidratos', 1);
  if (carboidratos.length) {
    const calRestante = caloriaAlvo - calAtual;
    const qtd = Math.max(1, Math.round((calRestante * 0.5) / carboidratos[0].calorias));
    alimentos.push({ alimento: carboidratos[0], quantidade: qtd });
    calAtual += carboidratos[0].calorias * qtd;
  }

  // Adicionar vegetal/fruta
  if (['almoco', 'jantar'].includes(tipo)) {
    const vegetais = selecionarAlimentos('Vegetais', 2);
    for (const v of vegetais) {
      alimentos.push({ alimento: v, quantidade: 1 });
      calAtual += v.calorias;
    }
  } else if (['lanche_manha', 'lanche_tarde'].includes(tipo)) {
    const frutas = selecionarAlimentos('Frutas', 1);
    if (frutas.length) {
      alimentos.push({ alimento: frutas[0], quantidade: 1 });
      calAtual += frutas[0].calorias;
    }
  }

  // Calcular totais
  const caloriasTotal = alimentos.reduce((t, a) => t + a.alimento.calorias * a.quantidade, 0);
  const proteinaTotal = alimentos.reduce((t, a) => t + a.alimento.proteina * a.quantidade, 0);
  const carboidratoTotal = alimentos.reduce((t, a) => t + a.alimento.carboidrato * a.quantidade, 0);
  const gorduraTotal = alimentos.reduce((t, a) => t + a.alimento.gordura * a.quantidade, 0);

  return {
    tipo,
    titulo,
    alimentos,
    caloriasTotal: Math.round(caloriasTotal),
    proteinaTotal: Math.round(proteinaTotal),
    carboidratoTotal: Math.round(carboidratoTotal),
    gorduraTotal: Math.round(gorduraTotal),
  };
}

// ==================== GERADOR PRINCIPAL ====================

export function gerarPlanoDieta(user: UserProfile): PlanoDieta {
  const idade = Math.floor((Date.now() - new Date(user.dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const objetivo = user.objetivos[0] || 'saude_geral';

  // Calcular necessidades calóricas
  const tmb = calcularTMB(user.peso, user.altura, idade, user.sexo);
  const nivelAtividade = user.diasDisponiveis.length >= 5 ? 'intenso' :
    user.diasDisponiveis.length >= 3 ? 'moderado' : 'leve';
  const get = calcularGET(tmb, nivelAtividade);
  const caloriasAlvo = ajustarCaloriasPorObjetivo(get, objetivo);

  // Distribuir macros
  const macros = distribuirMacros(caloriasAlvo, objetivo, user.peso);

  // Distribuir calorias por refeição
  const distribuicao = {
    cafe_manha: 0.25,
    lanche_manha: 0.10,
    almoco: 0.30,
    lanche_tarde: 0.10,
    jantar: 0.20,
    ceia: 0.05,
  };

  const refeicoes: Refeicao[] = [
    gerarRefeicao('cafe_manha', 'Café da Manhã', caloriasAlvo * distribuicao.cafe_manha, macros.proteina * distribuicao.cafe_manha),
    gerarRefeicao('lanche_manha', 'Lanche da Manhã', caloriasAlvo * distribuicao.lanche_manha, macros.proteina * distribuicao.lanche_manha),
    gerarRefeicao('almoco', 'Almoço', caloriasAlvo * distribuicao.almoco, macros.proteina * distribuicao.almoco),
    gerarRefeicao('lanche_tarde', 'Lanche da Tarde', caloriasAlvo * distribuicao.lanche_tarde, macros.proteina * distribuicao.lanche_tarde),
    gerarRefeicao('jantar', 'Jantar', caloriasAlvo * distribuicao.jantar, macros.proteina * distribuicao.jantar),
    gerarRefeicao('ceia', 'Ceia', caloriasAlvo * distribuicao.ceia, macros.proteina * distribuicao.ceia),
  ];

  // Gerar lista de compras
  const alimentosUnicos = new Set<string>();
  refeicoes.forEach(r => r.alimentos.forEach(a => alimentosUnicos.add(a.alimento.nome)));

  return {
    id: `dieta_${Date.now()}`,
    caloriasAlvo,
    proteinaAlvo: macros.proteina,
    carboidratoAlvo: macros.carboidrato,
    gorduraAlvo: macros.gordura,
    refeicoes,
    listCompras: Array.from(alimentosUnicos),
    createdAt: new Date().toISOString(),
  };
}

// Resumo nutricional
export function calcularResumoNutricional(plano: PlanoDieta) {
  const totalCalorias = plano.refeicoes.reduce((t, r) => t + r.caloriasTotal, 0);
  const totalProteina = plano.refeicoes.reduce((t, r) => t + r.proteinaTotal, 0);
  const totalCarb = plano.refeicoes.reduce((t, r) => t + r.carboidratoTotal, 0);
  const totalGordura = plano.refeicoes.reduce((t, r) => t + r.gorduraTotal, 0);

  return {
    calorias: { atual: totalCalorias, alvo: plano.caloriasAlvo, pct: Math.round((totalCalorias / plano.caloriasAlvo) * 100) },
    proteina: { atual: totalProteina, alvo: plano.proteinaAlvo, pct: Math.round((totalProteina / plano.proteinaAlvo) * 100) },
    carboidrato: { atual: totalCarb, alvo: plano.carboidratoAlvo, pct: Math.round((totalCarb / plano.carboidratoAlvo) * 100) },
    gordura: { atual: totalGordura, alvo: plano.gorduraAlvo, pct: Math.round((totalGordura / plano.gorduraAlvo) * 100) },
  };
}
