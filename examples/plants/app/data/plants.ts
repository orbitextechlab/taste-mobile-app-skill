// In-memory plant store for the example. Shapes match what a local database would hold; there is no
// network layer, so the only rejections are validation ones and a missing plant. Screens subscribe
// with usePlants(), which also hydrates the store once (the place AsyncStorage or SQLite would load).
import { useEffect, useSyncExternalStore } from 'react';

export type SpeciesId = 'monstera' | 'pothos' | 'sansevieria' | 'cactus' | 'fig';

export type Species = { id: SpeciesId; label: string; amountMl: number; intervalDays: number };

export const species: Record<SpeciesId, Species> = {
  monstera: { id: 'monstera', label: 'Mon', amountMl: 650, intervalDays: 7 },
  pothos: { id: 'pothos', label: 'Trầu bà', amountMl: 300, intervalDays: 5 },
  sansevieria: { id: 'sansevieria', label: 'Lưỡi hổ', amountMl: 200, intervalDays: 14 },
  cactus: { id: 'cactus', label: 'Xương rồng', amountMl: 100, intervalDays: 21 },
  fig: { id: 'fig', label: 'Bàng Singapore', amountMl: 800, intervalDays: 7 },
};

export const speciesList: Species[] = [species.monstera, species.pothos, species.sansevieria, species.cactus, species.fig];

export const locations = ['Ban công', 'Bệ cửa sổ', 'Phòng khách', 'Bàn làm việc'] as const;
export type Location = (typeof locations)[number];

export type WateringEntry = { at: string; amountMl: number };

export type Plant = {
  id: string;
  name: string;
  species: SpeciesId;
  location: Location;
  intervalDays: number;
  amountMl: number;
  /** Local calendar day, YYYY-MM-DD. */
  lastWatered: string;
  /** ISO datetime; while now is before it the plant is not due even if its date has passed. */
  postponedUntil?: string;
  log: WateringEntry[];
};

export type PlantInput = { name: string; species: SpeciesId; location: Location; intervalDays: number };

// Seeds: eight plants in a Saigon apartment, last watered in early October 2026. On 2026-10-13 two are
// due (Mon lá xẻ, Trầu bà vàng); the rest fall across the next ten days.
const seeds: Plant[] = [
  plant('p1', 'Mon lá xẻ', 'monstera', 'Phòng khách', 7, 650, '2026-10-06', ['2026-09-29', '2026-09-22']),
  plant('p2', 'Trầu bà vàng', 'pothos', 'Bệ cửa sổ', 5, 300, '2026-10-08', ['2026-10-03', '2026-09-28']),
  plant('p3', 'Mon Thái', 'monstera', 'Ban công', 7, 500, '2026-10-07', ['2026-09-30', '2026-09-23']),
  plant('p4', 'Lưỡi hổ mini', 'sansevieria', 'Bàn làm việc', 14, 150, '2026-10-01', ['2026-09-17']),
  plant('p5', 'Bàng Singapore', 'fig', 'Phòng khách', 7, 800, '2026-10-09', ['2026-10-02', '2026-09-25']),
  plant('p6', 'Trầu bà đế vương', 'pothos', 'Ban công', 6, 400, '2026-10-10', ['2026-10-04', '2026-09-28']),
  plant('p7', 'Lưỡi hổ', 'sansevieria', 'Bệ cửa sổ', 14, 200, '2026-10-04', ['2026-09-20']),
  plant('p8', 'Xương rồng tai thỏ', 'cactus', 'Ban công', 21, 100, '2026-10-02', ['2026-09-11']),
];

function plant(id: string, name: string, sp: SpeciesId, location: Location, intervalDays: number, amountMl: number, lastWatered: string, earlier: string[]): Plant {
  return {
    id,
    name,
    species: sp,
    location,
    intervalDays,
    amountMl,
    lastWatered,
    log: [lastWatered, ...earlier].map((day) => ({ at: `${day}T07:30:00+07:00`, amountMl })),
  };
}

// ---- store -------------------------------------------------------------------------------------

type Status = 'idle' | 'loading' | 'ready' | 'error';
let status: Status = 'idle';
let plants: Plant[] = [];
let version = 0;
const listeners = new Set<() => void>();
const undoSnapshots = new Map<string, Pick<Plant, 'lastWatered' | 'postponedUntil' | 'log'>>();

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Loads the seeds once. Rejects when a record is malformed, which is the error path the screens show. */
export function hydrate(): Promise<void> {
  if (status === 'ready' || status === 'loading') return Promise.resolve();
  status = 'loading';
  emit();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bad = seeds.find((p) => !DAY_KEY.test(p.lastWatered) || p.intervalDays < 1 || p.amountMl < 1);
      if (bad) {
        status = 'error';
        emit();
        reject(new Error(`Dữ liệu cây ${bad.name} không hợp lệ`));
        return;
      }
      plants = seeds.map((p) => ({ ...p, log: [...p.log] }));
      status = 'ready';
      emit();
      resolve();
    }, 0);
  });
}

export function retryHydrate() {
  status = 'idle';
  void hydrate().catch(() => undefined);
}

export function getStatus(): Status {
  return status;
}

export function listPlants(): Plant[] {
  return plants.map((p) => ({ ...p }));
}

export function getPlant(id: string): Plant | undefined {
  const p = plants.find((x) => x.id === id);
  return p ? { ...p, log: [...p.log] } : undefined;
}

function find(id: string): Plant {
  const p = plants.find((x) => x.id === id);
  if (!p) throw new Error('Không tìm thấy cây này');
  return p;
}

export function validatePlant(input: Partial<PlantInput>): Partial<Record<keyof PlantInput, string>> {
  const errors: Partial<Record<keyof PlantInput, string>> = {};
  if (!input.name || !input.name.trim()) errors.name = 'Nhập tên cây';
  if (!input.species) errors.species = 'Chọn loại cây';
  if (!input.location) errors.location = 'Chọn vị trí';
  if (!input.intervalDays || input.intervalDays < 1 || input.intervalDays > 90) errors.intervalDays = 'Khoảng cách tưới từ 1 đến 90 ngày';
  return errors;
}

/** A new plant counts as watered today, so its first due date is today + interval. */
export async function addPlant(input: PlantInput, now = new Date()): Promise<Plant> {
  const errors = validatePlant(input);
  if (Object.keys(errors).length) throw Object.assign(new Error('invalid'), { errors });
  const p: Plant = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(),
    species: input.species,
    location: input.location,
    intervalDays: input.intervalDays,
    amountMl: species[input.species].amountMl,
    lastWatered: toDayKey(now),
    log: [],
  };
  plants.push(p);
  emit();
  return { ...p };
}

export async function updatePlant(id: string, input: PlantInput): Promise<Plant> {
  const errors = validatePlant(input);
  if (Object.keys(errors).length) throw Object.assign(new Error('invalid'), { errors });
  const p = find(id);
  const speciesChanged = p.species !== input.species;
  p.name = input.name.trim();
  p.species = input.species;
  p.location = input.location;
  p.intervalDays = input.intervalDays;
  if (speciesChanged) p.amountMl = species[input.species].amountMl;
  emit();
  return { ...p };
}

/** Confirms a watering: today becomes the last watered day and the log gets a row. Undo restores the snapshot. */
export async function water(id: string, now = new Date()): Promise<Plant> {
  const p = find(id);
  undoSnapshots.set(id, { lastWatered: p.lastWatered, postponedUntil: p.postponedUntil, log: [...p.log] });
  p.lastWatered = toDayKey(now);
  p.postponedUntil = undefined;
  p.log = [{ at: now.toISOString(), amountMl: p.amountMl }, ...p.log];
  emit();
  return { ...p };
}

export function undoWater(id: string): boolean {
  const snap = undoSnapshots.get(id);
  const p = plants.find((x) => x.id === id);
  if (!snap || !p) return false;
  p.lastWatered = snap.lastWatered;
  p.postponedUntil = snap.postponedUntil;
  p.log = snap.log;
  undoSnapshots.delete(id);
  emit();
  return true;
}

/** Postpones a due plant to this evening (18:00), or to tomorrow morning when it is already evening. */
export function postpone(id: string, now = new Date()): { label: string } {
  const p = find(id);
  const target = postponeTarget(now);
  p.postponedUntil = target.at.toISOString();
  emit();
  return { label: target.label };
}

export function clearPostpone(id: string) {
  const p = plants.find((x) => x.id === id);
  if (!p) return;
  p.postponedUntil = undefined;
  emit();
}

export function postponeTarget(now = new Date()): { at: Date; label: string } {
  const evening = new Date(now);
  evening.setHours(18, 0, 0, 0);
  if (now < evening) return { at: evening, label: 'Để tối nay' };
  const morning = new Date(now);
  morning.setDate(morning.getDate() + 1);
  morning.setHours(7, 0, 0, 0);
  return { at: morning, label: 'Để mai' };
}

export function usePlants(): { status: Status; plants: Plant[] } {
  const v = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
  );
  useEffect(() => {
    if (status === 'idle') void hydrate().catch(() => undefined);
  }, [v]);
  return { status, plants: listPlants() };
}

// ---- schedule ----------------------------------------------------------------------------------

export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addDays(key: string, days: number): string {
  const d = fromDayKey(key);
  d.setDate(d.getDate() + days);
  return toDayKey(d);
}

export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((fromDayKey(toKey).getTime() - fromDayKey(fromKey).getTime()) / 86_400_000);
}

export function dueDay(p: Plant): string {
  return addDays(p.lastWatered, p.intervalDays);
}

/** Days from today to the due day: 0 today, negative when overdue. */
export function daysUntilDue(p: Plant, now = new Date()): number {
  return daysBetween(toDayKey(now), dueDay(p));
}

export function isPostponed(p: Plant, now = new Date()): boolean {
  return Boolean(p.postponedUntil) && now < new Date(p.postponedUntil as string);
}

export function isDue(p: Plant, now = new Date()): boolean {
  return daysUntilDue(p, now) <= 0 && !isPostponed(p, now);
}

export function wateredToday(p: Plant, now = new Date()): boolean {
  return p.lastWatered === toDayKey(now);
}

/** Due plants first by how overdue they are, then by name; used for the hero order on Hôm nay. */
export function sortByUrgency(list: Plant[], now = new Date()): Plant[] {
  return [...list].sort((a, b) => daysUntilDue(a, now) - daysUntilDue(b, now) || a.name.localeCompare(b.name, 'vi'));
}

export type ScheduleDay = { day: string; plants: Plant[] };

/** The next `days` days of waterings, projected forward from each plant's due day. Overdue plants land on today. */
export function schedule(list: Plant[], days = 14, now = new Date()): ScheduleDay[] {
  const today = toDayKey(now);
  const last = addDays(today, days - 1);
  const map = new Map<string, Plant[]>();
  for (const p of list) {
    let d = dueDay(p);
    if (d < today) d = today;
    while (d <= last) {
      map.set(d, [...(map.get(d) ?? []), p]);
      d = addDays(d, p.intervalDays);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, ps]) => ({ day, plants: ps.sort((a, b) => a.name.localeCompare(b.name, 'vi')) }));
}

// ---- copy --------------------------------------------------------------------------------------

const WEEKDAYS = ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy'];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "Thứ bảy 18/10" */
export function formatDay(key: string): string {
  const d = fromDayKey(key);
  return `${capitalize(WEEKDAYS[d.getDay()])} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** "Hôm nay, thứ ba 13/10" · "Mai, thứ tư 14/10" · "Thứ năm 16/10" */
export function formatDayHeading(key: string, now = new Date()): string {
  const diff = daysBetween(toDayKey(now), key);
  const day = formatDay(key);
  if (diff === 0) return `Hôm nay, ${day.toLowerCase()}`;
  if (diff === 1) return `Mai, ${day.toLowerCase()}`;
  return day;
}

export function formatMl(ml: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(ml)} ml`;
}

/** The care line on the field: "650 ml · đến hạn hôm nay" / "650 ml · quá hạn 2 ngày" / "650 ml · để tối nay" / "650 ml · còn 3 ngày" / "650 ml · Thứ ba 20/10". */
export function careLine(p: Plant, now = new Date()): string {
  const ml = formatMl(p.amountMl);
  if (wateredToday(p, now)) return `${ml} · ${formatDay(dueDay(p))}`;
  if (isPostponed(p, now)) return `${ml} · ${postponeTarget(now).label.toLowerCase()}`;
  const days = daysUntilDue(p, now);
  if (days === 0) return `${ml} · đến hạn hôm nay`;
  if (days < 0) return `${ml} · quá hạn ${-days} ngày`;
  return `${ml} · còn ${days} ngày`;
}

/** The row line under a plant's name: "Thứ bảy 18/10 · 200 ml", with "Hôm nay" when due. */
export function rowLine(p: Plant, now = new Date()): { date: string; due: boolean } {
  const days = daysUntilDue(p, now);
  if (isPostponed(p, now)) return { date: postponeTarget(now).label, due: false };
  if (days === 0) return { date: 'Hôm nay', due: true };
  if (days < 0) return { date: `Quá hạn ${-days} ngày`, due: true };
  return { date: formatDay(dueDay(p)), due: false };
}

export function formatLogDay(iso: string): string {
  const d = new Date(iso);
  return formatDay(toDayKey(d));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}
