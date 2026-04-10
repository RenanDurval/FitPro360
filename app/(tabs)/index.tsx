import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass, Shadow } from '../../constants/theme';
import { getUserProfile } from '../../services/storage';
import { getSimulatedSensorData } from '../../services/sensors';
import { UserProfile, SensorData, ProgramaTreino } from '../../types';
import { getProgramasTreino } from '../../services/storage';

const { width } = Dimensions.get('window');

// Componente Card Glassmorphism
function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.glassCard, style]}>
      {children}
    </View>
  );
}

// Componente de Progresso Circular
function ProgressRing({ value, max, size = 80, color = Colors.primary, label, unit }: any) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.progressRing, { width: size, height: size, borderColor: Colors.dark.border }]}>
        <View style={[styles.progressFill, {
          width: size - 8, height: size - 8, borderColor: color,
          borderLeftColor: 'transparent',
          borderBottomColor: pct > 50 ? color : 'transparent',
          transform: [{ rotate: `${Math.min(pct * 3.6, 360)}deg` }],
        }]} />
        <Text style={styles.progressValue}>{value}</Text>
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
      {unit && <Text style={styles.progressUnit}>{unit}</Text>}
    </View>
  );
}

export default function DashboardScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [treinos, setTreinos] = useState<ProgramaTreino[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const profile = await getUserProfile();
    setUser(profile);
    setSensorData(getSimulatedSensorData());
    setTreinos(await getProgramasTreino());

    if (!profile) {
      router.replace('/onboarding');
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const treinoDoDia = treinos.length > 0 ? treinos[treinos.length - 1] : null;
  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const diaHoje = dias[new Date().getDay()];
  const treinoHoje = treinoDoDia?.treinos.find(t => t.dia === diaHoje);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com Gradiente */}
      <LinearGradient
        colors={['#00D4AA', '#0F3460', '#0A0A1A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()}, 💪</Text>
            <Text style={styles.userName}>{user?.nome || 'Atleta'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => router.push('/dispositivos')}
          >
            <Ionicons name="bluetooth" size={22} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        {/* Métricas do Dia */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Ionicons name="footsteps" size={20} color="#55EFC4" />
            <Text style={styles.metricValue}>{sensorData?.passos?.toLocaleString() || '0'}</Text>
            <Text style={styles.metricLabel}>passos</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Ionicons name="flame" size={20} color="#FF6B35" />
            <Text style={styles.metricValue}>{sensorData?.caloriasQueimadas || '0'}</Text>
            <Text style={styles.metricLabel}>kcal</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Ionicons name="location" size={20} color="#74B9FF" />
            <Text style={styles.metricValue}>{sensorData?.distancia?.toFixed(1) || '0'}</Text>
            <Text style={styles.metricLabel}>km</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Ionicons name="heart" size={20} color="#E94560" />
            <Text style={styles.metricValue}>{sensorData?.frequenciaCardiaca || '--'}</Text>
            <Text style={styles.metricLabel}>bpm</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Treino do Dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏋️ Treino de Hoje</Text>
        {treinoHoje ? (
          <TouchableOpacity onPress={() => router.push('/treino-detalhe')}>
            <GlassCard>
              <LinearGradient
                colors={['rgba(0,212,170,0.15)', 'rgba(0,212,170,0.05)']}
                style={styles.treinoCard}
              >
                <View style={styles.treinoHeader}>
                  <View>
                    <Text style={styles.treinoTitulo}>{treinoHoje.titulo}</Text>
                    <Text style={styles.treinoInfo}>
                      {treinoHoje.exercicios.length} exercícios • {treinoHoje.duracaoEstimada} min
                    </Text>
                  </View>
                  <View style={styles.caloriaBadge}>
                    <Ionicons name="flame" size={14} color="#FF6B35" />
                    <Text style={styles.caloriaText}>{treinoHoje.caloriasEstimadas} kcal</Text>
                  </View>
                </View>
                <View style={styles.exerciciosList}>
                  {treinoHoje.exercicios.slice(0, 4).map((se, i) => (
                    <View key={i} style={styles.exercicioItem}>
                      <View style={styles.exercicioDot} />
                      <Text style={styles.exercicioNome}>{se.exercicio.nome}</Text>
                      <Text style={styles.exercicioSeries}>{se.series}x{se.repeticoes}</Text>
                    </View>
                  ))}
                  {treinoHoje.exercicios.length > 4 && (
                    <Text style={styles.maisExercicios}>
                      + {treinoHoje.exercicios.length - 4} mais exercícios
                    </Text>
                  )}
                </View>
                <View style={styles.iniciarBtn}>
                  <Text style={styles.iniciarText}>INICIAR TREINO</Text>
                  <Ionicons name="play-circle" size={24} color={Colors.primary} />
                </View>
              </LinearGradient>
            </GlassCard>
          </TouchableOpacity>
        ) : (
          <GlassCard>
            <View style={styles.emptyTreino}>
              <MaterialCommunityIcons name="dumbbell" size={48} color={Colors.dark.textMuted} />
              <Text style={styles.emptyText}>Nenhum treino gerado ainda</Text>
              <TouchableOpacity
                style={styles.gerarBtn}
                onPress={() => router.push('/(tabs)/treinos')}
              >
                <Text style={styles.gerarBtnText}>Gerar Programa de Treino</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Acesso Rápido</Text>
        <View style={styles.quickActions}>
          {[
            { icon: 'person-outline', label: 'Profissionais', color: '#A29BFE', route: '/profissionais' },
            { icon: 'bluetooth', label: 'Dispositivos', color: '#74B9FF', route: '/dispositivos' },
            { icon: 'map-outline', label: 'Locais', color: '#55EFC4', route: '/(tabs)/mapa' },
            { icon: 'nutrition-outline', label: 'Dieta', color: '#FDCB6E', route: '/(tabs)/nutricao' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickAction}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Progresso Semanal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Progresso Semanal</Text>
        <GlassCard>
          <View style={styles.weekProgress}>
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
              const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
              const isDone = i < new Date().getDay() && Math.random() > 0.3;
              return (
                <View key={i} style={styles.dayColumn}>
                  <View style={[
                    styles.dayIndicator,
                    isDone && styles.dayDone,
                    isToday && styles.dayToday,
                  ]}>
                    {isDone && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </View>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{d}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>
      </View>

      {/* Tempo Ativo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ Atividade do Dia</Text>
        <GlassCard>
          <View style={styles.activityRow}>
            <View style={styles.activityItem}>
              <Ionicons name="time-outline" size={28} color={Colors.primary} />
              <Text style={styles.activityValue}>{sensorData?.tempoAtivo || 0} min</Text>
              <Text style={styles.activityLabel}>Tempo Ativo</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="trending-up" size={28} color="#FF6B35" />
              <Text style={styles.activityValue}>{sensorData?.frequenciaCardiaca || '--'} bpm</Text>
              <Text style={styles.activityLabel}>FC Média</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="water-outline" size={28} color="#74B9FF" />
              <Text style={styles.activityValue}>2.1 L</Text>
              <Text style={styles.activityLabel}>Água</Text>
            </View>
          </View>
        </GlassCard>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content: { paddingBottom: 20 },

  // Header
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: FontSize.xxl, fontWeight: '700', color: '#FFF' },
  notifButton: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Métricas
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metricItem: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF', marginTop: 4 },
  metricLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  metricDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Glass Card
  glassCard: {
    ...Glass.light,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },

  // Treino do Dia
  treinoCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  treinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  treinoTitulo: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF' },
  treinoInfo: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 4 },
  caloriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  caloriaText: { fontSize: FontSize.sm, color: '#FF6B35', fontWeight: '600' },
  exerciciosList: { gap: 8, marginBottom: Spacing.md },
  exercicioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exercicioDot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  exercicioNome: { flex: 1, fontSize: FontSize.md, color: Colors.dark.textSecondary },
  exercicioSeries: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  maisExercicios: { fontSize: FontSize.sm, color: Colors.primary, marginTop: 4 },
  iniciarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  iniciarText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },

  // Empty Treino
  emptyTreino: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.dark.textMuted },
  gerarBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginTop: Spacing.sm,
  },
  gerarBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.dark.surface },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  quickAction: { alignItems: 'center', flex: 1 },
  quickIconWrap: {
    width: 56, height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickLabel: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, fontWeight: '500' },

  // Week Progress
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.md,
  },
  dayColumn: { alignItems: 'center', gap: 6 },
  dayIndicator: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.card,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayToday: { borderColor: Colors.accent, borderWidth: 2 },
  dayLabel: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  dayLabelToday: { color: Colors.accent, fontWeight: '700' },

  // Activity
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
  },
  activityItem: { alignItems: 'center', gap: 6 },
  activityValue: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF' },
  activityLabel: { fontSize: FontSize.xs, color: Colors.dark.textSecondary },

  // Progress Ring
  progressRing: {
    borderRadius: 999,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 4,
  },
  progressValue: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF' },
  progressLabel: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 4 },
  progressUnit: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
});
