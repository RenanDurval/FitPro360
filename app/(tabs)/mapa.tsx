import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../../constants/theme';
import { buscarLocaisProximos, LOCAIS_MOCK } from '../../services/location';
import { Local } from '../../types';

const { width } = Dimensions.get('window');

type FilterType = 'todos' | 'academia' | 'parque' | 'pista' | 'quadra' | 'piscina' | 'mercado' | 'feira' | 'loja_suplementos';

const FILTROS: { tipo: FilterType; label: string; icon: string; cor: string }[] = [
  { tipo: 'todos', label: 'Todos', icon: 'apps', cor: Colors.primary },
  { tipo: 'academia', label: 'Academias', icon: 'barbell', cor: '#FF6B35' },
  { tipo: 'parque', label: 'Parques', icon: 'leaf', cor: '#55EFC4' },
  { tipo: 'pista', label: 'Pistas', icon: 'trail-sign', cor: '#74B9FF' },
  { tipo: 'quadra', label: 'Quadras', icon: 'basketball', cor: '#FDCB6E' },
  { tipo: 'piscina', label: 'Piscinas', icon: 'water', cor: '#0984E3' },
  { tipo: 'mercado', label: 'Mercados', icon: 'cart', cor: '#A29BFE' },
  { tipo: 'feira', label: 'Feiras', icon: 'storefront', cor: '#E17055' },
  { tipo: 'loja_suplementos', label: 'Suplementos', icon: 'flask', cor: '#00CEC9' },
];

export default function MapaScreen() {
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>('todos');

  // Simular localização do usuário (São Paulo centro)
  const userLat = -23.5505;
  const userLon = -46.6333;

  const locaisFiltrados = filtroAtivo === 'todos'
    ? LOCAIS_MOCK.map(l => ({
        ...l,
        distancia: parseFloat(((Math.random() * 5 + 0.3).toFixed(1))),
      }))
    : LOCAIS_MOCK.filter(l => l.tipo === filtroAtivo).map(l => ({
        ...l,
        distancia: parseFloat(((Math.random() * 5 + 0.3).toFixed(1))),
      }));

  const tipoIcon: Record<string, { icon: string; cor: string }> = {
    academia: { icon: 'barbell', cor: '#FF6B35' },
    parque: { icon: 'leaf', cor: '#55EFC4' },
    pista: { icon: 'trail-sign', cor: '#74B9FF' },
    quadra: { icon: 'basketball', cor: '#FDCB6E' },
    piscina: { icon: 'water', cor: '#0984E3' },
    mercado: { icon: 'cart', cor: '#A29BFE' },
    feira: { icon: 'storefront', cor: '#E17055' },
    loja_suplementos: { icon: 'flask', cor: '#00CEC9' },
  };

  function renderEstrelas(avaliacao: number) {
    return (
      <View style={styles.estrelas}>
        {[1, 2, 3, 4, 5].map(n => (
          <Ionicons
            key={n}
            name={n <= Math.round(avaliacao) ? 'star' : 'star-outline'}
            size={12}
            color="#FDCB6E"
          />
        ))}
        <Text style={styles.avaliacaoText}>{avaliacao.toFixed(1)}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(85,239,196,0.2)', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Locais</Text>
        <Text style={styles.headerSubtitle}>Encontre o melhor lugar para treinar e comprar</Text>
      </LinearGradient>

      {/* Mapa Placeholder */}
      <View style={styles.section}>
        <View style={styles.mapPlaceholder}>
          <LinearGradient
            colors={[Colors.dark.card, Colors.dark.cardAlt]}
            style={styles.mapGradient}
          >
            <Ionicons name="map" size={48} color={Colors.primary} />
            <Text style={styles.mapText}>Mapa Interativo</Text>
            <Text style={styles.mapSubtext}>
              Integração com GPS ativa • {locaisFiltrados.length} locais encontrados
            </Text>
            <View style={styles.mapPins}>
              {locaisFiltrados.slice(0, 5).map((l, i) => (
                <View key={i} style={[styles.mapPin, { left: 20 + (i * 55), top: 10 + (i % 3) * 20 }]}>
                  <Ionicons name="location" size={20} color={tipoIcon[l.tipo]?.cor || Colors.primary} />
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.section}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTROS.map(filtro => (
            <TouchableOpacity
              key={filtro.tipo}
              style={[
                styles.filtroBtn,
                filtroAtivo === filtro.tipo && { backgroundColor: filtro.cor + '30', borderColor: filtro.cor },
              ]}
              onPress={() => setFiltroAtivo(filtro.tipo)}
            >
              <Ionicons
                name={filtro.icon as any}
                size={16}
                color={filtroAtivo === filtro.tipo ? filtro.cor : Colors.dark.textMuted}
              />
              <Text style={[
                styles.filtroText,
                filtroAtivo === filtro.tipo && { color: filtro.cor },
              ]}>
                {filtro.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Locais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filtroAtivo === 'todos' ? 'Todos os locais' : FILTROS.find(f => f.tipo === filtroAtivo)?.label || ''} ({locaisFiltrados.length})
        </Text>
        {locaisFiltrados.map((local, i) => {
          const info = tipoIcon[local.tipo] || { icon: 'location', cor: Colors.primary };
          return (
            <TouchableOpacity key={i} style={styles.localCard}>
              <View style={[styles.localIconWrap, { backgroundColor: info.cor + '20' }]}>
                <Ionicons name={info.icon as any} size={24} color={info.cor} />
              </View>
              <View style={styles.localInfo}>
                <Text style={styles.localNome}>{local.nome}</Text>
                <Text style={styles.localEndereco}>{local.endereco}</Text>
                <View style={styles.localMeta}>
                  {renderEstrelas(local.avaliacao)}
                  {local.horarioFuncionamento && (
                    <Text style={styles.localHorario}>
                      <Ionicons name="time-outline" size={10} color={Colors.dark.textMuted} /> {local.horarioFuncionamento}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.localDistancia}>
                <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
                <Text style={styles.distanciaText}>{local.distancia?.toFixed(1)} km</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

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

  // Mapa
  mapPlaceholder: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Glass.light },
  mapGradient: {
    height: 200, justifyContent: 'center', alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  mapText: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF', marginTop: 8 },
  mapSubtext: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 4 },
  mapPins: { position: 'relative', width: 300, height: 50, marginTop: 10 },
  mapPin: { position: 'absolute' },

  // Filtros
  filtroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.dark.border,
    marginRight: 8,
  },
  filtroText: { fontSize: FontSize.sm, color: Colors.dark.textMuted, fontWeight: '500' },

  // Locais
  localCard: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  localIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  localInfo: { flex: 1 },
  localNome: { fontSize: FontSize.md, fontWeight: '600', color: '#FFF' },
  localEndereco: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  localMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  estrelas: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  avaliacaoText: { fontSize: FontSize.xs, color: '#FDCB6E', marginLeft: 4, fontWeight: '600' },
  localHorario: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  localDistancia: { alignItems: 'center' },
  distanciaText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600', marginTop: 2 },
});
