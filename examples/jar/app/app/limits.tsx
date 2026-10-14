// Đặt hạn mức: Focused Task in a form sheet. Four stepper rows in 50.000 ₫ steps, the total as the live
// consequence, Lưu hạn mức at the bottom. No keyboard, no haptic: this is not the core task. Dismissing the
// sheet discards; Lưu applies and posts a snackbar on Hũ.
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LimitStepper } from '../components/LimitStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { listJars, setLimits, totalLimit, useBudget, type JarId } from '../data/budget';
import { showSnack } from '../data/snackbar';
import { formatVnd } from '../data/format';
import { spacing, tabular, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function LimitsSheet() {
  useBudget();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const jars = listJars();
  const [draft, setDraft] = useState<Record<JarId, number>>(() => Object.fromEntries(jars.map((j) => [j.id, j.limit])) as Record<JarId, number>);
  const [error, setError] = useState<string | null>(null);

  const current = totalLimit();
  const total = jars.reduce((sum, j) => sum + draft[j.id], 0);
  const dirty = jars.some((j) => draft[j.id] !== j.limit);
  const canSave = dirty && total > 0;

  function save() {
    try {
      const before = Object.fromEntries(jars.map((j) => [j.id, j.limit])) as Record<JarId, number>;
      setLimits(draft);
      showSnack({ message: `Đã lưu hạn mức tuần ${formatVnd(total)}`, actionLabel: 'Hoàn tác', onAction: () => setLimits(before) });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không lưu được hạn mức');
    }
  }

  return (
    <View style={[styles.sheet, { backgroundColor: c.surface }]}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.s16) }]} keyboardShouldPersistTaps="handled">
        <View style={styles.head}>
          <Text style={[styles.title, { color: c.text }]}>Đặt hạn mức tuần</Text>
          <Text style={[styles.hint, { color: c.textMuted }]}>Mỗi bước 50.000 ₫. Áp dụng từ tuần này.</Text>
        </View>
        <View style={styles.rows}>
          {jars.map((j) => (
            <LimitStepper key={j.id} name={j.name} value={draft[j.id]} onChange={(next) => setDraft((d) => ({ ...d, [j.id]: next }))} />
          ))}
        </View>
        <Text style={[styles.consequence, tabular, { color: total > 0 ? c.text : c.textMuted }]} accessibilityLiveRegion="polite">
          {total > 0 ? `Tổng tuần: ${formatVnd(total)}` : 'Tổng tuần: 0 ₫, chưa đặt hạn mức.'}
          {dirty && total > 0 && total !== current ? <Text style={{ color: c.textMuted }}>{`, hiện tại ${formatVnd(current)}`}</Text> : null}
        </Text>
        {error ? <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">{error}</Text> : null}
        <View style={styles.actions}>
          <PrimaryButton label="Lưu hạn mức" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1 },
  content: { padding: spacing.s16, paddingTop: spacing.s24, gap: spacing.s16 },
  head: { gap: spacing.s4 },
  title: { ...type.bodyLg, fontWeight: '600' },
  hint: { ...type.body },
  rows: { gap: spacing.s4 },
  consequence: { ...type.bodyLg, fontWeight: '600' },
  error: { ...type.body },
  actions: { flexDirection: 'row', paddingTop: spacing.s8 },
});
