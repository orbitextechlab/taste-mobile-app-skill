// Chi tiết chi tiêu: Focused Task under the native header. The spend is the object: its amount editable in
// place at display size, the jar as chips, the consequence after the edit, the note, the time row, then
// Lưu thay đổi and Xóa last in danger. Xóa asks first (an alert with Giữ lại), then offers Hoàn tác.
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmountField, MAX_AMOUNT } from '../../components/AmountField';
import { Chip } from '../../components/Chip';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { KeypadAccessory, useKeypadAccessoryId } from '../../components/KeypadAccessory';
import { PrimaryButton } from '../../components/PrimaryButton';
import { getJar, getSpend, listJars, removeSpend, restoreSpend, spentByJar, updateSpend, useBudget, type JarId, type Spend } from '../../data/budget';
import { showSnack } from '../../data/snackbar';
import { formatDateTime, formatVnd, groupDigits, weekStart } from '../../data/format';
import { radius, spacing, tabular, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function SpendDetail() {
  useBudget();
  const c = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const spend = getSpend(id);

  if (!spend) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <EmptyState message="Không tìm thấy khoản chi này. Có thể nó đã bị xóa." actionLabel="Về Lịch sử" onAction={() => router.replace('/history')} />
      </View>
    );
  }
  return <SpendEditor spend={spend} />;
}

function SpendEditor({ spend }: { spend: Spend }) {
  const keypadId = useKeypadAccessoryId();
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(spend.amount);
  const [jarId, setJarId] = useState<JarId>(spend.jarId);
  const [place, setPlace] = useState(spend.place);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  // Pop after the commit in which usePreventRemove already sees saving, so no discard alert fires on save or delete.
  useEffect(() => {
    if (closing) router.back();
  }, [closing, router]);

  const jars = listJars();
  const jar = getJar(jarId);
  const spent = spentByJar(weekStart(new Date()));
  // Remaining of the chosen jar as it stands, then after the edit (the original amount comes back to its jar).
  const remainingNow = jar ? jar.limit - spent[jar.id] : 0;
  const after = remainingNow + (jarId === spend.jarId ? spend.amount : 0) - amount;
  const dirty = amount !== spend.amount || jarId !== spend.jarId || place.trim() !== spend.place;
  const over = after < 0;
  const canSave = dirty && amount > 0 && !saving;

  usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert('Bỏ thay đổi?', 'Khoản chi giữ nguyên như trước.', [
      { text: 'Tiếp tục sửa', style: 'cancel' },
      { text: 'Bỏ thay đổi', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const consequence = !jar
    ? ''
    : !dirty || amount === 0
      ? `Hũ ${jar.name.toLowerCase()} còn ${formatVnd(remainingNow)} tuần này.`
      : over
        ? `Hũ ${jar.name.toLowerCase()}: ${groupDigits(remainingNow)} → ${formatVnd(after)} sau khi sửa, vượt hạn mức ${formatVnd(-after)}`
        : `Hũ ${jar.name.toLowerCase()}: ${groupDigits(remainingNow)} → ${formatVnd(after)} sau khi sửa`;

  function save() {
    const before = { jarId: spend.jarId, amount: spend.amount, place: spend.place };
    setSaving(true);
    setError(null);
    try {
      updateSpend(spend.id, { jarId, amount, place });
      showSnack({ message: `Đã sửa thành ${formatVnd(amount)}, hũ ${jar?.name ?? ''}`, actionLabel: 'Hoàn tác', onAction: () => updateSpend(spend.id, before) });
      setClosing(true);
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : 'Không lưu được thay đổi');
    }
  }

  function confirmDelete() {
    const original = getJar(spend.jarId);
    Alert.alert('Xóa khoản chi này?', `Hũ ${original?.name.toLowerCase() ?? ''} sẽ nhận lại ${formatVnd(spend.amount)}.`, [
      { text: 'Giữ lại', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setSaving(true);
          const removed = removeSpend(spend.id);
          if (removed) showSnack({ message: `Đã xóa ${formatVnd(removed.amount)}, ${removed.place || original?.name || ''}`, actionLabel: 'Hoàn tác', onAction: () => restoreSpend(removed) });
          setClosing(true);
        },
      },
    ]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <Stack.Screen options={{ title: spend.place || jar?.name || 'Khoản chi' }} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.s16) + spacing.s24 }]}
        bottomOffset={spacing.s24}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <AmountField value={amount} onChange={setAmount} accessoryId={keypadId} onTripleZero={() => setAmount((a) => (a > 0 && a * 1000 <= MAX_AMOUNT ? a * 1000 : a))} tone={over ? 'danger' : 'text'} />
        <View style={styles.chips}>
          {jars.map((j) => (
            <Chip key={j.id} label={j.name} selected={jarId === j.id} tone="accent" onPress={() => setJarId(j.id)} />
          ))}
        </View>
        <Text style={[styles.consequence, tabular, { color: over ? c.danger : dirty ? c.text : c.textMuted }]} accessibilityLiveRegion="polite">
          {consequence}
        </Text>

        <View style={styles.block}>
          <Text style={[styles.label, { color: c.textMuted }]}>Ghi chú</Text>
          <TextInput
            value={place}
            onChangeText={setPlace}
            placeholder="Highlands, Grab, cơm trưa"
            placeholderTextColor={c.textMuted}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="done"
            accessibilityLabel="Ghi chú"
            style={[styles.field, { color: c.text, borderColor: c.divider }]}
          />
        </View>

        <View style={styles.meta}>
          <Divider inset={false} />
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: c.textMuted }]}>Lúc</Text>
            <Text style={[styles.metaValue, tabular, { color: c.text }]}>{formatDateTime(spend.at)}</Text>
          </View>
          <Divider inset={false} />
        </View>

        {error ? (
          <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">
            {error}. Thay đổi vẫn được giữ, bấm Lưu thay đổi để thử lại.
          </Text>
        ) : null}
        <View style={styles.actions}>
          <PrimaryButton label="Lưu thay đổi" onPress={save} disabled={!canSave} loading={saving && !error} />
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="Xóa khoản chi" variant="danger" onPress={confirmDelete} disabled={saving} />
        </View>
      </KeyboardAwareScrollView>
      <KeypadAccessory id={keypadId} onTripleZero={() => setAmount((a) => (a > 0 && a * 1000 <= MAX_AMOUNT ? a * 1000 : a))} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.s16, gap: spacing.s16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  consequence: { ...type.body },
  block: { gap: spacing.s8, paddingTop: spacing.s8 },
  label: { ...type.caption },
  field: { ...type.bodyLg, minHeight: 52, paddingHorizontal: spacing.s16, borderWidth: 1, borderRadius: radius.control },
  meta: { paddingTop: spacing.s8 },
  metaRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.s16 },
  metaLabel: { ...type.body, width: 96 },
  metaValue: { ...type.body, flex: 1 },
  error: { ...type.body },
  actions: { flexDirection: 'row' },
});
