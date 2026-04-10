// ============================================
// FitPro360 - Sensor Service
// ============================================
import { SensorData } from '../types';

// Dados simulados para desenvolvimento
// Em produção: expo-sensors (Pedometer, Accelerometer)
let stepCount = 0;
let caloriesBurned = 0;
let activeMinutes = 0;
let isTracking = false;

// Simular dados de sensores
export function getSimulatedSensorData(): SensorData {
  // Gerar dados realistas para o dia
  const hora = new Date().getHours();
  const progressoDia = hora / 24;

  return {
    passos: Math.round(8000 * progressoDia + Math.random() * 500),
    distancia: Math.round((6.0 * progressoDia + Math.random() * 0.5) * 100) / 100,
    caloriasQueimadas: Math.round(2200 * progressoDia + Math.random() * 100),
    frequenciaCardiaca: Math.round(65 + Math.random() * 25),
    velocidadeMedia: 0,
    tempoAtivo: Math.round(60 * progressoDia + Math.random() * 10),
    timestamp: new Date().toISOString(),
  };
}

// Iniciar tracking de sensores
export function startSensorTracking(): void {
  isTracking = true;
  stepCount = 0;
  caloriesBurned = 0;
  activeMinutes = 0;
}

// Parar tracking
export function stopSensorTracking(): SensorData {
  isTracking = false;
  return {
    passos: stepCount,
    distancia: stepCount * 0.0007, // ~0.7m por passo
    caloriasQueimadas: caloriesBurned,
    tempoAtivo: activeMinutes,
    timestamp: new Date().toISOString(),
  };
}

// Verificar se está tracking
export function isSensorTracking(): boolean {
  return isTracking;
}

// Calcular calorias por frequência cardíaca (fórmula simplificada)
export function calcularCaloriasFC(
  fc: number,
  pesoKg: number,
  idade: number,
  sexo: string,
  duracaoMin: number
): number {
  if (sexo === 'masculino') {
    return Math.round(
      ((-55.0969 + 0.6309 * fc + 0.1988 * pesoKg + 0.2017 * idade) / 4.184) * duracaoMin
    );
  } else {
    return Math.round(
      ((-20.4022 + 0.4472 * fc - 0.1263 * pesoKg + 0.074 * idade) / 4.184) * duracaoMin
    );
  }
}

// Classificar intensidade por FC
export function classificarIntensidade(fc: number, idade: number): { nivel: string; cor: string } {
  const fcMax = 220 - idade;
  const pct = (fc / fcMax) * 100;

  if (pct < 50) return { nivel: 'Muito Leve', cor: '#74B9FF' };
  if (pct < 60) return { nivel: 'Leve', cor: '#55EFC4' };
  if (pct < 70) return { nivel: 'Moderado', cor: '#00D4AA' };
  if (pct < 80) return { nivel: 'Vigoroso', cor: '#FDCB6E' };
  if (pct < 90) return { nivel: 'Intenso', cor: '#FF6B35' };
  return { nivel: 'Máximo', cor: '#E94560' };
}
