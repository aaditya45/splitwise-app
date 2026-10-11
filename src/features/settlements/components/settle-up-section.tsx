import { ActivityIndicator, Alert, Platform, Pressable, View } from 'react-native';

import { AppText, Avatar, Money } from '@/components/ui';
import { TruncatedText } from '@/components/ui/text';
import { settleUpStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import type { Settlement } from '@/features/settlements/types';

function sumAmounts(items: Settlement[]): number {
  const total = items.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  return Math.round(total * 100) / 100;
}

/** Tree connector: a vertical trunk that stops halfway on the last row, plus a short branch. */
function TreeGutter({ isLast }: { isLast: boolean }) {
  return (
    <View style={styles.gutter}>
      <View style={[styles.trunk, isLast ? { height: '50%' } : { bottom: 0 }]} />
      <View style={styles.branch} />
    </View>
  );
}

function CardHeader({ label, total, count, kind }: { label: string; total: number; count: number; kind: 'owed' | 'pay' }) {
  const color = kind === 'owed' ? Palette.green : Palette.orangeDark;
  return (
    <View style={styles.cardHeader}>
      <View style={styles.headerText}>
        <AppText variant="small" color={Palette.muted}>{label}</AppText>
        <Money amount={total} variant="section" color={color} />
      </View>
      <View style={[styles.countBadge, kind === 'owed' ? styles.owedBadge : styles.payBadge]}>
        <AppText variant="caption" color={color}>{count} {count === 1 ? 'person' : 'people'}</AppText>
      </View>
    </View>
  );
}

export function SettleUpSection({ toPay, toReceive, payingId, onPay }: {
  toPay: Settlement[];
  toReceive: Settlement[];
  payingId: number | null;
  onPay: (settlementId: number) => void;
}) {
  function confirmPay(item: Settlement) {
    if (Platform.OS === 'web') {
      onPay(item.settlementId);
      return;
    }
    Alert.alert(
      'Mark as paid?',
      `Confirm that you have paid ${item.creditor.name}. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, I paid', onPress: () => onPay(item.settlementId) },
      ],
    );
  }

  if (!toPay.length && !toReceive.length) {
    return (
      <View style={styles.emptyState}>
        <AppText variant="section">All settled up</AppText>
        <AppText variant="small" color={Palette.muted}>You have nothing to pay in this group.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {toPay.length ? (
        <View style={styles.card}>
          <CardHeader label="You need to pay" total={sumAmounts(toPay)} count={toPay.length} kind="pay" />
          {toPay.map((item, index) => {
            const busy = payingId === item.settlementId;
            return (
              <View key={item.settlementId} style={styles.treeRow}>
                <TreeGutter isLast={index === toPay.length - 1} />
                <Avatar name={item.creditor.name} size={36} />
                <View style={styles.rowText}>
                  <TruncatedText variant="small">Pay {item.creditor.name}</TruncatedText>
                  {/* <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Mark payment to ${item.creditor.name} as paid`}
                    disabled={payingId !== null}
                    onPress={() => confirmPay(item)}
                    style={({ pressed }) => [styles.payButton, payingId !== null && styles.payButtonDisabled, pressed && styles.pressed]}>
                    {busy ? <ActivityIndicator size="small" color={Palette.surface} /> : <AppText variant="caption" color={Palette.surface}>Mark as paid</AppText>}
                  </Pressable> */}
                </View>
                <Money amount={Number(item.amount)} variant="body" color={Palette.orangeDark} />
              </View>
            );
          })}
        </View>
      ) : null}

      {toReceive.length ? (
        <View style={styles.card}>
          <CardHeader label="You are owed" total={sumAmounts(toReceive)} count={toReceive.length} kind="owed" />
          {toReceive.map((item, index) => (
            <View key={item.settlementId} style={styles.treeRow}>
              <TreeGutter isLast={index === toReceive.length - 1} />
              <Avatar name={item.debtor.name} size={36} />
              <View style={styles.rowText}>
                <TruncatedText variant="small">{item.debtor.name} owes you</TruncatedText>
              </View>
              <Money amount={Number(item.amount)} variant="body" color={Palette.green} />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}