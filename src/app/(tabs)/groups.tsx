import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon, AppText, Avatar, IconButton, LoadingView, Notice, PageHeader, PrimaryButton, ScreenFrame } from '@/components/ui/primitives';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/providers/app-provider';

export default function GroupsScreen() {
  const { groups, groupsError, groupsLoading, loadGroups } = useApp();
  const [groupId, setGroupId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function findGroup() {
    const parsedId = Number(groupId.trim());
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setIsError(true);
      setMessage('Enter a valid group ID.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const availableGroups = await loadGroups();
      const group = availableGroups.find((item) => item.groupId === parsedId);
      if (!group) {
        throw new Error(`No group with ID ${parsedId} belongs to this account.`);
      }
      setGroupId('');
      router.push({ pathname: '/group/[groupId]', params: { groupId: String(group.groupId) } });
    } catch (cause) {
      setIsError(true);
      setMessage(cause instanceof Error ? cause.message : 'Could not find that group.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PageHeader title="Groups" subtitle="Keep shared plans together." right={<IconButton name="add" accessibilityLabel="Create a group" onPress={() => router.push('/new-group')} />} />

        <View style={styles.findBlock}>
          <AppText variant="section">Open a group</AppText>
          <AppText variant="small" color={Palette.muted}>Enter a group ID you already have.</AppText>
          <View style={styles.lookupRow}>
            <TextInput value={groupId} onChangeText={setGroupId} keyboardType="number-pad" placeholder="Group ID" placeholderTextColor={Palette.muted} accessibilityLabel="Group ID" style={styles.lookupInput} />
            <Pressable accessibilityRole="button" onPress={findGroup} disabled={busy} style={({ pressed }) => [styles.findButton, pressed && styles.pressed]}>
              {busy ? <AppText variant="small" color={Palette.surface}>...</AppText> : <AppIcon name="search" color={Palette.surface} size={19} />}
            </Pressable>
          </View>
          {message ? <Notice message={message} kind={isError ? 'error' : 'success'} /> : null}
        </View>

        {groupsError ? <Notice message={groupsError} /> : null}
        <View style={styles.sectionTitle}><AppText variant="section">Your groups</AppText><AppText variant="caption" color={Palette.muted}>{groups.length}</AppText></View>
        {groupsLoading ? <AppText variant="small" color={Palette.muted}>Loading your groups…</AppText> : null}
        {groupsLoading ? <LoadingView label="Loading your groups" /> : groups.length ? groups.map((group) => (
          <Pressable key={group.groupId} accessibilityRole="button" onPress={() => router.push({ pathname: '/group/[groupId]', params: { groupId: String(group.groupId) } })} style={({ pressed }) => [styles.groupRow, pressed && styles.pressed]}>
            <Avatar name={group.name} size={48} />
            <View style={styles.groupDetails}>
              <AppText variant="body" style={styles.groupName}>{group.name}</AppText>
              <AppText variant="caption" color={Palette.muted}>{group.members?.length ?? 0} members · ID {group.groupId}</AppText>
              {group.description ? <AppText variant="caption" color={Palette.muted} numberOfLines={1}>{group.description}</AppText> : null}
            </View>
            <AppIcon name="chevron" color={Palette.muted} size={18} />
          </Pressable>
        )) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><AppIcon name="groups" color={Palette.orangeDark} size={24} /></View>
            <AppText variant="section">No groups saved yet</AppText>
            <AppText variant="small" color={Palette.muted} style={styles.emptyCopy}>Create a group or open one with its ID. Groups you open are saved here.</AppText>
            <PrimaryButton title="Create a group" icon="add" onPress={() => router.push('/new-group')} />
          </View>
        )}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  findBlock: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, backgroundColor: Palette.canvas, borderWidth: 1, borderColor: Palette.border },
  lookupRow: { flexDirection: 'row', gap: Spacing.two },
  lookupInput: { height: 48, flex: 1, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, paddingHorizontal: Spacing.three, backgroundColor: Palette.surface, color: Palette.ink, fontFamily: Typography.family, fontSize: Typography.size.body },
  findButton: { width: 48, height: 48, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orange },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.two },
  groupRow: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  groupDetails: { flex: 1, gap: 2 },
  groupName: { fontWeight: Typography.weight.semibold },
  emptyState: { alignItems: 'center', gap: Spacing.two, padding: Spacing.four, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium },
  emptyIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, borderRadius: Radius.pill },
  emptyCopy: { textAlign: 'center', marginBottom: Spacing.two },
  pressed: { opacity: 0.72 },
});
