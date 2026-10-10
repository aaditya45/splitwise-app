import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ProtectedScreen } from '@/features/auth/components/protected-screen';
import { AppText, Avatar, Field, IconButton, Money, Notice, PrimaryButton, ScreenFrame, SecondaryButton } from '@/components/ui';
import { newExpenseScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { createExpense } from '@/features/expenses/api';
import type { SplitType } from '@/features/expenses/types';
import type { Group, GroupMember } from '@/features/groups/types';
import { useApp } from '@/providers/app-provider';

const splitOptions: { value: SplitType; label: string }[] = [
  { value: 'EQUAL', label: 'Equally' },
  { value: 'PERCENTAGE', label: 'By percentage' },
  { value: 'ITEMIZE', label: 'Itemized' },
];

export default function NewExpenseScreen() {
  return <ProtectedScreen><NewExpenseContent /></ProtectedScreen>;
}

function NewExpenseContent() {
  const params = useLocalSearchParams<{ groupId?: string }>();
  const { session, groups, groupsLoading, groupsError } = useApp();
  const [selectedGroupId, setSelectedGroupId] = useState(params.groupId ?? '');
  const [group, setGroup] = useState<Group | null>(null);
  const [participants, setParticipants] = useState<number[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedGroupId && groups.length) setSelectedGroupId(String(groups[0].groupId));
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId || !session) {
      setGroup(null);
      setLoadingGroup(false);
      return;
    }
    const nextGroup = groups.find((item) => item.groupId === Number(selectedGroupId));
    if (!nextGroup) {
      setGroup(null);
      setParticipants([]);
      setLoadingGroup(groupsLoading);
      if (!groupsLoading) setError(groupsError ?? 'This group is not in your account group list.');
      return;
    }
    setGroup(nextGroup);
    setError('');
    setLoadingGroup(false);
    const members = nextGroup.members?.map((member) => member.userId) ?? [session.user.userId];
    setParticipants(members.length ? members : [session.user.userId]);
  }, [groups, groupsError, groupsLoading, selectedGroupId, session]);

  const members: GroupMember[] = group?.members?.length ? group.members : session ? [{ userId: session.user.userId, name: session.user.name }] : [];

  function toggleParticipant(userId: number) {
    setParticipants((current) => current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]);
  }

  async function createExpenseFunc() {
    const parsedAmount = Number(amount);
    if (!session || !group) {
      setError('Choose a group before adding an expense.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (!participants.length) {
      setError('Choose at least one participant.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await createExpense(session.token, {
        groupId: group.groupId,
        amount: parsedAmount,
        ...(description.trim() ? { description: description.trim() } : {}),
        participantIds: participants,
        splitType,
      });
      router.back();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create this expense.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} /><AppText variant="section">Add expense</AppText><View style={styles.headerSpacer} /></View>
        {groups.length > 1 && !params.groupId ? <View style={styles.fieldBlock}><AppText variant="small" style={styles.label}>Group</AppText><View style={styles.groupOptions}>{groups.map((item) => <Pressable key={item.groupId} accessibilityRole="radio" accessibilityState={{ checked: selectedGroupId === String(item.groupId) }} onPress={() => setSelectedGroupId(String(item.groupId))} style={[styles.groupOption, selectedGroupId === String(item.groupId) && styles.selectedGroup]}><AppText variant="small" color={selectedGroupId === String(item.groupId) ? Palette.orangeDark : Palette.ink}>{item.name}</AppText></Pressable>)}</View></View> : null}
        {loadingGroup ? <AppText variant="small" color={Palette.muted}>Loading group details…</AppText> : group ? <AppText variant="small" color={Palette.muted}>In {group.name}</AppText> : null}
        {!groupsLoading && !groups.length && !params.groupId ? <View style={styles.noGroups}><Notice message="Create or open a group before adding an expense." /><SecondaryButton title="Create a group" icon="add" onPress={() => router.push('/new-group')} /></View> : null}
        <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />
        <Field label="Description" value={description} onChangeText={setDescription} placeholder="What was this for?" maxLength={140} />

        <View style={styles.fieldBlock}>
          <AppText variant="small" style={styles.label}>Split type</AppText>
          <View style={styles.splitOptions}>{splitOptions.map((option) => (
            <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ checked: splitType === option.value }} onPress={() => setSplitType(option.value)} style={[styles.splitOption, splitType === option.value && styles.selectedSplit]}>
              <AppText variant="caption" color={splitType === option.value ? Palette.orangeDark : Palette.muted} style={styles.splitText}>{option.label}</AppText>
            </Pressable>
          ))}</View>
          {splitType !== 'EQUAL' ? <AppText variant="caption" color={Palette.orangeDark} style={styles.contractHint}>The current expense request supports participant IDs and split type, but does not define custom percentage or item amounts.</AppText> : null}
        </View>

        <View style={styles.fieldBlock}>
          <AppText variant="small" style={styles.label}>Split with</AppText>
          <AppText variant="caption" color={Palette.muted}>You are automatically recorded as the payer.</AppText>
          <View style={styles.memberList}>{members.map((member) => {
            const selected = participants.includes(member.userId);
            const memberName = member.name?.trim() || `Member ${member.userId}`;
            return <Pressable key={member.userId} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggleParticipant(member.userId)} style={styles.memberRow}>
              <Avatar name={memberName} size={38} />
              <View style={styles.memberName}><AppText variant="small">{memberName}</AppText><AppText variant="caption" color={Palette.muted}>ID {member.userId}</AppText></View>
              <View style={[styles.checkbox, selected && styles.checked]}>{selected ? <AppText variant="caption" color={Palette.surface} style={styles.checkMark}>✓</AppText> : null}</View>
            </Pressable>;
          })}</View>
          {splitType === 'EQUAL' && participants.length > 0 && Number(amount) > 0 ? (
            <View style={styles.splitPreview}>
              <AppText variant="small" color={Palette.muted}>About per person</AppText>
              <Money amount={Math.round((Number(amount) * 100) / participants.length) / 100} variant="small" />
            </View>
          ) : null}
        </View>
        {error ? <Notice message={error} /> : null}
        <PrimaryButton title="Save expense" onPress={createExpenseFunc} loading={busy} disabled={!group || loadingGroup} />
      </ScrollView>
    </ScreenFrame>
  );
}

