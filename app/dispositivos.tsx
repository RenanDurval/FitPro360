import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../constants/theme';
import {
  scanDispositivos, conectarDispositivo, desconectarDispositivo,
  lerDadosDispositivo, formatarTipoDispositivo,
} from '../services/bluetooth';
import { DispositivoBLE, DadosDispositivo } from '../types';

export default function DispositivosScreen() {
  const [dispositivos, setDispositivos] = useState<DispositivoBLE[]>([]);
  const [scanning, setScanning] = useState(false);
  const [dadosDevice, setDadosDevice] = useState<Record<string, DadosDispositivo>>({});

  useEffect(() => {
    handleScan();
  }, []);

  async function handleScan() {
    setScanning(true);
    const result = await scanDispositivos();
    setDispositivos(result);
    setScanning(false);
  }

  async function handleConnect(id: string) {
    const success = await conectarDispositivo(id);
    if (success) {
      const dados = await lerDadosDispositivo(id);
      setDadosDevice(prev => ({ ...prev, [id]: dados }));
      setDispositivos(prev => prev.map(d => d.id === id ? { ...d, conectado: true } : d));
      Alert.alert('✅ Conectado!', 'Dispositivo conectado com sucesso.');
    }
  }

  async function handleDisconnect(id: string) {
    await desconectarDispositivo(id);
    setDispositivos(prev => prev.map(d => d.id === id ? { ...d, conectado: false } : d));
    setDadosDevice(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  const tipoIcons: Record<string, { icon: string; cor: string }> = {
    relogio: { icon: 'watch-outline', cor: '#74B9FF' },
    balanca: { icon: 'scale-outline', cor: '#A29BFE' },
    monitor_cardiaco: { icon: 'heart-outline', cor: '#E94560' },
    outro: { icon: 'hardware-chip-outline', cor: '#FDCB6E' },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispositivos</Text>
        <TouchableOpacity onPress={handleScan} style={styles.scanBtn}>
          {scanning ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="refresh" size={22} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.descricao}>
        Conecte seus dispositivos via Bluetooth para sincronizar dados de saúde automaticamente.
      </Text>

      {/* Status BLE */}
      <View style={styles.bleStatus}>
        <Ionicons name="bluetooth" size={20} color={Colors.primary} />
        <Text style={styles.bleText}>Bluetooth ativado</Text>
        <View style={styles.bleDot} />
      </View>

      {/* Device List */}
      {dispositivos.map((device) => {
        const info = tipoIcons[device.tipo] || tipoIcons.outro;
        const dados = dadosDevice[device.id];

        return (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <View style={[styles.deviceIconWrap, { backgroundColor: info.cor + '20' }]}>
                <Ionicons name={info.icon as any} size={28} color={info.cor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceNome}>{device.nome}</Text>
                <Text style={styles.deviceTipo}>{formatarTipoDispositivo(device.tipo)}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.connectBtn,
                  device.conectado && { backgroundColor: '#E9456020', borderColor: '#E94560' },
                ]}
                onPress={() => device.conectado ? handleDisconnect(device.id) : handleConnect(device.id)}
              >
                <Text style={[
                  styles.connectText,
                  device.conectado && { color: '#E94560' },
                ]}>
                  {device.conectado ? 'Desconectar' : 'Conectar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Device Meta */}
            <View style={styles.deviceMeta}>
              {device.bateria !== undefined && (
                <View style={styles.metaItem}>
                  <Ionicons name="battery-half" size={14} color={device.bateria > 20 ? '#55EFC4' : '#E94560'} />
                  <Text style={styles.metaText}>{device.bateria}%</Text>
                </View>
              )}
              {device.conectado && (
                <View style={styles.metaItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#55EFC4' }]} />
                  <Text style={[styles.metaText, { color: '#55EFC4' }]}>Conectado</Text>
                </View>
              )}
            </View>

            {/* Dados do Dispositivo */}
            {device.conectado && dados && (
              <View style={styles.dadosGrid}>
                {dados.frequenciaCardiaca !== undefined && (
                  <View style={styles.dadoItem}>
                    <Ionicons name="heart" size={18} color="#E94560" />
                    <Text style={styles.dadoValue}>{dados.frequenciaCardiaca}</Text>
                    <Text style={styles.dadoLabel}>bpm</Text>
                  </View>
                )}
                {dados.passos !== undefined && (
                  <View style={styles.dadoItem}>
                    <Ionicons name="footsteps" size={18} color="#55EFC4" />
                    <Text style={styles.dadoValue}>{dados.passos?.toLocaleString()}</Text>
                    <Text style={styles.dadoLabel}>passos</Text>
                  </View>
                )}
                {dados.calorias !== undefined && dados.calorias > 0 && (
                  <View style={styles.dadoItem}>
                    <Ionicons name="flame" size={18} color="#FF6B35" />
                    <Text style={styles.dadoValue}>{dados.calorias}</Text>
                    <Text style={styles.dadoLabel}>kcal</Text>
                  </View>
                )}
                {dados.spo2 !== undefined && (
                  <View style={styles.dadoItem}>
                    <Ionicons name="water" size={18} color="#74B9FF" />
                    <Text style={styles.dadoValue}>{dados.spo2}%</Text>
                    <Text style={styles.dadoLabel}>SpO2</Text>
                  </View>
                )}
                {dados.sono && (
                  <View style={styles.dadoItem}>
                    <Ionicons name="moon" size={18} color="#A29BFE" />
                    <Text style={styles.dadoValue}>{dados.sono.duracao.toFixed(1)}h</Text>
                    <Text style={styles.dadoLabel}>Sono ({dados.sono.qualidade}%)</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}

      {scanning && dispositivos.length === 0 && (
        <View style={styles.scanningState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.scanningText}>Buscando dispositivos...</Text>
        </View>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '700', color: '#FFF', marginLeft: 12 },
  scanBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center' },
  descricao: { fontSize: FontSize.md, color: Colors.dark.textSecondary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },

  // BLE Status
  bleStatus: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    padding: Spacing.sm, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '10',
  },
  bleText: { fontSize: FontSize.sm, color: Colors.primary, flex: 1 },
  bleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },

  // Device Card
  deviceCard: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  deviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deviceIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  deviceNome: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF' },
  deviceTipo: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  connectBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary + '20',
    borderWidth: 1, borderColor: Colors.primary,
  },
  connectText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  deviceMeta: { flexDirection: 'row', gap: 16, marginTop: Spacing.sm, paddingLeft: 64 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  statusDot: { width: 6, height: 6, borderRadius: 3 },

  // Dados
  dadosGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    marginTop: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
  },
  dadoItem: { alignItems: 'center', minWidth: 70 },
  dadoValue: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginTop: 4 },
  dadoLabel: { fontSize: FontSize.xs, color: Colors.dark.textMuted },

  // Scanning
  scanningState: { alignItems: 'center', paddingVertical: Spacing.xxl },
  scanningText: { color: Colors.dark.textSecondary, marginTop: Spacing.md },
});
