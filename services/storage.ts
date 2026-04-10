// ============================================
// FitPro360 - Storage Service (AsyncStorage)
// ============================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ProgramaTreino, PlanoDieta, Profissional, SensorData, AtividadeGPS, DispositivoBLE } from '../types';

const KEYS = {
  USER_PROFILE: '@fitpro360_user',
  TREINOS: '@fitpro360_treinos',
  DIETAS: '@fitpro360_dietas',
  PROFISSIONAIS: '@fitpro360_profissionais',
  SENSOR_DATA: '@fitpro360_sensors',
  ATIVIDADES_GPS: '@fitpro360_atividades',
  DISPOSITIVOS_BLE: '@fitpro360_ble',
  ONBOARDING_DONE: '@fitpro360_onboarding',
  TREINO_ATIVO: '@fitpro360_treino_ativo',
};

// ==================== USER PROFILE ====================
export async function saveUserProfile(user: UserProfile): Promise<void> {
  user.updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(user));
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
}

// ==================== TREINOS ====================
export async function saveProgramaTreino(treino: ProgramaTreino): Promise<void> {
  const treinos = await getProgramasTreino();
  treinos.push(treino);
  await AsyncStorage.setItem(KEYS.TREINOS, JSON.stringify(treinos));
}

export async function getProgramasTreino(): Promise<ProgramaTreino[]> {
  const data = await AsyncStorage.getItem(KEYS.TREINOS);
  return data ? JSON.parse(data) : [];
}

export async function setTreinoAtivo(treinoId: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.TREINO_ATIVO, treinoId);
}

export async function getTreinoAtivo(): Promise<string | null> {
  return await AsyncStorage.getItem(KEYS.TREINO_ATIVO);
}

// ==================== DIETAS ====================
export async function savePlanoDieta(dieta: PlanoDieta): Promise<void> {
  await AsyncStorage.setItem(KEYS.DIETAS, JSON.stringify(dieta));
}

export async function getPlanoDieta(): Promise<PlanoDieta | null> {
  const data = await AsyncStorage.getItem(KEYS.DIETAS);
  return data ? JSON.parse(data) : null;
}

// ==================== PROFISSIONAIS ====================
export async function saveProfissional(prof: Profissional): Promise<void> {
  const profs = await getProfissionais();
  const idx = profs.findIndex(p => p.id === prof.id);
  if (idx >= 0) profs[idx] = prof;
  else profs.push(prof);
  await AsyncStorage.setItem(KEYS.PROFISSIONAIS, JSON.stringify(profs));
}

export async function getProfissionais(): Promise<Profissional[]> {
  const data = await AsyncStorage.getItem(KEYS.PROFISSIONAIS);
  return data ? JSON.parse(data) : [];
}

export async function removeProfissional(id: string): Promise<void> {
  const profs = await getProfissionais();
  await AsyncStorage.setItem(KEYS.PROFISSIONAIS, JSON.stringify(profs.filter(p => p.id !== id)));
}

// ==================== SENSOR DATA ====================
export async function saveSensorData(data: SensorData): Promise<void> {
  const historico = await getSensorHistory();
  historico.push(data);
  // Manter apenas últimos 30 dias
  const limite = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filtrado = historico.filter(h => new Date(h.timestamp).getTime() > limite);
  await AsyncStorage.setItem(KEYS.SENSOR_DATA, JSON.stringify(filtrado));
}

export async function getSensorHistory(): Promise<SensorData[]> {
  const data = await AsyncStorage.getItem(KEYS.SENSOR_DATA);
  return data ? JSON.parse(data) : [];
}

export async function getSensorDataHoje(): Promise<SensorData | null> {
  const historico = await getSensorHistory();
  const hoje = new Date().toISOString().split('T')[0];
  return historico.find(h => h.timestamp.startsWith(hoje)) || null;
}

// ==================== ATIVIDADES GPS ====================
export async function saveAtividadeGPS(atividade: AtividadeGPS): Promise<void> {
  const atividades = await getAtividadesGPS();
  atividades.push(atividade);
  await AsyncStorage.setItem(KEYS.ATIVIDADES_GPS, JSON.stringify(atividades));
}

export async function getAtividadesGPS(): Promise<AtividadeGPS[]> {
  const data = await AsyncStorage.getItem(KEYS.ATIVIDADES_GPS);
  return data ? JSON.parse(data) : [];
}

// ==================== ONBOARDING ====================
export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return val === 'true';
}

// ==================== RESET (DEBUG) ====================
export async function resetAllData(): Promise<void> {
  const keys = Object.values(KEYS);
  await AsyncStorage.multiRemove(keys);
}
