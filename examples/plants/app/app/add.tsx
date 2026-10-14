// Thêm cây (and Sửa cây with ?id=): Focused Task in a page sheet. The object is the live preview field
// with the name typed directly on it and the species chips that complete it; the interval stepper is the
// hero input with its consequence line (a species sets its default interval until the stepper is touched);
// location is the secondary field; the CTA rides the keyboard. A dirty draft confirms discard.
import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { DoneAccessory } from '../components/DoneAccessory';
import { EmptyState } from '../components/EmptyState';
import { GroupHeading } from '../components/GroupHeading';
import { IntervalStepper } from '../components/IntervalStepper';
import { ModalBar } from '../components/ModalBar';
import { PlantField, useSpeciesTone } from '../components/PlantField';
import { PlantSilhouette } from '../components/PlantSilhouette';
import { SwapText } from '../components/SwapText';
import {
  addDays,
  addPlant,
  daysBetween,
  formatDay,
  formatMl,
  getPlant,
  locations,
  species,
  speciesList,
  toDayKey,
  updatePlant,
  type Location,
  type PlantInput,
  type SpeciesId,
} from '../data/plants';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

const PREVIEW_HEIGHT = 200;
const DEFAULT_INTERVAL = 7;

export default function AddPlantScreen() {
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useMemo(() => (id ? getPlant(id) : undefined), [id]);
  const editing = Boolean(existing);

  const [name, setName] = useState(existing?.name ?? '');
  const [sp, setSp] = useState<SpeciesId | null>(existing?.species ?? null);
  const [location, setLocation] = useState<Location | null>(existing?.location ?? null);
  const [interval, setInterval] = useState(existing?.intervalDays ?? DEFAULT_INTERVAL);
  const [intervalTouched, setIntervalTouched] = useState(editing);
  const [errors, setErrors] = useState<Partial<Record<keyof PlantInput, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const tone = useSpeciesTone(sp);

  const dirty = editing
    ? name !== existing?.name || sp !== existing?.species || location !== existing?.location || interval !== existing?.intervalDays
    : name.length > 0 || sp !== null || location !== null || interval !== DEFAULT_INTERVAL;

  usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert(editing ? 'Bỏ thay đổi?' : 'Bỏ cây đang thêm?', 'Những gì bạn vừa nhập sẽ mất.', [
      { text: 'Tiếp tục', style: 'cancel' },
      { text: 'Bỏ', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const today = toDayKey(new Date());
  const nextDay = addDays(existing?.lastWatered ?? today, interval);
  const nextLine = daysBetween(today, nextDay) <= 0 ? 'Tưới lần tới: hôm nay' : `Tưới lần tới: ${formatDay(nextDay)}`;
  const amountLine = sp ? `Mỗi ${interval} ngày · ${formatMl(existing && existing.species === sp ? existing.amountMl : species[sp].amountMl)}` : `Mỗi ${interval} ngày`;

  async function save() {
    setSaveError(null);
    const input = { name, species: sp ?? undefined, location: location ?? undefined, intervalDays: interval };
    try {
      setSaving(true);
      if (editing && existing) await updatePlant(existing.id, input as PlantInput);
      else await addPlant(input as PlantInput);
      router.back();
    } catch (e) {
      setSaving(false);
      const fieldErrors = (e as { errors?: Partial<Record<keyof PlantInput, string>> }).errors;
      if (fieldErrors) setErrors(fieldErrors);
      else setSaveError(e instanceof Error ? e.message : 'Không lưu được cây');
    }
  }

  if (id && !existing) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <ModalBar title="Sửa cây" onClose={() => router.back()} insetTop={Platform.OS !== 'ios'} />
        <EmptyState message="Không tìm thấy cây này." actionLabel="Đóng" onAction={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ModalBar title={editing ? 'Sửa cây' : 'Thêm cây'} onClose={() => router.back()} insetTop={Platform.OS !== 'ios'} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: touch.min + spacing.s48 + insets.bottom }]}
        bottomOffset={touch.min + spacing.s32}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <PlantField species={sp} height={PREVIEW_HEIGHT} silhouette={0.82}>
          <View style={styles.preview}>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
              }}
              placeholder="Tên cây"
              placeholderTextColor={c.textMuted}
              autoFocus
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="sentences"
              returnKeyType="done"
              maxLength={40}
              accessibilityLabel="Tên cây"
              style={[styles.nameInput, { color: tone.ink, borderBottomColor: errors.name ? c.danger : tone.ink }]}
            />
            <Text style={[styles.previewLine, { color: tone.ink }]}>{sp ? `${species[sp].label} · ${formatMl(existing && existing.species === sp ? existing.amountMl : species[sp].amountMl)}` : 'Chọn loại cây bên dưới'}</Text>
          </View>
        </PlantField>
        {errors.name ? <FieldError text={errors.name} /> : null}

        <GroupHeading>Loại cây</GroupHeading>
        <View style={styles.chips}>
          {speciesList.map((s) => (
            <Chip
              key={s.id}
              label={s.label}
              selected={sp === s.id}
              onPress={() => {
                void Haptics.selectionAsync();
                setSp(s.id);
                if (!intervalTouched) setInterval(s.intervalDays);
                setErrors((e) => ({ ...e, species: undefined }));
              }}
              leading={<PlantSilhouette species={s.id} size={touch.chipGlyph} color={c.species[s.id].field} />}
            />
          ))}
        </View>
        {errors.species ? <FieldError text={errors.species} /> : null}

        <GroupHeading>Tưới mỗi</GroupHeading>
        <View style={styles.stepper}>
          <IntervalStepper
            value={interval}
            onChange={(n) => {
              setIntervalTouched(true);
              setInterval(n);
            }}
          />
          <SwapText style={[styles.consequence, { color: c.text }]} accessibilityLiveRegion="polite">
            {nextLine}
          </SwapText>
          <Text style={[styles.amount, { color: c.textMuted }]}>{amountLine}</Text>
          {errors.intervalDays ? <FieldError text={errors.intervalDays} inset={false} /> : null}
        </View>

        <GroupHeading>Vị trí</GroupHeading>
        <View style={styles.chips}>
          {locations.map((l) => (
            <Chip
              key={l}
              label={l}
              selected={location === l}
              onPress={() => {
                setLocation(l);
                setErrors((e) => ({ ...e, location: undefined }));
              }}
            />
          ))}
        </View>
        {errors.location ? <FieldError text={errors.location} /> : null}
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, backgroundColor: c.surface, borderTopColor: c.divider }]}>
          {saveError ? (
            <Text style={[styles.saveError, { color: c.danger }]} accessibilityLiveRegion="assertive">
              {saveError}. Những gì bạn nhập vẫn còn, bấm lại để thử.
            </Text>
          ) : null}
          <Button label={editing ? 'Lưu' : 'Thêm cây'} onPress={save} loading={saving} grow />
        </View>
      </KeyboardStickyView>
      <DoneAccessory />
    </View>
  );
}

function FieldError({ text, inset = true }: { text: string; inset?: boolean }) {
  const c = useTheme();
  return (
    <Text style={[styles.fieldError, inset && { paddingHorizontal: spacing.s20 }, { color: c.danger }]} accessibilityLiveRegion="polite">
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {},
  preview: { flex: 1, paddingHorizontal: spacing.s20, paddingTop: spacing.s20, justifyContent: 'flex-end', paddingBottom: spacing.s20 },
  nameInput: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '700', maxWidth: '78%', padding: 0, borderBottomWidth: 2 },
  previewLine: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600', opacity: 0.72, marginTop: spacing.s8, fontVariant: ['tabular-nums'] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8, paddingHorizontal: spacing.s20 },
  stepper: { paddingHorizontal: spacing.s20, gap: spacing.s12 },
  consequence: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600', fontVariant: ['tabular-nums'] },
  amount: { ...type.body, fontFamily: fontFamily.ui, fontVariant: ['tabular-nums'], marginTop: -spacing.s8 },
  fieldError: { ...type.body, fontFamily: fontFamily.ui, paddingTop: spacing.s8 },
  footer: { paddingHorizontal: spacing.s20, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.s8 },
  saveError: { ...type.body, fontFamily: fontFamily.ui },
});
