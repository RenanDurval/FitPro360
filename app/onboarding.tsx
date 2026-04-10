import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Glass } from '../constants/theme';
import { saveUserProfile, setOnboardingDone } from '../services/storage';
import { UserProfile, Sexo, NivelExperiencia, ObjetivoFitness, DiaSemana } from '../types';
import { MODALIDADES } from '../data/exercicios';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);

  // Step 0: Dados Básicos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [sexo, setSexo] = useState<Sexo>('masculino');

  // Step 1: Corpo
  const [dataNascimento, setDataNascimento] = useState('1995-01-15');
  const [altura, setAltura] = useState('175');
  const [peso, setPeso] = useState('75');

  // Step 2: Objetivo & Nível
  const [nivel, setNivel] = useState<NivelExperiencia>('iniciante');
  const [objetivos, setObjetivos] = useState<ObjetivoFitness[]>([]);

  // Step 3: Modalidades & Dias
  const [modalidades, setModalidades] = useState<string[]>([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState<DiaSemana[]>([]);

  // Step 4: Saúde
  const [doencas, setDoencas] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [suplementos, setSuplemmentos] = useState('');
  const [alergias, setAlergias] = useState('');

  const totalSteps = 5;

  function toggleItem<T>(lista: T[], item: T, setter: (v: T[]) => void) {
    if (lista.includes(item)) setter(lista.filter(i => i !== item));
    else setter([...lista, item]);
  }

  function renderChip(label: string, selected: boolean, onPress: () => void, cor?: string) {
    return (
      <TouchableOpacity
        key={label}
        style={[
          styles.chip,
          selected && { backgroundColor: (cor || Colors.primary) + '30', borderColor: cor || Colors.primary },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.chipText, selected && { color: cor || Colors.primary }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  async function handleFinalizar() {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, preencha seu nome.');
      return;
    }

    const user: UserProfile = {
      id: `user_${Date.now()}`,
      nome: nome.trim(),
      email: email.trim(),
      sexo,
      dataNascimento,
      altura: parseInt(altura) || 170,
      peso: parseInt(peso) || 70,
      nivelExperiencia: nivel,
      objetivos: objetivos.length > 0 ? objetivos : ['saude_geral'],
      modalidadesPreferidas: modalidades.length > 0 ? modalidades : ['musculacao'],
      diasDisponiveis: diasDisponiveis.length > 0 ? diasDisponiveis : ['segunda', 'quarta', 'sexta'],
      condicaoSaude: {
        doencas: doencas ? doencas.split(',').map(s => s.trim()) : [],
        deficiencias: [],
        medicamentos: medicamentos ? medicamentos.split(',').map(s => s.trim()) : [],
        suplementos: suplementos ? suplementos.split(',').map(s => s.trim()) : [],
        vitaminas: [],
        alergias: alergias ? alergias.split(',').map(s => s.trim()) : [],
        restricoesAlimentares: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUserProfile(user);
    await setOnboardingDone();
    router.replace('/(tabs)');
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>👋</Text>
            <Text style={styles.stepTitle}>Vamos começar!</Text>
            <Text style={styles.stepDesc}>Conte um pouco sobre você para personalizar sua experiência.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sexo</Text>
              <View style={styles.chipRow}>
                {renderChip('Masculino', sexo === 'masculino', () => setSexo('masculino'))}
                {renderChip('Feminino', sexo === 'feminino', () => setSexo('feminino'))}
                {renderChip('Outro', sexo === 'outro', () => setSexo('outro'))}
              </View>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>📏</Text>
            <Text style={styles.stepTitle}>Seu corpo</Text>
            <Text style={styles.stepDesc}>Dados para calcular seu IMC e necessidades calóricas.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de Nascimento</Text>
              <TextInput
                style={styles.input}
                value={dataNascimento}
                onChangeText={setDataNascimento}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={altura}
                  onChangeText={setAltura}
                  placeholder="175"
                  placeholderTextColor={Colors.dark.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={peso}
                  onChangeText={setPeso}
                  placeholder="75"
                  placeholderTextColor={Colors.dark.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🎯</Text>
            <Text style={styles.stepTitle}>Objetivos & Nível</Text>
            <Text style={styles.stepDesc}>O que você quer alcançar?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nível de Experiência</Text>
              <View style={styles.chipRow}>
                {['iniciante', 'intermediario', 'avancado', 'profissional'].map(n =>
                  renderChip(
                    n.charAt(0).toUpperCase() + n.slice(1),
                    nivel === n,
                    () => setNivel(n as NivelExperiencia),
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Objetivos (selecione um ou mais)</Text>
              <View style={styles.chipRow}>
                {[
                  { id: 'perda_peso', label: '🔥 Perder Peso' },
                  { id: 'ganho_massa', label: '💪 Ganhar Massa' },
                  { id: 'resistencia', label: '🏃 Resistência' },
                  { id: 'flexibilidade', label: '🧘 Flexibilidade' },
                  { id: 'saude_geral', label: '❤️ Saúde Geral' },
                  { id: 'performance', label: '⚡ Performance' },
                ].map(obj =>
                  renderChip(
                    obj.label,
                    objetivos.includes(obj.id as ObjetivoFitness),
                    () => toggleItem(objetivos, obj.id as ObjetivoFitness, setObjetivos),
                  )
                )}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🏋️</Text>
            <Text style={styles.stepTitle}>Modalidades & Disponibilidade</Text>
            <Text style={styles.stepDesc}>Quais esportes você pratica ou quer praticar?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Modalidades</Text>
              <View style={styles.chipRow}>
                {MODALIDADES.map(mod =>
                  renderChip(
                    mod.nome,
                    modalidades.includes(mod.id),
                    () => toggleItem(modalidades, mod.id, setModalidades),
                    mod.cor,
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dias Disponíveis</Text>
              <View style={styles.chipRow}>
                {[
                  { id: 'segunda', label: 'Seg' }, { id: 'terca', label: 'Ter' },
                  { id: 'quarta', label: 'Qua' }, { id: 'quinta', label: 'Qui' },
                  { id: 'sexta', label: 'Sex' }, { id: 'sabado', label: 'Sáb' },
                  { id: 'domingo', label: 'Dom' },
                ].map(dia =>
                  renderChip(
                    dia.label,
                    diasDisponiveis.includes(dia.id as DiaSemana),
                    () => toggleItem(diasDisponiveis, dia.id as DiaSemana, setDiasDisponiveis),
                  )
                )}
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🏥</Text>
            <Text style={styles.stepTitle}>Saúde</Text>
            <Text style={styles.stepDesc}>Importante para a segurança do seu treino. Separe por vírgula.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Doenças / Condições (opcional)</Text>
              <TextInput
                style={styles.input}
                value={doencas}
                onChangeText={setDoencas}
                placeholder="Ex: hipertensão, diabetes"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medicamentos (opcional)</Text>
              <TextInput
                style={styles.input}
                value={medicamentos}
                onChangeText={setMedicamentos}
                placeholder="Ex: losartana, metformina"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Suplementos / Vitaminas (opcional)</Text>
              <TextInput
                style={styles.input}
                value={suplementos}
                onChangeText={setSuplemmentos}
                placeholder="Ex: whey, creatina, vitamina D"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alergias Alimentares (opcional)</Text>
              <TextInput
                style={styles.input}
                value={alergias}
                onChangeText={setAlergias}
                placeholder="Ex: lactose, glúten"
                placeholderTextColor={Colors.dark.textMuted}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step && { backgroundColor: Colors.primary },
              ]}
            />
          ))}
        </View>

        {/* Step Counter */}
        <Text style={styles.stepCounter}>{step + 1} de {totalSteps}</Text>

        {/* Step Content */}
        {renderStep()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <Ionicons name="arrow-back" size={20} color={Colors.dark.textSecondary} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            if (step < totalSteps - 1) setStep(step + 1);
            else handleFinalizar();
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.nextGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextText}>
              {step === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
            </Text>
            <Ionicons name={step === totalSteps - 1 ? 'checkmark' : 'arrow-forward'} size={20} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },

  // Progress
  progressBar: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    paddingTop: 60, paddingHorizontal: Spacing.lg,
  },
  progressDot: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: Colors.dark.border,
  },
  stepCounter: {
    textAlign: 'center', fontSize: FontSize.sm,
    color: Colors.dark.textMuted, marginTop: 8,
  },

  // Step Content
  stepContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  stepEmoji: { fontSize: 48, textAlign: 'center' },
  stepTitle: {
    fontSize: FontSize.xxl, fontWeight: '700',
    color: '#FFF', textAlign: 'center', marginTop: Spacing.sm,
  },
  stepDesc: {
    fontSize: FontSize.md, color: Colors.dark.textSecondary,
    textAlign: 'center', marginTop: 8, marginBottom: Spacing.lg,
  },

  // Inputs
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: FontSize.sm, color: Colors.dark.textSecondary,
    fontWeight: '600', marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1, borderColor: Colors.dark.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md, color: '#FFF',
  },
  rowInputs: { flexDirection: 'row', gap: Spacing.md },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  chipText: { fontSize: FontSize.sm, color: Colors.dark.textMuted, fontWeight: '500' },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: Colors.dark.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: FontSize.md, color: Colors.dark.textSecondary },
  nextBtn: { borderRadius: BorderRadius.round, overflow: 'hidden' },
  nextGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: BorderRadius.round,
  },
  nextText: { fontSize: FontSize.md, fontWeight: '700', color: '#000' },
});
