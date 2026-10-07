import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, AppText, Field, Notice, PrimaryButton } from '@/components/ui/primitives';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/providers/app-provider';

export function AuthScreen() {
  const { login, register } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    if (isRegistering && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setBusy(true);
    try {
      if (isRegistering) {
        await register({ name: name.trim(), email: email.trim(), password, ...(phone.trim() ? { phone: phone.trim() } : {}) });
      } else {
        await login(email.trim(), password);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}><AppIcon name="groups" color={Palette.orange} size={30} /></View>
        <AppText variant="display" style={styles.brand}>Splitwise</AppText>
        <AppText variant="body" color={Palette.muted} style={styles.intro}>Shared expenses, sorted together.</AppText>

        <View style={styles.formHeader}>
          <AppText variant="heading">{isRegistering ? 'Create your account' : 'Welcome back'}</AppText>
          <AppText variant="small" color={Palette.muted}>{isRegistering ? 'Start keeping group expenses in one place.' : 'Sign in to see what your group owes.'}</AppText>
        </View>

        <View style={styles.form}>
          {isRegistering ? <Field label="Your name" autoCapitalize="words" value={name} onChangeText={setName} placeholder="e.g. Alex Morgan" returnKeyType="next" /> : null}
          <Field label="Email address" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" returnKeyType="next" />
          <Field label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="Enter your password" returnKeyType="done" onSubmitEditing={submit} />
          {isRegistering ? <Field label="Phone (optional)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholder="Add a phone number" returnKeyType="done" /> : null}
          {error ? <Notice message={error} /> : null}
          <PrimaryButton title={isRegistering ? 'Create account' : 'Sign in'} onPress={submit} loading={busy} />
        </View>

        <View style={styles.switchRow}>
          <AppText variant="small" color={Palette.muted}>{isRegistering ? 'Already have an account?' : 'New to Splitwise?'}</AppText>
          <Pressable accessibilityRole="button" onPress={() => { setError(''); setIsRegistering(!isRegistering); }}>
            <AppText variant="small" color={Palette.orangeDark} style={styles.switchText}>{isRegistering ? 'Sign in' : 'Create account'}</AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Palette.surface },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', flexGrow: 1, padding: Spacing.four, paddingTop: Spacing.six, justifyContent: 'center' },
  brandMark: { width: 58, height: 58, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, marginBottom: Spacing.two },
  brand: { fontWeight: Typography.weight.bold },
  intro: { marginTop: Spacing.one },
  formHeader: { gap: Spacing.one, marginTop: Spacing.six, marginBottom: Spacing.four },
  form: { gap: Spacing.three },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.four },
  switchText: { fontWeight: Typography.weight.semibold },
});
