import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProtectedScreen } from '@/features/auth/components/protected-screen';
import { AppText, Field, IconButton, Notice, PrimaryButton, ScreenFrame } from '@/components/ui';
import { addMemberScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { addMember as addGroupMember } from '@/features/groups/api';
import { useApp } from '@/providers/app-provider';

export default function AddMemberScreen() {
  return <ProtectedScreen><AddMemberContent /></ProtectedScreen>;
}

function AddMemberContent() {
  const { groupId } = useLocalSearchParams<{ groupId?: string }>();
  const { session, groups, loadGroups } = useApp();
  const [userId, setUserId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function addMember() {
    if (!session || !groupId) {
      setError('This group is missing.');
      return;
    }

    const parsedId = Number(userId.trim());
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setError('Enter a valid user ID.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await addGroupMember(session.token, Number(groupId), parsedId);
      await loadGroups();
      router.replace({ pathname: '/group/[groupId]', params: { groupId: String(groupId) } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not add this user.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} />
          <AppText variant="section">Add member</AppText>
          <View style={styles.spacer} />
        </View>

        <AppText variant="heading">Add someone to this group</AppText>
        <AppText variant="small" color={Palette.muted}>Enter the user ID of the person you want to add.</AppText>

        <View style={styles.form}>
          <Field label="User ID" value={userId} onChangeText={setUserId} placeholder="e.g. 42" keyboardType="number-pad" />
          {error ? <Notice message={error} /> : null}
          <PrimaryButton title="Add member" onPress={addMember} loading={busy} />
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

