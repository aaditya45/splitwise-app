import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText, Avatar, LoadingView, Money, Notice, PageHeader, PrimaryButton, ScreenFrame, SecondaryButton } from '@/components/ui';
import { settlementsScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { getPendingSettlements, getSettlementSummary, paySettlement } from '@/features/settlements/api';
import { useApp } from '@/providers/app-provider';
import type { Settlement } from '@/features/settlements/types';

type ViewMode = 'pending' | 'summary';

export default function SettlementsScreen() {
  const { session, groups, groupsLoading, groupsError } = useApp();
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [mode, setMode] = useState<ViewMode>('pending');
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const token = session?.token;

  useEffect(() => {
    if (!selectedGroupId && groups.length) setSelectedGroupId(String(groups[0].groupId));
  }, [groups, selectedGroupId]);

  const loadSettlements = useCallback(async () => {
    if (!token || !selectedGroupId) {
      setSettlements([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = mode === 'pending'
        ? await getPendingSettlements(token, Number(selectedGroupId))
        : await getSettlementSummary(token, Number(selectedGroupId));
      setSettlements(Array.isArray(result) ? result : result.settlements ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load settlements.');
    } finally {
      setLoading(false);
    }
  }, [mode, selectedGroupId, token]);

  useFocusEffect(useCallback(() => {
    void loadSettlements();
  }, [loadSettlements]));

  async function pay(settlementId: number) {
    if (!token) return;
    setPayingId(settlementId);
    setError('');
    setMessage('');
    try {
      await paySettlement(token, settlementId);
      setMessage('Payment marked as paid.');
      setMode('pending');
      try {
        const pending = await getPendingSettlements(token, Number(selectedGroupId));
        setSettlements(pending);
      } catch {
        setMessage('Payment was marked as paid. Refresh settlements to see the latest list.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not mark this payment as paid.');
    } finally {
      setPayingId(null);
    }
  }

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader title="Settlements" subtitle="See what is still to be paid." />
        {groupsLoading ? <LoadingView label="Loading your groups" /> : groups.length ? <View style={styles.groupSelector}>{groups.map((group) => (
          <Pressable key={group.groupId} accessibilityRole="button" onPress={() => setSelectedGroupId(String(group.groupId))} style={[styles.groupChip, selectedGroupId === String(group.groupId) && styles.groupChipSelected]}>
            <AppText variant="caption" color={selectedGroupId === String(group.groupId) ? Palette.orangeDark : Palette.muted}>{group.name}</AppText>
          </Pressable>
        ))}</View> : <View style={styles.noGroups}><Notice message={groupsError ?? 'Open or create a group to see its settlements.'} /><SecondaryButton title="Go to groups" icon="groups" onPress={() => router.push('/groups')} /></View>}

        <View style={styles.modeSwitch}>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'pending' }} onPress={() => setMode('pending')} style={[styles.modeButton, mode === 'pending' && styles.modeSelected]}><AppText variant="small" color={mode === 'pending' ? Palette.orangeDark : Palette.muted}>Pending</AppText></Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'summary' }} onPress={() => setMode('summary')} style={[styles.modeButton, mode === 'summary' && styles.modeSelected]}><AppText variant="small" color={mode === 'summary' ? Palette.orangeDark : Palette.muted}>Group summary</AppText></Pressable>
        </View>

        {error ? <Notice message={error} /> : null}
        {message ? <Notice message={message} kind="success" /> : null}
        {loading ? <LoadingView label="Loading settlements" /> : settlements.length ? settlements.map((settlement) => {
          const isDebtor = settlement.debtor.userId === session?.user.userId;
          const canPay = mode === 'pending' && isDebtor && settlement.status === 'PENDING';
          return (
            <View key={settlement.settlementId} style={styles.settlementCard}>
              <View style={styles.settlementTop}>
                <View style={styles.partyLine}>
                  <Avatar name={settlement.debtor.name} size={38} />
                  <AppText variant="small" style={styles.partyName}>{isDebtor ? 'You' : settlement.debtor.name}</AppText>
                </View>
                <AppText variant="caption" color={Palette.muted}>owes</AppText>
                <View style={styles.partyLine}>
                  <Avatar name={settlement.creditor.name} size={38} />
                  <AppText variant="small" style={styles.partyName}>{settlement.creditor.userId === session?.user.userId ? 'You' : settlement.creditor.name}</AppText>
                </View>
              </View>
              <View style={styles.settlementBottom}>
                <View><Money amount={settlement.amount} variant="section" /><AppText variant="caption" color={Palette.muted}>{settlement.status.toLowerCase()}</AppText></View>
                {canPay ? <PrimaryButton title={payingId === settlement.settlementId ? 'Saving…' : 'Mark paid'} onPress={() => void pay(settlement.settlementId)} disabled={payingId !== null} /> : <View style={[styles.statusBadge, settlement.status === 'PENDING' ? styles.pendingBadge : styles.paidBadge]}><AppText variant="caption" color={settlement.status === 'PENDING' ? Palette.orangeDark : Palette.green}>{settlement.status}</AppText></View>}
              </View>
            </View>
          );
        }) : !loading && !groupsLoading && groups.length > 0 ? <View style={styles.emptyState}><AppText variant="section">All settled up</AppText><AppText variant="small" color={Palette.muted}>There are no {mode === 'pending' ? 'pending' : ''} settlements for this group.</AppText></View> : null}
      </ScrollView>
    </ScreenFrame>
  );
}

