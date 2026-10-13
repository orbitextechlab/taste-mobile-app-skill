// Chạy: Immersive. The red field is the screen; the km numeral in ink is the only thing to read; elapsed
// and pace sit in the top row; the one control in the thumb zone. Kết thúc appears only once paused,
// so one accidental tap during a run can at most pause it. Android back pauses instead of leaving.
import React, { useCallback, useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BibNumeral } from '../../components/BibNumeral';
import { PillButton } from '../../components/PillButton';
import { TopRow } from '../../components/TopRow';
import { pauseRun, resumeRun, startRun, useLive } from '../../data/live';
import { formatDuration, formatKm, formatPace } from '../../data/runs';
import { spacing, tabular, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function LiveScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const live = useLive();
  const active = live.status === 'running' || live.status === 'acquiring';

  // A cold deep link to /live starts a run; the normal path has already started it on Hôm nay.
  useEffect(() => {
    if (live.status === 'idle') startRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (active) pause();
        return true;
      });
      return () => sub.remove();
    }, [active]),
  );

  function pause() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pauseRun();
  }

  function resume() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resumeRun();
  }

  const stateLine = live.status === 'acquiring' ? 'Đang bắt tín hiệu' : live.status === 'paused' ? 'Đã tạm dừng' : 'Đang chạy';

  return (
    <View style={[styles.screen, { backgroundColor: c.accent }]}>
      <StatusBar style="light" />
      <TopRow onField>
        <Text style={[styles.figure, { color: c.onField }]} accessibilityLabel={`Thời gian ${formatDuration(live.elapsedS)}`}>
          {formatDuration(live.elapsedS)}
        </Text>
        <Text style={[styles.figure, { color: c.onField }]} accessibilityLabel={`Tốc độ ${formatPace(live.paceS)} mỗi km`}>
          {formatPace(live.paceS)} <Text style={styles.unit}>/km</Text>
        </Text>
      </TopRow>

      <View style={styles.body}>
        <Text style={[styles.state, { color: c.onField }]}>{stateLine}</Text>
        <BibNumeral value={formatKm(live.distanceM)} unit="km" color={c.fieldInk} unitColor={c.onField} roll muted={live.status === 'acquiring'} />
        {live.stalledS > 0 ? (
          <Text style={[styles.stalled, { color: c.onField }]} accessibilityLiveRegion="polite">
            Tín hiệu gián đoạn {live.stalledS} s, số đo giữ nguyên
          </Text>
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.s16) }]}>
        {live.status === 'paused' ? (
          <>
            <PillButton label="Kết thúc" variant="outline" onField size="control" onPress={() => router.push('/finish')} />
            <PillButton label="Tiếp tục" variant="ink" onField size="control" onPress={resume} />
          </>
        ) : (
          <PillButton label="Tạm dừng" variant="ink" onField size="control" onPress={pause} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  figure: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  unit: { fontWeight: '400' },
  body: { flex: 1, paddingHorizontal: spacing.s16, paddingTop: spacing.s48, gap: spacing.s8 },
  state: { ...type.body, fontWeight: '600' },
  stalled: { ...type.body, paddingTop: spacing.s16 },
  // A column: Tiếp tục takes the exact spot Tạm dừng had, so the thumb never lands on a different control; Kết thúc appears above it.
  footer: { flexDirection: 'column', gap: spacing.s12, paddingHorizontal: spacing.s16, paddingTop: spacing.s8 },
});
