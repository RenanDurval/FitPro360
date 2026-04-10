import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../constants/theme';
import { getProgramasTreino } from '../services/storage';
import { ProgramaTreino, TreinoDia } from '../types';

export default function TreinoDetalheScreen() {
  const [treino, setTreino] = useState<TreinoDia | null>(null);
  const [programa, setPrograma] = useState<ProgramaTreino | null>(null);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [emExecucao, setEmExecucao] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    loadTreino();
  }, []);

  useEffect(() => {
    let interval: any;
    if (emExecucao) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emExecucao]);

  async function loadTreino() {
    const programas = await getProgramasTreino();
    if (programas.length > 0) {
      const prog = programas[programas.length - 1];
      setPrograma(prog);
      const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      const hoje = dias[new Date().getDay()];
      const treinoHoje = prog.treinos.find(t => t.dia === hoje) || prog.treinos[0];
      setTreino(treinoHoje);
    }
  }

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!treino) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFF', fontSize: FontSize.lg }}>Nenhum treino disponível</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const exercicioAtualObj = treino.exercicios[exercicioAtual];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(0,212,170,0.3)', 'transparent']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{treino.titulo}</Text>
          <Text style={styles.headerSubtitle}>
            {treino.exercicios.length} exercícios • {treino.duracaoEstimada} min
          </Text>
        </View>
        <View style={styles.timerWrap}>
          <Text style={styles.timerText}>{formatTimer(timer)}</Text>
        </View>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((exercicioAtual + 1) / treino.exercicios.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {exercicioAtual + 1}/{treino.exercicios.length}
        </Text>
      </View>

      {/* Exercício Atual */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {exercicioAtualObj && (
          <View style={styles.currentExercise}>
            <View style={styles.exerciseIconWrap}>
              <Ionicons name="barbell" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.exerciseName}>{exercicioAtualObj.exercicio.nome}</Text>
            <Text style={styles.exerciseGroup}>
              {exercicioAtualObj.exercicio.grupoMuscular.toUpperCase()} • {exercicioAtualObj.exercicio.equipamento}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{exercicioAtualObj.series}</Text>
                <Text style={styles.statBoxLabel}>Séries</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{exercicioAtualObj.repeticoes}</Text>
                <Text style={styles.statBoxLabel}>Reps</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{exercicioAtualObj.descanso}s</Text>
                <Text style={styles.statBoxLabel}>Descanso</Text>
              </View>
            </View>

            <View style={styles.instrucoes}>
              <Text style={styles.instrucoesTitle}>📝 Como executar:</Text>
              <Text style={styles.instrucoesText}>{exercicioAtualObj.exercicio.instrucoes}</Text>
            </View>
          </View>
        )}

        {/* Lista de exercícios */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Todos os exercícios</Text>
          {treino.exercicios.map((se, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.listItem, i === exercicioAtual && styles.listItemActive]}
              onPress={() => setExercicioAtual(i)}
            >
              <View style={[styles.listNum, i === exercicioAtual && styles.listNumActive]}>
                {i < exercicioAtual ? (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                ) : (
                  <Text style={[styles.listNumText, i === exercicioAtual && { color: '#000' }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.listName, i < exercicioAtual && styles.listNameDone]}>
                {se.exercicio.nome}
              </Text>
              <Text style={styles.listSeries}>{se.series}x{se.repeticoes}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.prevBtn}
          disabled={exercicioAtual === 0}
          onPress={() => setExercicioAtual(Math.max(0, exercicioAtual - 1))}
        >
          <Ionicons name="play-back" size={24} color={exercicioAtual === 0 ? Colors.dark.textMuted : '#FFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => {
            if (!emExecucao) setEmExecucao(true);
            else if (exercicioAtual < treino.exercicios.length - 1) setExercicioAtual(exercicioAtual + 1);
            else {
              setEmExecucao(false);
              router.back();
            }
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.mainBtnGradient}
          >
            <Ionicons
              name={!emExecucao ? 'play' : exercicioAtual === treino.exercicios.length - 1 ? 'checkmark' : 'play-forward'}
              size={28}
              color="#000"
            />
            <Text style={styles.mainBtnText}>
              {!emExecucao ? 'INICIAR' : exercicioAtual === treino.exercicios.length - 1 ? 'FINALIZAR' : 'PRÓXIMO'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          disabled={exercicioAtual >= treino.exercicios.length - 1}
          onPress={() => setExercicioAtual(Math.min(treino.exercicios.length - 1, exercicioAtual + 1))}
        >
          <Ionicons name="play-forward" size={24} color={exercicioAtual >= treino.exercicios.length - 1 ? Colors.dark.textMuted : '#FFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg, gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  timerWrap: {
    backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.round,
  },
  timerText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary, fontVariant: ['tabular-nums'] },

  // Progress
  progressWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.dark.border },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  progressText: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, fontWeight: '600' },

  // Current Exercise
  currentExercise: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  exerciseIconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  exerciseName: { fontSize: FontSize.xxl, fontWeight: '700', color: '#FFF', textAlign: 'center' },
  exerciseGroup: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  statBox: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', width: 90,
  },
  statBoxValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary },
  statBoxLabel: { fontSize: FontSize.xs, color: Colors.dark.textMuted },

  instrucoes: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginTop: Spacing.lg, width: '100%',
  },
  instrucoesTitle: { fontSize: FontSize.md, fontWeight: '600', color: '#FFF', marginBottom: 6 },
  instrucoesText: { fontSize: FontSize.md, color: Colors.dark.textSecondary, lineHeight: 22 },

  // List
  listSection: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  listTitle: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginBottom: Spacing.md },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  listItemActive: { backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.sm, paddingHorizontal: 8 },
  listNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.dark.card, justifyContent: 'center', alignItems: 'center',
  },
  listNumActive: { backgroundColor: Colors.primary },
  listNumText: { fontSize: FontSize.xs, color: Colors.dark.textMuted, fontWeight: '600' },
  listName: { flex: 1, fontSize: FontSize.md, color: Colors.dark.textSecondary },
  listNameDone: { textDecorationLine: 'line-through', color: Colors.dark.textMuted },
  listSeries: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  // Bottom Controls
  bottomControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg,
    paddingVertical: Spacing.md, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  prevBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.dark.card, justifyContent: 'center', alignItems: 'center' },
  nextBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.dark.card, justifyContent: 'center', alignItems: 'center' },
  mainBtn: { borderRadius: BorderRadius.round, overflow: 'hidden' },
  mainBtnGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  mainBtnText: { fontSize: FontSize.lg, fontWeight: '700', color: '#000' },
});
