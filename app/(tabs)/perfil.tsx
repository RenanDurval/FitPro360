import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass, Shadow } from '../../constants/theme';
import { getUserProfile, getProgramasTreino, getPlanoDieta, getSensorHistory, resetAllData } from '../../services/storage';
import { UserProfile } from '../../types';

export default function PerfilScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ treinos: 0, diasAtivos: 0, caloriasTotal: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const profile = await getUserProfile();
    setUser(profile);

    const treinos = await getProgramasTreino();
    const sensores = await getSensorHistory();

    setStats({
      treinos: treinos.length,
      diasAtivos: sensores.length,
      caloriasTotal: sensores.reduce((t, s) => t + s.caloriasQueimadas, 0),
    });
  }

  const calcularIdade = (dataNasc: string) => {
    return Math.floor((Date.now() - new Date(dataNasc).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const calcularIMC = (peso: number, altura: number) => {
    const alturaM = altura / 100;
    return (peso / (alturaM * alturaM)).toFixed(1);
  };

  const classificarIMC = (imc: number): { label: string; cor: string } => {
    if (imc < 18.5) return { label: 'Abaixo do peso', cor: '#74B9FF' };
    if (imc < 25) return { label: 'Normal', cor: '#00D4AA' };
    if (imc < 30) return { label: 'Sobrepeso', cor: '#FDCB6E' };
    return { label: 'Obesidade', cor: '#E94560' };
  };

  async function handleReset() {
    Alert.alert(
      'Resetar dados',
      'Tem certeza? Todos os dados serão apagados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  }

  const imc = user ? parseFloat(calcularIMC(user.peso, user.altura)) : 0;
  const imcInfo = classificarIMC(imc);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(162,155,254,0.2)', 'transparent']}
        style={styles.header}
      >
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {user?.nome?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.userName}>{user?.nome || 'Atleta'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'complete seu perfil'}</Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{stats.treinos}</Text>
          <Text style={styles.statLabel}>Programas</Text>
        </View>
        <View style={[styles.statDivider]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF6B35' }]}>{stats.diasAtivos}</Text>
          <Text style={styles.statLabel}>Dias Ativos</Text>
        </View>
        <View style={[styles.statDivider]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FDCB6E' }]}>{(stats.caloriasTotal / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>kcal Total</Text>
        </View>
      </View>

      {/* Dados Pessoais */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Dados Pessoais</Text>
          <View style={styles.infoCard}>
            {[
              { label: 'Sexo', value: user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1), icon: 'person' },
              { label: 'Idade', value: `${calcularIdade(user.dataNascimento)} anos`, icon: 'calendar' },
              { label: 'Altura', value: `${user.altura} cm`, icon: 'resize-outline' },
              { label: 'Peso', value: `${user.peso} kg`, icon: 'barbell' },
              { label: 'Nível', value: user.nivelExperiencia.charAt(0).toUpperCase() + user.nivelExperiencia.slice(1), icon: 'trending-up' },
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* IMC */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 IMC</Text>
          <View style={styles.imcCard}>
            <View style={styles.imcValueWrap}>
              <Text style={styles.imcValue}>{imc}</Text>
              <View style={[styles.imcBadge, { backgroundColor: imcInfo.cor + '20' }]}>
                <Text style={[styles.imcLabel, { color: imcInfo.cor }]}>{imcInfo.label}</Text>
              </View>
            </View>
            <View style={styles.imcBar}>
              <View style={[styles.imcSegment, { backgroundColor: '#74B9FF', flex: 18.5 }]} />
              <View style={[styles.imcSegment, { backgroundColor: '#00D4AA', flex: 6.5 }]} />
              <View style={[styles.imcSegment, { backgroundColor: '#FDCB6E', flex: 5 }]} />
              <View style={[styles.imcSegment, { backgroundColor: '#E94560', flex: 10 }]} />
            </View>
          </View>
        </View>
      )}

      {/* Saúde */}
      {user && user.condicaoSaude && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Saúde</Text>
          <View style={styles.infoCard}>
            {user.condicaoSaude.doencas.length > 0 && (
              <View style={styles.saudeRow}>
                <Text style={styles.saudeLabel}>Condições:</Text>
                <Text style={styles.saudeValue}>{user.condicaoSaude.doencas.join(', ')}</Text>
              </View>
            )}
            {user.condicaoSaude.medicamentos.length > 0 && (
              <View style={styles.saudeRow}>
                <Text style={styles.saudeLabel}>Medicamentos:</Text>
                <Text style={styles.saudeValue}>{user.condicaoSaude.medicamentos.join(', ')}</Text>
              </View>
            )}
            {user.condicaoSaude.suplementos.length > 0 && (
              <View style={styles.saudeRow}>
                <Text style={styles.saudeLabel}>Suplementos:</Text>
                <Text style={styles.saudeValue}>{user.condicaoSaude.suplementos.join(', ')}</Text>
              </View>
            )}
            {user.condicaoSaude.alergias.length > 0 && (
              <View style={styles.saudeRow}>
                <Text style={styles.saudeLabel}>Alergias:</Text>
                <Text style={styles.saudeValue}>{user.condicaoSaude.alergias.join(', ')}</Text>
              </View>
            )}
            {user.objetivos.length > 0 && (
              <View style={styles.saudeRow}>
                <Text style={styles.saudeLabel}>Objetivos:</Text>
                <Text style={styles.saudeValue}>{user.objetivos.map(o => o.replace('_', ' ')).join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
        {[
          { icon: 'person-outline', label: 'Meus Profissionais', route: '/profissionais', cor: '#A29BFE' },
          { icon: 'bluetooth', label: 'Dispositivos Conectados', route: '/dispositivos', cor: '#74B9FF' },
          { icon: 'refresh', label: 'Refazer Onboarding', route: '/onboarding', cor: '#FDCB6E' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: item.cor + '20' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.cor} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textMuted} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
          <View style={[styles.menuIconWrap, { backgroundColor: '#E9456020' }]}>
            <Ionicons name="trash-outline" size={20} color="#E94560" />
          </View>
          <Text style={[styles.menuLabel, { color: '#E94560' }]}>Resetar Todos os Dados</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.dark.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FitPro360 v1.0.0</Text>
        <Text style={styles.footerSubtext}>Feito com 💪 para sua saúde</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    paddingTop: 60, paddingBottom: 24,
    alignItems: 'center',
  },
  avatarWrap: { marginBottom: 12 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#000' },
  userName: { fontSize: FontSize.xxl, fontWeight: '700', color: '#FFF' },
  userEmail: { fontSize: FontSize.md, color: Colors.dark.textSecondary, marginTop: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700' },
  statLabel: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginBottom: Spacing.md },

  // Info
  infoCard: { ...Glass.light, borderRadius: BorderRadius.lg, padding: Spacing.md },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: FontSize.md, color: Colors.dark.textSecondary },
  infoValue: { fontSize: FontSize.md, fontWeight: '600', color: '#FFF' },

  // IMC
  imcCard: { ...Glass.light, borderRadius: BorderRadius.lg, padding: Spacing.md },
  imcValueWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md },
  imcValue: { fontSize: FontSize.hero, fontWeight: '700', color: '#FFF' },
  imcBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.round },
  imcLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  imcBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 },
  imcSegment: { borderRadius: 4 },

  // Saúde
  saudeRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  saudeLabel: { fontSize: FontSize.sm, color: Colors.dark.textMuted, marginBottom: 2 },
  saudeValue: { fontSize: FontSize.md, color: '#FFF' },

  // Menu
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: '#FFF' },

  footer: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerText: { fontSize: FontSize.sm, color: Colors.dark.textMuted },
  footerSubtext: { fontSize: FontSize.xs, color: Colors.dark.textMuted, marginTop: 4 },
});
