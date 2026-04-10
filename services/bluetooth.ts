// ============================================
// FitPro360 - Bluetooth BLE Service
// ============================================
import { DispositivoBLE, DadosDispositivo } from '../types';

// Dados simulados para desenvolvimento
// Em produção: react-native-ble-plx

const dispositivosMock: DispositivoBLE[] = [
  { id: 'ble001', nome: 'Galaxy Watch 5', tipo: 'relogio', conectado: false, bateria: 78, ultimaSincronizacao: '2024-01-15T10:30:00' },
  { id: 'ble002', nome: 'Mi Band 8', tipo: 'relogio', conectado: false, bateria: 92, ultimaSincronizacao: '2024-01-15T08:00:00' },
  { id: 'ble003', nome: 'Xiaomi Scale 2', tipo: 'balanca', conectado: false, bateria: 100 },
  { id: 'ble004', nome: 'Polar H10', tipo: 'monitor_cardiaco', conectado: false, bateria: 65 },
];

let dispositivosConectados: string[] = [];

// Simular scan de dispositivos
export async function scanDispositivos(): Promise<DispositivoBLE[]> {
  // Simular delay de scan
  await new Promise(resolve => setTimeout(resolve, 2000));
  return dispositivosMock.map(d => ({
    ...d,
    conectado: dispositivosConectados.includes(d.id),
  }));
}

// Conectar a um dispositivo
export async function conectarDispositivo(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!dispositivosConectados.includes(id)) {
    dispositivosConectados.push(id);
  }
  return true;
}

// Desconectar dispositivo
export async function desconectarDispositivo(id: string): Promise<void> {
  dispositivosConectados = dispositivosConectados.filter(d => d !== id);
}

// Obter dispositivos conectados
export function getDispositivosConectados(): string[] {
  return dispositivosConectados;
}

// Ler dados do dispositivo (simulado)
export async function lerDadosDispositivo(id: string): Promise<DadosDispositivo> {
  const disp = dispositivosMock.find(d => d.id === id);

  if (disp?.tipo === 'relogio') {
    return {
      frequenciaCardiaca: 65 + Math.round(Math.random() * 30),
      passos: Math.round(Math.random() * 12000),
      calorias: Math.round(Math.random() * 2500),
      sono: {
        duracao: 6 + Math.random() * 3,
        qualidade: Math.round(60 + Math.random() * 40),
      },
      spo2: 95 + Math.round(Math.random() * 4),
    };
  }

  if (disp?.tipo === 'monitor_cardiaco') {
    return {
      frequenciaCardiaca: 60 + Math.round(Math.random() * 40),
    };
  }

  if (disp?.tipo === 'balanca') {
    return {
      calorias: 0, // Balanças não medem isso diretamente
    };
  }

  return {};
}

// Verificar se Bluetooth está disponível (simulado)
export function isBluetoothDisponivel(): boolean {
  return true; // Em produção: verificar estado real do BLE
}

// Formatar nome do tipo de dispositivo
export function formatarTipoDispositivo(tipo: DispositivoBLE['tipo']): string {
  const nomes: Record<string, string> = {
    relogio: '⌚ Relógio',
    balanca: '⚖️ Balança',
    monitor_cardiaco: '❤️ Monitor Cardíaco',
    outro: '📱 Outro',
  };
  return nomes[tipo] || tipo;
}
