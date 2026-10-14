// Chi tiết cây: Hero. The same field as Hôm nay under a transparent native header (back and Sửa in the
// species ink), then the plant's facts as rows and the watering log. Đã tưới plays the same success
// moment here; the new log row enters in place.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, LayoutAnimationConfig, LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { GroupHeading } from '../../components/GroupHeading';
import { PlantHero } from '../../components/PlantHero';
import { SkeletonField } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import { clearPostpone, formatDay, formatLogDay, formatMl, formatTime, postpone, retryHydrate, undoWater, usePlants, water } from '../../data/plants';
import { showSnack } from '../../data/snackbar';
import { duration, fontFamily, spacing, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, plants } = usePlants();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const reduceMotion = useReducedMotion();
  const { height: windowHeight } = useWindowDimensions();
  const heroHeight = Math.max(400, Math.round(windowHeight * 0.6));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const now = new Date();
  const plant = plants.find((p) => p.id === id);
  const tone = plant ? c.species[plant.species] : null;

  async function confirm() {
    if (!plant) return;
    setBusy(true);
    setError(null);
    try {
      await water(plant.id, new Date());
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `Đã tưới ${plant.name}`, actionLabel: 'Hoàn tác', onAction: () => undoWater(plant.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không ghi được lần tưới này');
    } finally {
      setBusy(false);
    }
  }

  function later() {
    if (!plant) return;
    try {
      const { label } = postpone(plant.id, new Date());
      showSnack({ message: `${label}: ${plant.name}`, actionLabel: 'Hoàn tác', onAction: () => clearPostpone(plant.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không dời được lần tưới này');
    }
  }

  if (status === 'error') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState message="Không đọc được dữ liệu cây." actionLabel="Thử lại" onAction={retryHydrate} />
      </View>
    );
  }
  if (status !== 'ready') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: '', headerTransparent: true }} />
        <SkeletonField height={heroHeight} topInset={headerHeight} />
      </View>
    );
  }
  if (!plant || !tone) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState message="Không tìm thấy cây này. Có thể cây đã bị xóa." actionLabel="Về Cây của tôi" onAction={() => router.replace('/plants')} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerTintColor: tone.ink,
          headerRight: () => (
            <Pressable
              onPress={() => router.push({ pathname: '/add', params: { id: plant.id } })}
              accessibilityRole="button"
              accessibilityLabel="Sửa cây"
              hitSlop={spacing.s8}
              style={({ pressed }) => [styles.headerAction, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[styles.headerActionLabel, { color: tone.ink }]}>Sửa</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.s48 }]} contentInsetAdjustmentBehavior="never">
        <PlantHero plant={plant} height={heroHeight} topInset={headerHeight} onWater={confirm} onPostpone={later} busy={busy} error={error} now={now} />
        <View style={styles.facts}>
          <Fact label="Vị trí" value={plant.location} />
          <Divider inset={false} />
          <Fact label="Tưới mỗi" value={`${plant.intervalDays} ngày · ${formatMl(plant.amountMl)}`} />
          <Divider inset={false} />
          <Fact label="Tưới lần cuối" value={formatDay(plant.lastWatered)} />
        </View>
        <GroupHeading>Nhật ký tưới</GroupHeading>
        {plant.log.length === 0 ? (
          <Text style={[styles.logEmpty, { color: c.textMuted }]}>Chưa có lần tưới nào được ghi.</Text>
        ) : (
          <LayoutAnimationConfig skipEntering>
            {plant.log.slice(0, 10).map((entry, i) => (
              <Animated.View
                key={entry.at}
                layout={reduceMotion ? undefined : LinearTransition.duration(duration.slow)}
                entering={reduceMotion ? undefined : FadeIn.duration(duration.base)}
              >
                {i > 0 ? <Divider inset={false} /> : null}
                <View style={styles.logRow}>
                  <Text style={[styles.logDay, { color: c.text }]}>{formatLogDay(entry.at)}</Text>
                  <Text style={[styles.logMeta, { color: c.textMuted }]}>{formatTime(entry.at)}</Text>
                  <Text style={[styles.logMl, { color: c.text }]}>{formatMl(entry.amountMl)}</Text>
                </View>
              </Animated.View>
            ))}
          </LayoutAnimationConfig>
        )}
      </ScrollView>
      <Snackbar bottom={Math.max(insets.bottom, spacing.s16)} />
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const c = useTheme();
  return (
    <View style={styles.fact}>
      <Text style={[styles.factLabel, { color: c.textMuted }]}>{label}</Text>
      <Text style={[styles.factValue, { color: c.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {},
  headerAction: { minHeight: touch.min, justifyContent: 'center', paddingHorizontal: spacing.s4 },
  headerActionLabel: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
  facts: { paddingHorizontal: spacing.s20, paddingTop: spacing.s8 },
  fact: { minHeight: touch.min + spacing.s8, flexDirection: 'row', alignItems: 'center', gap: spacing.s16 },
  factLabel: { ...type.body, fontFamily: fontFamily.ui, width: 112 },
  factValue: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '500', fontVariant: ['tabular-nums'], flex: 1 },
  logEmpty: { ...type.body, fontFamily: fontFamily.ui, paddingHorizontal: spacing.s20 },
  logRow: { minHeight: touch.min + spacing.s8, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s20 },
  logDay: { ...type.bodyLg, fontFamily: fontFamily.ui, fontVariant: ['tabular-nums'], flex: 1 },
  logMeta: { ...type.body, fontFamily: fontFamily.ui, fontVariant: ['tabular-nums'] },
  logMl: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '500', fontVariant: ['tabular-nums'], minWidth: 64, textAlign: 'right' },
});
