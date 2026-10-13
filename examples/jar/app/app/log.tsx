// Ghi chi tiêu: Focused Task on a page sheet. The amount is the hero, typed on the number pad already open;
// the jar is four chips; the consequence line names the jar and its new remaining; recent places and the note
// fill the space down to Lưu in a keyboard-sticky footer. Lưu is the one success moment: haptic, dismiss, then
// the jar settles on Tuần này (the commit waits for the sheet to land) and a snackbar offers Hoàn tác.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AmountField, MAX_AMOUNT } from '../components/AmountField';
import { Chip } from '../components/Chip';
import { KeypadAccessory, useKeypadAccessoryId } from '../components/KeypadAccessory';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { addSpend, getJar, listJars, recentPlaces, removeSpend, spentByJar, useBudget, validateSpend, type JarId, type SpendInput } from '../data/budget';
import { showSnack } from '../data/snackbar';
import { daysLeftInWeek, formatVnd, groupDigits, weekStart } from '../data/format';
import { duration, radius, spacing, tabular, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function LogScreen() {
  const keypadId = useKeypadAccessoryId();
  useBudget();
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(0);
  const [jarId, setJarId] = useState<JarId | null>(null);
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef<{ input: SpendInput; jarName: string } | null>(null);
  // The footer's real height: button, its padding, and the bottom inset it adds [R-TZ3].
  const footerHeight = touch.min + spacing.s4 + spacing.s12 + Math.max(insets.bottom, spacing.s16);

  const now = new Date();
  const jars = listJars();
  const jar = jarId ? getJar(jarId) : undefined;
  const spent = spentByJar(weekStart(now));
  const remaining = jar ? jar.limit - spent[jar.id] : 0;
  const after = remaining - amount;
  const daysLeft = daysLeftInWeek(now);
  const recent = useMemo(() => (jarId ? recentPlaces(jarId) : []), [jarId]);

  const dirty = amount > 0 || jarId !== null || place.length > 0;
  usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert('Bỏ khoản chi này?', 'Số tiền và ghi chú chưa lưu sẽ mất.', [
      { text: 'Tiếp tục', style: 'cancel' },
      { text: 'Bỏ', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const consequence = !jar
    ? amount > 0
      ? 'Chọn hũ để thấy còn lại bao nhiêu.'
      : 'Chọn hũ.'
    : amount === 0
      ? `Hũ ${jar.name.toLowerCase()} còn ${formatVnd(remaining)}.`
      : after >= 0
        ? `Hũ ${jar.name.toLowerCase()}: ${groupDigits(remaining)} → ${formatVnd(after)}, còn ${daysLeft} ngày`
        : `Hũ ${jar.name.toLowerCase()}: ${groupDigits(remaining)} → ${formatVnd(after)}, vượt hạn mức ${formatVnd(-after)}`;
  const over = Boolean(jar) && amount > 0 && after < 0;
  const canSave = amount > 0 && Boolean(jar) && !saving;

  function chooseJar(id: JarId) {
    setJarId(id);
    Haptics.selectionAsync();
  }

  function tripleZero() {
    setAmount((a) => (a > 0 && a * 1000 <= MAX_AMOUNT ? a * 1000 : a));
  }

  function save() {
    if (!jar) return;
    const input = { jarId: jar.id, amount, place };
    try {
      validateSpend(input);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không lưu được khoản chi');
      return;
    }
    setError(null);
    pending.current = { input, jarName: jar.name };
    setSaving(true);
    setClosing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // The dismiss runs after the commit in which usePreventRemove already sees saving, so no discard alert fires.
  // The sheet takes the platform's dismiss duration to land; the store changes after it so the coin level is
  // seen settling on Tuần này rather than behind the sheet. The timer touches the store only, never this screen.
  useEffect(() => {
    if (!closing || !pending.current) return;
    const { input, jarName } = pending.current;
    router.back();
    // Not cleared on unmount: the sheet unmounts as it lands and the commit must outlive it.
    setTimeout(() => {
      const spend = addSpend(input);
      showSnack({ message: `Đã ghi ${formatVnd(input.amount)}, hũ ${jarName}`, actionLabel: 'Hoàn tác', onAction: () => removeSpend(spend.id) });
    }, duration.dismiss);
  }, [closing, router]);

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      {/* Mounted before the amount field: an autofocused input looks its accessory view up on focus, and an
          accessory rendered after it is not registered yet, so iOS falls back to its own Done bar. */}
      <KeypadAccessory id={keypadId} onTripleZero={tripleZero} />
      <TopBar title="Ghi chi tiêu" onClose={() => router.back()} insetTop={Platform.OS !== 'ios'} />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerHeight + spacing.s16 }]}
        bottomOffset={footerHeight + spacing.s16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <AmountField value={amount} onChange={setAmount} onTripleZero={tripleZero} accessoryId={keypadId} autoFocus tone={over ? 'danger' : 'text'} />

        <View style={styles.chips}>
          {jars.map((j) => (
            <Chip key={j.id} label={j.name} selected={jarId === j.id} tone="accent" onPress={() => chooseJar(j.id)} />
          ))}
        </View>

        <Text style={[styles.consequence, tabular, { color: over ? c.danger : jar && amount > 0 ? c.text : c.textMuted }]} accessibilityLiveRegion="polite">
          {consequence}
        </Text>

        {recent.length > 0 ? (
          <View style={styles.block}>
            <Text style={[styles.label, { color: c.textMuted }]}>Gần đây</Text>
            <View style={styles.chips}>
              {recent.map((p) => (
                <Chip key={p} label={p} selected={place === p} onPress={() => setPlace(place === p ? '' : p)} />
              ))}
            </View>
          </View>
        ) : null}

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
            style={[styles.field, { color: c.text, borderColor: c.divider, backgroundColor: c.surface }]}
          />
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.s16), backgroundColor: c.surface, borderTopColor: c.divider }]}>
          {error ? (
            <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">
              {error}. Khoản chi vẫn được giữ, bấm Lưu để thử lại.
            </Text>
          ) : null}
          <PrimaryButton label="Lưu" onPress={save} disabled={!canSave} loading={saving} />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.s16, paddingTop: spacing.s8, gap: spacing.s16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  consequence: { ...type.body },
  block: { gap: spacing.s8, paddingTop: spacing.s8 },
  label: { ...type.caption },
  field: { ...type.bodyLg, minHeight: 52, paddingHorizontal: spacing.s16, borderWidth: 1, borderRadius: radius.control },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.s8 },
  error: { ...type.body },
});
