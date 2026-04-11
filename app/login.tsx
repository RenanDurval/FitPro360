import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Glass, Shadow } from '../constants/theme';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos!');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Erro no Login', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos!');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else {
      Alert.alert('Sucesso!', 'Verifique sua caixa de entrada para confirmar o e-mail. Se já logado automaticamente, prossiga!');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="barbell" size={48} color={Colors.primary} />
            <Text style={styles.title}>FitPro<Text style={styles.titleAccent}>360</Text></Text>
          </View>
          <Text style={styles.subtitle}>Conecte-se para continuar sua jornada.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.dark.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha secreta"
                placeholderTextColor={Colors.dark.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, loading && styles.btnDisabled]} 
            onPress={signInWithEmail}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color="#000" />}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={styles.secondaryBtnText}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.sm },
  title: { fontSize: 42, fontWeight: '800', color: '#FFF', letterSpacing: -1 },
  titleAccent: { color: Colors.primary },
  subtitle: { fontSize: FontSize.md, color: Colors.dark.textSecondary, textAlign: 'center' },
  form: { width: '100%', maxWidth: 400, alignSelf: 'center', ...Glass.light, padding: Spacing.lg, borderRadius: BorderRadius.xl },
  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginBottom: 8, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingHorizontal: Spacing.md },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: FontSize.md, paddingVertical: 14 },
  primaryBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.md, marginTop: Spacing.sm },
  btnDisabled: { opacity: 0.7 },
  gradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  primaryBtnText: { fontSize: FontSize.lg, fontWeight: '700', color: '#000' },
  secondaryBtn: { marginTop: Spacing.lg, paddingVertical: Spacing.sm, alignItems: 'center' },
  secondaryBtnText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '600' },
});
