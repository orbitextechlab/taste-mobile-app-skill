// Hôm nay: Hero. The plant that needs water is the whole first viewport (its field, the tilted silhouette,
// the name, the care line, Đã tưới). Everything due later is quiet rows below. Đã tưới is a state here,
// not a route: the silhouette settles, the line swaps, and one second later the field cross-fades to the
// next due plant so the second tap is ready.
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { GroupHeading } from '../../components/GroupHeading';
import { PlantField } from '../../components/PlantField';
import { PlantHero } from '../../components/PlantHero';
import { PlantRow } from '../../components/PlantRow';
import { SkeletonField, SkeletonRows } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import {
  clearPostpone,
  formatDay,
  isDue,
  isPostponed,
  postpone,
  retryHydrate,
  sortByUrgency,
  toDayKey,
  undoWater,
  usePlants,
  water,
  wateredToday,
  type Plant,
} from '../../data/plants';
import { showSnack } from '../../data/snackbar';
import { duration, fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

const HOLD_MS = 1000;

export default function TodayScreen() {
  const { status, plants } = usePlants();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { height: windowHeight } = useWindowDimensions();
  const heroHeight = Math.max(400, Math.round(windowHeight * 0.6));
  const now = new Date();

  // The plant that was just watered stays as the hero for a second before the next one takes over.
  const [held, setHeld] = useState<string | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  const due = sortByUrgency(plants.filter((p) => isDue(p, now)), now);
  const tonight = plants.filter((p) => isPostponed(p, now));
  const others = sortByUrgency(plants.filter((p) => !isDue(p, now) && !isPostponed(p, now)), now);
  const heldPlant = held ? plants.find((p) => p.id === held) : undefined;
  const hero: Plant | null = heldPlant ?? due[0] ?? others[0] ?? null;
  const notHero = (p: Plant) => p.id !== hero?.id;
  const alsoToday = due.filter(notHero);
  const upcoming = others.filter((p) => notHero(p) && !wateredToday(p, now));
  const doneToday = others.filter((p) => notHero(p) && wateredToday(p, now));

  const topLine = `${formatDay(toDayKey(now))} · ${due.length ? `${due.length} cây cần tưới` : 'không cần tưới'}`;

  async function confirm(plant: Plant) {
    setBusy(true);
    setError(null);
    // Hold the hero before the store changes: the store notifies synchronously, and without the hold
    // the next due plant would take over for one render and then hand back, cross-fading twice.
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setHeld(plant.id);
    try {
      await water(plant.id, new Date());
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `Đã tưới ${plant.name}`, actionLabel: 'Hoàn tác', onAction: () => undoWater(plant.id) });
      holdTimer.current = setTimeout(() => setHeld(null), reduceMotion ? duration.settle : HOLD_MS);
    } catch (e) {
      setHeld(null);
      setError(e instanceof Error ? e.message : 'Không ghi được lần tưới này');
    } finally {
      setBusy(false);
    }
  }

  function later(plant: Plant) {
    try {
      const { label } = postpone(plant.id, new Date());
      showSnack({ message: `${label}: ${plant.name}`, actionLabel: 'Hoàn tác', onAction: () => clearPostpone(plant.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không dời được lần tưới này');
    }
  }

  const rows = (list: Plant[]) =>
    list.map((p, i) => (
      <Animated.View key={p.id} layout={reduceMotion ? undefined : LinearTransition.duration(duration.slow)} exiting={reduceMotion ? undefined : FadeOut.duration(duration.fast)}>
        {i > 0 ? <Divider /> : null}
        <PlantRow plant={p} now={now} />
      </Animated.View>
    ));

  let body: React.ReactNode;
  if (status === 'error') {
    body = (
      <>
        <SkeletonField height={heroHeight} topInset={insets.top} />
        <EmptyState message="Không đọc được dữ liệu cây." actionLabel="Thử lại" onAction={retryHydrate} />
      </>
    );
  } else if (status !== 'ready') {
    body = (
      <>
        <SkeletonField height={heroHeight} topInset={insets.top} />
        <SkeletonRows count={3} />
      </>
    );
  } else if (!hero) {
    body = (
      <PlantField species={null} height={heroHeight}>
        <View style={[styles.emptyField, { paddingTop: insets.top + spacing.s16 }]}>
          <Text style={[styles.topLine, { color: c.textMuted }]}>{formatDay(toDayKey(now))}</Text>
          <Text style={[styles.emptyTitle, { color: c.text }]} accessibilityRole="header">
            Chưa có cây nào.
          </Text>
          <Text style={[styles.emptyBody, { color: c.textMuted }]}>Thêm cây đầu tiên để Cây nhắc bạn tưới.</Text>
          <View style={styles.spacer} />
          <View style={styles.actions}>
            <Button label="Thêm cây" onPress={() => router.push('/add')} />
          </View>
        </View>
      </PlantField>
    );
  } else {
    body = (
      <>
        <LayoutAnimationConfig skipEntering>
          <View style={{ height: heroHeight }}>
            <Animated.View
              key={hero.id}
              entering={reduceMotion ? undefined : FadeIn.duration(duration.base)}
              exiting={reduceMotion ? undefined : FadeOut.duration(duration.base)}
              style={styles.heroLayer}
            >
              <PlantHero plant={hero} height={heroHeight} topInset={insets.top} topLine={topLine} onWater={() => confirm(hero)} onPostpone={() => later(hero)} busy={busy} error={error} now={now} />
            </Animated.View>
          </View>
        </LayoutAnimationConfig>
        {alsoToday.length ? (
          <>
            <GroupHeading>Cũng hôm nay</GroupHeading>
            {rows(alsoToday)}
          </>
        ) : null}
        {tonight.length ? (
          <>
            <GroupHeading>Tối nay</GroupHeading>
            {rows(tonight)}
          </>
        ) : null}
        {upcoming.length ? (
          <>
            <GroupHeading>Sắp tới</GroupHeading>
            {rows(upcoming)}
          </>
        ) : null}
        {doneToday.length ? (
          <>
            <GroupHeading muted>Đã tưới hôm nay</GroupHeading>
            {rows(doneToday)}
          </>
        ) : null}
      </>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="never">
        {body}
      </ScrollView>
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s24 },
  heroLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  emptyField: { flex: 1, paddingHorizontal: spacing.s20, paddingBottom: spacing.s24 },
  topLine: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '600', marginBottom: spacing.s8 },
  emptyTitle: { ...type.display, fontFamily: fontFamily.ui, fontWeight: '700' },
  emptyBody: { ...type.bodyLg, fontFamily: fontFamily.ui, marginTop: spacing.s8 },
  spacer: { flex: 1 },
  actions: { flexDirection: 'row' },
});
