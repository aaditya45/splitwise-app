import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppText, Avatar, PageHeader, PrimaryButton, ScreenFrame } from '@/components/ui';
import { accountScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
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
        <PageHeader title="Your profile" subtitle="Your account details." />
        <View style={styles.profileCard}>
          <Avatar name={session?.user.name ?? ''} size={72} />
          <View style={styles.profileText}>
            <AppText variant="section">{session?.user.name}</AppText>
            <AppText variant="small" color={Palette.muted}>{session?.user.email}</AppText>
          </View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <AppText variant="small" color={Palette.muted}>User ID</AppText>
            <AppText variant="small">{session?.user.userId}</AppText>
          </View>
          {session?.user.phone ? <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <AppText variant="small" color={Palette.muted}>Phone</AppText>
              <AppText variant="small">{session.user.phone}</AppText>
            </View>
          </> : null}
        </View>
        <View style={styles.signOut}>
          <PrimaryButton title="Sign out" onPress={() => void signOut()} loading={signingOut} disabled={signingOut} />
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

