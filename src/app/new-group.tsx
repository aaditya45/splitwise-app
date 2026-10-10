import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProtectedScreen } from '@/features/auth/components/protected-screen';
import { AppText, Field, IconButton, Notice, PrimaryButton, ScreenFrame } from '@/components/ui';
import { newGroupScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { createGroup } from '@/features/groups/api';
import { useApp } from '@/providers/app-provider';

export default function NewGroupScreen() {
  return <ProtectedScreen><NewGroupContent /></ProtectedScreen>;
}

function NewGroupContent() {
  const { session, rememberGroup } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createGroup() {
    if (!name.trim() || !session) {
      setError('Add a name for your group.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const group = await createGroup(session.token, {
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(groupImage.trim() ? { groupImage: groupImage.trim() } : {}),
      });
      await rememberGroup(group);
      router.replace({ pathname: '/group/[groupId]', params: { groupId: String(group.groupId) } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the group.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} /><AppText variant="section">New group</AppText><View style={styles.spacer} /></View>
        <AppText variant="heading">What are you planning?</AppText>
        <AppText variant="small" color={Palette.muted}>Give your group a name. You can add people next.</AppText>
        <View style={styles.form}>
          <Field label="Group name" value={name} onChangeText={setName} placeholder="e.g. Weekend trip" autoCapitalize="words" maxLength={80} />
          <Field label="Description (optional)" value={description} onChangeText={setDescription} placeholder="What's this group for?" multiline maxLength={240} />
          <Field label="Group image URL (optional)" value={groupImage} onChangeText={setGroupImage} placeholder="https://..." autoCapitalize="none" keyboardType="url" />
          {error ? <Notice message={error} /> : null}
          <PrimaryButton title="Create group" onPress={createGroup} loading={busy} />
        </View>
      </ScrollView>
    </ScreenFrame>
  );
}

