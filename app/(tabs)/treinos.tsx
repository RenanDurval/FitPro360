import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Glass, Shadow } from '../../constants/theme';
import { MODALIDADES } from '../../data/exercicios';
import { getUserProfile, saveProgramaTreino, getProgramasTreino, setTreinoAtivo } from '../../services/storage';
import { gerarProgramaTreino, gerarTreinoRapido } from '../../services/treinoGenerator';
import { ProgramaTreino, TreinoDia, UserProfile } from '../../types';

const { width } = Dimensions.get('window');

export default function TreinosScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [programas, setProgramas] = useState<ProgramaTreino[]>([]);
  const [programaSelecionado, setProgramaSelecionado] = useState<ProgramaTreino | null>(null);
  const [gerandoTreino, setGerandoTreino] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const profile = await getUserProfile();
    setUser(profile);
    const progs = await getProgramasTreino();
    setProgramas(progs);
    if (progs.length > 0) setProgramaSelecionado(progs[progs.length - 1]);
  }

  async function handleGerarTreino() {
    if (!user) {
      Alert.alert('Perfil incompleto', 'Complete seu perfil primeiro para gerar um treino personalizado.');
      return;
    }
    setGerandoTreino(true);
    try {
      const programa = gerarProgramaTreino(user);
      await saveProgramaTreino(programa);
      await setTreinoAtivo(programa.id);
      setProgramas(prev => [...prev, programa]);
      setProgramaSelecionado(programa);
      Alert.alert('✅ Treino Gerado!', `${programa.nome}\n${programa.diasPorSemana}x por semana • ${programa.duracaoSemanas} semanas`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o treino.');
    }
    setGerandoTreino(false);
  }

  function renderTreinoDia(treino: TreinoDia, index: number) {
    const cores = ['#00D4AA', '#FF6B35', '#74B9FF', '#A29BFE', '#E94560', '#FDCB6E', '#55EFC4'];
    const cor = cores[index % cores.length];

    return (
      <View key={index} style={styles.diaTreino}>
        <View style={styles.diaHeader}>
          <View style={[styles.diaIndicator, { backgroundColor: cor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.diaTitulo}>{treino.titulo}</Text>
            <Text style={styles.diaSubtitulo}>
              {treino.dia.charAt(0).toUpperCase() + treino.dia.slice(1)} • {treino.exercicios.length} exercícios
            </Text>
          </View>
          <View style={styles.diaStats}>
            <Text style={[styles.diaDuracao, { color: cor }]}>{treino.duracaoEstimada}min</Text>
            <Text style={styles.diaCalorias}>🔥 {treino.caloriasEstimadas} kcal</Text>
          </View>
        </View>
        {treino.exercicios.map((se, j) => (
          <View key={j} style={styles.exercicioRow}>
            <Text style={styles.exercicioNum}>{j + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.exercicioNome}>{se.exercicio.nome}</Text>
              <Text style={styles.exercicioEquip}>{se.exercicio.equipamento}</Text>
            </View>
            <View style={styles.seriesCol}>
              <Text style={styles.seriesText}>{se.series}x{se.repeticoes}</Text>
              <Text style={styles.descansoText}>{se.descanso}s rest</Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ width: '100%', maxWidth: 800, alignSelf: 'center', flexGrow: 1 }}
    >
      {/* Header */}
      <LinearGradient
        colors={['rgba(255,107,53,0.2)', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Meus Treinos</Text>
        <Text style={styles.headerSubtitle}>
          {programas.length} programa{programas.length !== 1 ? 's' : ''} gerado{programas.length !== 1 ? 's' : ''}
        </Text>
      </LinearGradient>

      {/* Gerar Treino Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.gerarBtn, gerandoTreino && styles.gerarBtnDisabled]}
          onPress={handleGerarTreino}
          disabled={gerandoTreino}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.gerarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#000" />
            <Text style={styles.gerarText}>
              {gerandoTreino ? 'Gerando...' : 'Gerar Novo Programa de Treino'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Treino Rápido */}
        <TouchableOpacity style={styles.quickTreinoBtn}>
          <Ionicons name="timer-outline" size={20} color={Colors.accent} />
          <Text style={styles.quickTreinoText}>Treino Rápido (20 min, sem equipamento)</Text>
        </TouchableOpacity>
      </View>

      {/* Modalidades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modalidades</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalidadesScroll}>
          {MODALIDADES.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={[styles.modalidadeCard, { borderColor: mod.cor + '40' }]}
            >
              <View style={[styles.modalidadeIcon, { backgroundColor: mod.cor + '20' }]}>
                <MaterialCommunityIcons
                  name={mod.id === 'musculacao' ? 'dumbbell' : mod.id === 'corrida' ? 'run-fast' : mod.id === 'ciclismo' ? 'bike' : mod.id === 'natacao' ? 'swim' : mod.id === 'yoga' ? 'meditation' : 'flash'}
                  size={24}
                  color={mod.cor}
                />
              </View>
              <Text style={styles.modalidadeNome}>{mod.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Programa Atual */}
      {programaSelecionado && (
        <View style={styles.section}>
          <View style={styles.programaHeader}>
            <Text style={styles.sectionTitle}>📋 Programa Atual</Text>
            <View style={styles.programaBadge}>
              <Text style={styles.programaBadgeText}>
                {programaSelecionado.diasPorSemana}x/semana • {programaSelecionado.duracaoSemanas} sem
              </Text>
            </View>
          </View>

          <View style={styles.programaInfo}>
            <Text style={styles.programaNome}>{programaSelecionado.nome}</Text>
            <Text style={styles.programaObj}>
              Objetivo: {programaSelecionado.objetivo.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          {programaSelecionado.treinos.map((treino, i) => renderTreinoDia(treino, i))}
        </View>
      )}

      {programas.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="dumbbell" size={64} color={Colors.dark.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum treino gerado</Text>
          <Text style={styles.emptyDesc}>
            Toque em "Gerar Novo Programa" para criar um treino personalizado baseado no seu perfil.
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: FontSize.md, color: Colors.dark.textSecondary, marginTop: 4 },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginBottom: Spacing.md },

  // Gerar Button
  gerarBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.md },
  gerarBtnDisabled: { opacity: 0.5 },
  gerarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  gerarText: { fontSize: FontSize.lg, fontWeight: '700', color: '#000' },

  quickTreinoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    borderRadius: BorderRadius.lg,
  },
  quickTreinoText: { fontSize: FontSize.md, color: Colors.accent },

  // Modalidades
  modalidadesScroll: { marginLeft: -4 },
  modalidadeCard: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Glass.light,
    width: 90,
  },
  modalidadeIcon: {
    width: 48, height: 48,
    borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 6,
  },
  modalidadeNome: { fontSize: FontSize.xs, color: '#FFF', fontWeight: '500', textAlign: 'center' },

  // Programa
  programaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programaBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  programaBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  programaInfo: { marginBottom: Spacing.md },
  programaNome: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF' },
  programaObj: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 4 },

  // Dia Treino
  diaTreino: {
    ...Glass.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  diaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 10,
  },
  diaIndicator: { width: 4, height: 40, borderRadius: 2 },
  diaTitulo: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF' },
  diaSubtitulo: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  diaStats: { alignItems: 'flex-end' },
  diaDuracao: { fontSize: FontSize.lg, fontWeight: '700' },
  diaCalorias: { fontSize: FontSize.xs, color: Colors.dark.textSecondary },

  exercicioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  exercicioNum: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.card,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: FontSize.xs,
    color: Colors.dark.textSecondary,
    fontWeight: '600',
    overflow: 'hidden',
  },
  exercicioNome: { fontSize: FontSize.md, color: '#FFF', fontWeight: '500' },
  exercicioEquip: { fontSize: FontSize.xs, color: Colors.dark.textMuted, marginTop: 2 },
  seriesCol: { alignItems: 'flex-end' },
  seriesText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
  descansoText: { fontSize: FontSize.xs, color: Colors.dark.textMuted },

  // Empty
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.textMuted, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.dark.textMuted, textAlign: 'center', marginTop: 8 },
});
