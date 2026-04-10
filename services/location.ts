// ============================================
// FitPro360 - Location & GPS Service
// ============================================
import { Local, GPSPoint, AtividadeGPS } from '../types';

// Dados mock de locais (em produção: Google Places API)
export const LOCAIS_MOCK: Local[] = [
  { id: 'l001', nome: 'SmartFit - Centro', tipo: 'academia', endereco: 'Av. Paulista, 1000', latitude: -23.5505, longitude: -46.6333, avaliacao: 4.3, telefone: '(11) 3000-0001', horarioFuncionamento: '6h - 23h' },
  { id: 'l002', nome: 'BlueFit - Shopping', tipo: 'academia', endereco: 'Rua Augusta, 2320', latitude: -23.5585, longitude: -46.6600, avaliacao: 4.1, telefone: '(11) 3000-0002', horarioFuncionamento: '6h - 22h' },
  { id: 'l003', nome: 'Parque Ibirapuera', tipo: 'parque', endereco: 'Av. Pedro Álvares Cabral', latitude: -23.5874, longitude: -46.6576, avaliacao: 4.8, horarioFuncionamento: '5h - 0h' },
  { id: 'l004', nome: 'Pista de Corrida USP', tipo: 'pista', endereco: 'CEPEUSP - Cidade Universitária', latitude: -23.5613, longitude: -46.7138, avaliacao: 4.5, horarioFuncionamento: '6h - 22h' },
  { id: 'l005', nome: 'Quadras do SESC', tipo: 'quadra', endereco: 'Rua Pinheiros, 1200', latitude: -23.5645, longitude: -46.6918, avaliacao: 4.4, telefone: '(11) 3000-0005', horarioFuncionamento: '9h - 21h' },
  { id: 'l006', nome: 'Piscina Municipal', tipo: 'piscina', endereco: 'Rua das Piscinas, 50', latitude: -23.5445, longitude: -46.6400, avaliacao: 3.9, horarioFuncionamento: '6h - 20h' },
  { id: 'l007', nome: 'Mercado Central', tipo: 'mercado', endereco: 'Rua Cantareira, 306', latitude: -23.5411, longitude: -46.6338, avaliacao: 4.6, horarioFuncionamento: '6h - 18h' },
  { id: 'l008', nome: 'Feira Orgânica - Praça República', tipo: 'feira', endereco: 'Praça da República', latitude: -23.5432, longitude: -46.6422, avaliacao: 4.4, horarioFuncionamento: 'Sáb 7h - 13h' },
  { id: 'l009', nome: 'Natue - Suplementos', tipo: 'loja_suplementos', endereco: 'Rua Oscar Freire, 800', latitude: -23.5622, longitude: -46.6717, avaliacao: 4.2, telefone: '(11) 3000-0009', horarioFuncionamento: '9h - 20h' },
  { id: 'l010', nome: 'Supermercado Natural Life', tipo: 'mercado', endereco: 'Av. Rebouças, 1500', latitude: -23.5592, longitude: -46.6770, avaliacao: 4.3, horarioFuncionamento: '7h - 22h' },
];

// Calcular distância entre dois pontos (Haversine)
export function calcularDistancia(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Buscar locais próximos por tipo
export function buscarLocaisProximos(
  latitude: number,
  longitude: number,
  tipo?: Local['tipo'],
  raioKm: number = 10
): Local[] {
  let locais = LOCAIS_MOCK.map(local => ({
    ...local,
    distancia: calcularDistancia(latitude, longitude, local.latitude, local.longitude),
  }));

  if (tipo) {
    locais = locais.filter(l => l.tipo === tipo);
  }

  return locais
    .filter(l => (l.distancia || 0) <= raioKm)
    .sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
}

// Calcular métricas de atividade GPS
export function calcularMetricasAtividade(pontos: GPSPoint[]): Partial<AtividadeGPS> {
  if (pontos.length < 2) return { distanciaTotal: 0, tempoTotal: 0, velocidadeMedia: 0 };

  let distanciaTotal = 0;
  for (let i = 1; i < pontos.length; i++) {
    distanciaTotal += calcularDistancia(
      pontos[i - 1].latitude, pontos[i - 1].longitude,
      pontos[i].latitude, pontos[i].longitude
    );
  }

  const tempoTotal = (pontos[pontos.length - 1].timestamp - pontos[0].timestamp) / 1000 / 60; // minutos
  const velocidadeMedia = tempoTotal > 0 ? (distanciaTotal / tempoTotal) * 60 : 0; // km/h

  return {
    distanciaTotal: Math.round(distanciaTotal * 100) / 100,
    tempoTotal: Math.round(tempoTotal),
    velocidadeMedia: Math.round(velocidadeMedia * 10) / 10,
  };
}

// Calcular pace (min/km) para corrida
export function calcularPace(distanciaKm: number, tempoMinutos: number): string {
  if (distanciaKm === 0) return '--:--';
  const paceMin = tempoMinutos / distanciaKm;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Estimar calorias queimadas por atividade GPS
export function estimarCaloriasGPS(
  distanciaKm: number,
  tempoMinutos: number,
  pesoKg: number,
  modalidade: string
): number {
  // MET values por modalidade
  const metValues: Record<string, number> = {
    corrida: 9.8,
    caminhada: 3.5,
    ciclismo: 7.5,
    natacao: 8.0,
    trilha: 6.0,
  };
  const met = metValues[modalidade] || 5.0;
  return Math.round(met * pesoKg * (tempoMinutos / 60));
}
