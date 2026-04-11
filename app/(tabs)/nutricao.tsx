import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../../constants/theme';
import { getUserProfile, savePlanoDieta, getPlanoDieta } from '../../services/storage';
import { gerarPlanoDieta, calcularResumoNutricional, calcularTMB, calcularGET } from '../../services/dietaGenerator';
import { PlanoDieta, UserProfile } from '../../types';

export default function NutricaoScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plano, setPlano] = useState<PlanoDieta | null>(null);
  const [showCompras, setShowCompras] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const profile = await getUserProfile();
    setUser(profile);
    const dietaExistente = await getPlanoDieta();
    setPlano(dietaExistente);
  }

  async function handleGerarDieta() {
    if (!user) {
      Alert.alert('Perfil incompleto', 'Complete seu perfil primeiro.');
      return;
    }
    const novaDieta = gerarPlanoDieta(user);
    await savePlanoDieta(novaDieta);
    setPlano(novaDieta);
    Alert.alert('✅ Dieta Gerada!', `Alvo: ${novaDieta.caloriasAlvo} kcal/dia`);
  }

  const resumo = plano ? calcularResumoNutricional(plano) : null;

  const refeicaoIcons: Record<string, string> = {
    cafe_manha: '☕',
    lanche_manha: '🍎',
    almoco: '🍽️',
    lanche_tarde: '🥤',
    jantar: '🌙',
    ceia: '🍵',
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ width: '100%', maxWidth: 800, alignSelf: 'center', flexGrow: 1 }}
    >
      {/* Header */}
      <LinearGradient
        colors={['rgba(253,203,110,0.2)', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Nutrição</Text>
        <Text style={styles.headerSubtitle}>Seu plano alimentar personalizado</Text>
      </LinearGradient>

      {/* Gerar Dieta */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.gerarBtn} onPress={handleGerarDieta}>
          <LinearGradient
            colors={['#FDCB6E', '#E17055']}
            style={styles.gerarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="food-apple" size={24} color="#000" />
            <Text style={styles.gerarText}>
              {plano ? 'Gerar Nova Dieta' : 'Gerar Plano Alimentar'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {plano && resumo && (
        <>
          {/* Macros Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Macronutrientes</Text>
            <View style={styles.macrosGrid}>
              {[
                { label: 'Calorias', valor: plano.caloriasAlvo, unit: 'kcal', cor: '#FF6B35', icon: 'flame' },
                { label: 'Proteínas', valor: plano.proteinaAlvo, unit: 'g', cor: '#E94560', icon: 'fitness' },
                { label: 'Carboidratos', valor: plano.carboidratoAlvo, unit: 'g', cor: '#FDCB6E', icon: 'flash' },
                { label: 'Gorduras', valor: plano.gorduraAlvo, unit: 'g', cor: '#74B9FF', icon: 'water' },
              ].map((macro, i) => (
                <View key={i} style={styles.macroCard}>
                  <Ionicons name={macro.icon as any} size={20} color={macro.cor} />
                  <Text style={[styles.macroValue, { color: macro.cor }]}>{macro.valor}</Text>
                  <Text style={styles.macroUnit}>{macro.unit}</Text>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Refeições */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Refeições do Dia</Text>
            {plano.refeicoes.map((refeicao, i) => (
              <View key={i} style={styles.refeicaoCard}>
                <View style={styles.refeicaoHeader}>
                  <Text style={styles.refeicaoIcon}>{refeicaoIcons[refeicao.tipo] || '🍽️'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.refeicaoTitulo}>{refeicao.titulo}</Text>
                    <Text style={styles.refeicaoCalorias}>{refeicao.caloriasTotal} kcal</Text>
                  </View>
                  <View style={styles.macrosMini}>
                    <Text style={styles.macroMiniP}>P:{refeicao.proteinaTotal}g</Text>
                    <Text style={styles.macroMiniC}>C:{refeicao.carboidratoTotal}g</Text>
                    <Text style={styles.macroMiniG}>G:{refeicao.gorduraTotal}g</Text>
                  </View>
                </View>
                {refeicao.alimentos.map((item, j) => (
                  <View key={j} style={styles.alimentoRow}>
                    <Text style={styles.alimentoNome}>{item.alimento.nome}</Text>
                    <Text style={styles.alimentoPorcao}>
                      {item.quantidade > 1 ? `${item.quantidade}x ` : ''}{item.alimento.porcao}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Lista de Compras */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.comprasToggle}
              onPress={() => setShowCompras(!showCompras)}
            >
              <Text style={styles.sectionTitle}>🛒 Lista de Compras</Text>
              <Ionicons
                name={showCompras ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.dark.textSecondary}
              />
            </TouchableOpacity>
            {showCompras && (
              <View style={styles.comprasList}>
                {plano.listCompras.map((item, i) => (
                  <View key={i} style={styles.comprasItem}>
                    <Ionicons name="checkbox-outline" size={18} color={Colors.primary} />
                    <Text style={styles.comprasText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      )}

      {!plano && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="food-apple-outline" size={64} color={Colors.dark.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum plano alimentar</Text>
          <Text style={styles.emptyDesc}>
            Gere um plano alimentar personalizado baseado nos seus objetivos e perfil.
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: Spacing.lg },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: FontSize.md, color: Colors.dark.textSecondary, marginTop: 4 },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginBottom: Spacing.md },

  gerarBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  gerarGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg,
  },
  gerarText: { fontSize: FontSize.lg, fontWeight: '700', color: '#000' },

  // Macros
  macrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  macroCard: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center',
    width: '48%', flex: 1, minWidth: 140,
  },
  macroValue: { fontSize: FontSize.xxl, fontWeight: '700', marginTop: 4 },
  macroUnit: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  macroLabel: { fontSize: FontSize.xs, color: Colors.dark.textMuted, marginTop: 2 },

  // Refeições
  refeicaoCard: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  refeicaoHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: Spacing.sm, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  refeicaoIcon: { fontSize: 28 },
  refeicaoTitulo: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF' },
  refeicaoCalorias: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  macrosMini: { flexDirection: 'row', gap: 6 },
  macroMiniP: { fontSize: FontSize.xs, color: '#E94560', fontWeight: '600' },
  macroMiniC: { fontSize: FontSize.xs, color: '#FDCB6E', fontWeight: '600' },
  macroMiniG: { fontSize: FontSize.xs, color: '#74B9FF', fontWeight: '600' },
  alimentoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6,
  },
  alimentoNome: { fontSize: FontSize.md, color: Colors.dark.textSecondary },
  alimentoPorcao: { fontSize: FontSize.sm, color: Colors.dark.textMuted },

  // Compras
  comprasToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  comprasList: { ...Glass.light, borderRadius: BorderRadius.lg, padding: Spacing.md },
  comprasItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  comprasText: { fontSize: FontSize.md, color: Colors.dark.textSecondary },

  // Empty
  emptyState: { alignItems: 'center', padding: Spacing.xxl, marginTop: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.textMuted, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.dark.textMuted, textAlign: 'center', marginTop: 8 },
});
