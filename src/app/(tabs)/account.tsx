import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Avatar, Notice, PageHeader, PrimaryButton, ScreenFrame } from '@/components/ui/primitives';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useApp } from '@/providers/app-provider';

export default function AccountScreen() {
  const { session, logout } = useApp();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    await logout();
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader title="Account" subtitle="Your Splitwise profile." />
        <View style={styles.profileCard}>
          <Avatar name={session?.user.name ?? ''} size={72} />
          <View style={styles.profileText}><AppText variant="section">{session?.user.name}</AppText><AppText variant="small" color={Palette.muted}>{session?.user.email}</AppText></View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}><AppText variant="small" color={Palette.muted}>User ID</AppText><AppText variant="small">{session?.user.userId}</AppText></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><AppText variant="small" color={Palette.muted}>Saved groups</AppText><AppText variant="small">Available in Groups</AppText></View>
        </View>
        <Notice message="Your sign-in token is stored securely on this device." kind="success" />
        <View style={styles.signOut}><PrimaryButton title="Sign out" onPress={() => void signOut()} loading={signingOut} disabled={signingOut} /></View>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium },
  profileText: { flex: 1, gap: Spacing.one },
  infoCard: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, paddingHorizontal: Spacing.three },
  infoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Palette.border },
  signOut: { marginTop: Spacing.two },
});
