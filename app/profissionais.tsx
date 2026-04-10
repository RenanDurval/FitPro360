import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../constants/theme';
import { getProfissionais, saveProfissional, removeProfissional } from '../services/storage';
import { Profissional, TipoProfissional } from '../types';

export default function ProfissionaisScreen() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formTipo, setFormTipo] = useState<TipoProfissional>('medico');
  const [formNome, setFormNome] = useState('');
  const [formEspecialidade, setFormEspecialidade] = useState('');
  const [formRegistro, setFormRegistro] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formEmail, setFormEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setProfissionais(await getProfissionais());
  }

  async function handleSalvar() {
    if (!formNome.trim()) {
      Alert.alert('Nome obrigatório', 'Preencha o nome do profissional.');
      return;
    }

    const prof: Profissional = {
      id: `prof_${Date.now()}`,
      nome: formNome.trim(),
      tipo: formTipo,
      especialidade: formEspecialidade.trim(),
      registro: formRegistro.trim(),
      telefone: formTelefone.trim(),
      email: formEmail.trim(),
      observacoes: '',
    };

    await saveProfissional(prof);
    await loadData();
    setShowForm(false);
    setFormNome(''); setFormEspecialidade(''); setFormRegistro(''); setFormTelefone(''); setFormEmail('');
    Alert.alert('✅ Salvo!', `${prof.nome} adicionado como ${formatTipo(prof.tipo)}.`);
  }

  async function handleRemover(id: string) {
    Alert.alert('Remover', 'Tem certeza?', [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await removeProfissional(id);
        await loadData();
      }},
    ]);
  }

  function formatTipo(tipo: TipoProfissional): string {
    return tipo === 'medico' ? '🩺 Médico' : tipo === 'treinador' ? '🏋️ Treinador' : '🥗 Nutricionista';
  }

  const tipoConfig: Record<TipoProfissional, { cor: string; registroLabel: string }> = {
    medico: { cor: '#E94560', registroLabel: 'CRM' },
    treinador: { cor: '#FF6B35', registroLabel: 'CREF' },
    nutricionista: { cor: '#00D4AA', registroLabel: 'CRN' },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Profissionais</Text>
      </View>

      <Text style={styles.descricao}>
        Aqui você pode cadastrar seus profissionais de saúde para que eles tenham acesso aos seus dados e possam acompanhar seu progresso.
      </Text>

      {/* Lista */}
      {profissionais.map((prof, i) => {
        const config = tipoConfig[prof.tipo];
        return (
          <View key={i} style={[styles.profCard, { borderLeftColor: config.cor }]}>
            <View style={styles.profHeader}>
              <Text style={styles.profTipo}>{formatTipo(prof.tipo)}</Text>
              <TouchableOpacity onPress={() => handleRemover(prof.id)}>
                <Ionicons name="close-circle" size={22} color={Colors.dark.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.profNome}>{prof.nome}</Text>
            {prof.especialidade ? <Text style={styles.profInfo}>Especialidade: {prof.especialidade}</Text> : null}
            {prof.registro ? <Text style={styles.profInfo}>{config.registroLabel}: {prof.registro}</Text> : null}
            {prof.telefone ? <Text style={styles.profInfo}>📞 {prof.telefone}</Text> : null}
            {prof.email ? <Text style={styles.profInfo}>📧 {prof.email}</Text> : null}

            <View style={styles.profActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: config.cor + '20' }]}>
                <Ionicons name="share-outline" size={16} color={config.cor} />
                <Text style={[styles.actionText, { color: config.cor }]}>Compartilhar Dados</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: config.cor + '20' }]}>
                <Ionicons name="chatbubble-outline" size={16} color={config.cor} />
                <Text style={[styles.actionText, { color: config.cor }]}>Mensagem</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Adicionar */}
      {!showForm ? (
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Ionicons name="add-circle" size={24} color={Colors.primary} />
          <Text style={styles.addText}>Adicionar Profissional</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Novo Profissional</Text>

          <View style={styles.tipoSelector}>
            {(['medico', 'treinador', 'nutricionista'] as TipoProfissional[]).map(tipo => (
              <TouchableOpacity
                key={tipo}
                style={[styles.tipoBtn, formTipo === tipo && { backgroundColor: tipoConfig[tipo].cor + '30', borderColor: tipoConfig[tipo].cor }]}
                onPress={() => setFormTipo(tipo)}
              >
                <Text style={[styles.tipoBtnText, formTipo === tipo && { color: tipoConfig[tipo].cor }]}>
                  {formatTipo(tipo)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {[
            { label: 'Nome*', value: formNome, setter: setFormNome, placeholder: 'Dr. João Silva' },
            { label: 'Especialidade', value: formEspecialidade, setter: setFormEspecialidade, placeholder: 'Cardiologia' },
            { label: tipoConfig[formTipo].registroLabel, value: formRegistro, setter: setFormRegistro, placeholder: '12345' },
            { label: 'Telefone', value: formTelefone, setter: setFormTelefone, placeholder: '(11) 99999-9999' },
            { label: 'Email', value: formEmail, setter: setFormEmail, placeholder: 'dr@email.com' },
          ].map((field, i) => (
            <View key={i} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>
          ))}

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.salvarBtn} onPress={handleSalvar}>
              <Text style={styles.salvarText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {profissionais.length === 0 && !showForm && (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={Colors.dark.textMuted} />
          <Text style={styles.emptyText}>Nenhum profissional cadastrado</Text>
          <Text style={styles.emptyDesc}>
            Adicione seu médico, treinador e nutricionista para compartilhar dados e receber acompanhamento.
          </Text>
        </View>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: '#FFF' },
  descricao: {
    fontSize: FontSize.md, color: Colors.dark.textSecondary,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg,
  },

  // Prof Card
  profCard: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  profHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  profTipo: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, fontWeight: '600' },
  profNome: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF' },
  profInfo: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 4 },
  profActions: { flexDirection: 'row', gap: 8, marginTop: Spacing.md },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.round,
  },
  actionText: { fontSize: FontSize.sm, fontWeight: '600' },

  // Add
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '40',
    borderRadius: BorderRadius.lg, borderStyle: 'dashed',
  },
  addText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '600' },

  // Form
  form: {
    ...Glass.light, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginHorizontal: Spacing.lg,
  },
  formTitle: { fontSize: FontSize.lg, fontWeight: '700', color: '#FFF', marginBottom: Spacing.md },
  tipoSelector: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  tipoBtn: {
    flex: 1, paddingVertical: 8, borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.dark.border, alignItems: 'center',
  },
  tipoBtnText: { fontSize: FontSize.sm, color: Colors.dark.textMuted, fontWeight: '500' },
  inputGroup: { marginBottom: Spacing.sm },
  inputLabel: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: Colors.dark.card, borderWidth: 1, borderColor: Colors.dark.border,
    borderRadius: BorderRadius.sm, padding: Spacing.sm,
    fontSize: FontSize.md, color: '#FFF',
  },
  formActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.dark.border, alignItems: 'center' },
  cancelText: { color: Colors.dark.textSecondary, fontWeight: '600' },
  salvarBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.sm, backgroundColor: Colors.primary, alignItems: 'center' },
  salvarText: { color: '#000', fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', padding: Spacing.xxl },
  emptyText: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.textMuted, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.dark.textMuted, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
});
