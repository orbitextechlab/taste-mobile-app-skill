// Kết thúc: Hero, the success moment. On arrival: one success haptic, the numeral settles (180 ms),
// the lane draws to its end (400 ms); nothing else moves. Then the figures, the consequence against
// the plan, the place chips and Lưu buổi chạy. Back returns to the paused run.
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BibNumeral } from '../../components/BibNumeral';
import { Divider } from '../../components/Divider';
import { FiguresRow } from '../../components/FiguresRow';
import { LaneLine } from '../../components/LaneLine';
import { PillButton } from '../../components/PillButton';
import { SectionLabel } from '../../components/SectionLabel';
import { StateMessage } from '../../components/StateMessage';
import { TopRow } from '../../components/TopRow';
import { resetRun, resumeRun, toRunInput, useLive } from '../../data/live';
import { sessionOn, usePlan } from '../../data/plan';
import { MIN_SAVE_M, averagePace, deleteRun, formatDayLong, formatDuration, formatKm, formatPace, formatPlanKm, formatTime, latestRun, rankedPlaces, saveRun, useRuns } from '../../data/runs';
import { showSnack } from '../../data/snackbar';
import { duration, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

const FALLBACK_PLACE = 'Chưa đặt tên';

export default function FinishScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const live = useLive();
  const plan = usePlan();
  useRuns();
  const tooShort = live.distanceM < MIN_SAVE_M;

  const places = rankedPlaces().slice(0, 4);
  const [place, setPlace] = useState(latestRun()?.place ?? places[0] ?? FALLBACK_PLACE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tooShort) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // The success moment plays once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startedAt = live.startedAt ? new Date(live.startedAt) : new Date();
  const session = plan.value ? sessionOn(plan.value, startedAt) : undefined;
  const planDiffM = session ? live.distanceM - session.km * 1000 : null;
  const consequence =
    session && planDiffM !== null
      ? planDiffM >= 0
        ? `Kế hoạch ${formatPlanKm(session.km)} km, đủ`
        : `Kế hoạch ${formatPlanKm(session.km)} km, còn thiếu ${formatKm(-planDiffM)} km`
      : 'Hôm nay không có trong kế hoạch';

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const run = await saveRun(toRunInput(live, place));
      resetRun();
      showSnack({ message: `Đã lưu ${formatKm(run.distanceM)} km, ${run.place}`, actionLabel: 'Hoàn tác', onAction: () => deleteRun(run.id) });
      router.navigate('/today');
    } catch {
      setError('Chưa lưu được. Thử lại.');
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    Alert.alert('Bỏ buổi chạy này?', `${formatKm(live.distanceM)} km sẽ không được lưu.`, [
      { text: 'Giữ lại', style: 'cancel' },
      {
        text: 'Bỏ',
        style: 'destructive',
        onPress: () => {
          resetRun();
          router.navigate('/today');
        },
      },
    ]);
  }

  function resume() {
    resumeRun();
    router.back();
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.accent }]}>
      <StatusBar style="light" />
      <TopRow onField leading={{ icon: 'chevron-back', label: 'Quay lại buổi chạy', onPress: () => router.back() }}>
        <Text style={[styles.topLabel, { color: c.onField }]}>Kết thúc</Text>
      </TopRow>

      {tooShort ? (
        <>
          <StateMessage onField message={`Chưa đủ ${MIN_SAVE_M} m để lưu. Tiếp tục chạy hoặc bỏ buổi này.`} />
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.s16) }]}>
            <PillButton label="Tiếp tục" variant="ink" onField size="control" onPress={resume} />
            <PillButton label="Bỏ buổi chạy" variant="text" onField onPress={discard} />
          </View>
        </>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.hero}>
              <Text style={[styles.date, { color: c.onField }]}>
                {formatDayLong(startedAt)}, {formatTime(startedAt)} đến {formatTime(new Date())}
              </Text>
              <BibNumeral value={formatKm(live.distanceM)} unit="km" color={c.fieldInk} unitColor={c.onField} settleOnMount />
              <LaneLine km={live.distanceM / 1000} color={c.onField} animate delayMs={duration.base} />
            </View>
            <View style={styles.figures}>
              <FiguresRow
                items={[
                  { value: formatPace(averagePace({ distanceM: live.distanceM, durationS: live.elapsedS })), label: 'mỗi km' },
                  { value: formatDuration(live.elapsedS), label: 'thời gian' },
                ]}
                color={c.onField}
                mutedColor={c.onField}
              />
              <Text style={[styles.consequence, { color: c.onField }]}>{consequence}</Text>
            </View>
            <Divider onField />
            <SectionLabel onField>Chạy ở đâu</SectionLabel>
            <View style={styles.chips} accessibilityRole="radiogroup">
              {(places.length > 0 ? places : [FALLBACK_PLACE]).map((p) => (
                <PillButton key={p} label={p} size="chip" variant={p === place ? 'ink' : 'outline'} onField onPress={() => setPlace(p)} accessibilityLabel={`${p}${p === place ? ', đang chọn' : ''}`} />
              ))}
            </View>
            {error ? (
              <Text style={[styles.error, { color: c.onField }]} accessibilityLiveRegion="polite">
                {error}
              </Text>
            ) : null}
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.s16) }]}>
            <PillButton label="Lưu buổi chạy" variant="ink" onField onPress={() => void save()} loading={saving} />
            <PillButton label="Bỏ buổi chạy" variant="text" onField onPress={discard} disabled={saving} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topLabel: { ...type.bodyLg, fontWeight: '600' },
  content: { paddingBottom: spacing.s24 },
  hero: { paddingHorizontal: spacing.s16, paddingTop: spacing.s32, paddingBottom: spacing.s24, gap: spacing.s8 },
  date: { ...type.body },
  figures: { paddingHorizontal: spacing.s16, paddingBottom: spacing.s24, gap: spacing.s12 },
  consequence: { ...type.body },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8, paddingHorizontal: spacing.s16 },
  error: { ...type.body, paddingHorizontal: spacing.s16, paddingTop: spacing.s16 },
  footer: { flexDirection: 'column', gap: spacing.s8, paddingHorizontal: spacing.s16, paddingTop: spacing.s8 },
});
