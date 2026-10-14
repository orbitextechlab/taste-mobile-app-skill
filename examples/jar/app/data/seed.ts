// Three weeks of spends for a young office worker in Saigon, built relative to the device's current
// week so "this week" is always partially spent. This week's template is cut at today's weekday.
// Figures quoted in MOBILE-DESIGN.md (the beat sheet) are those of a Tuesday.
import { addDays, weekStart, weekdayIndex } from './format';

export type JarId = 'an-ngoai' | 'ca-phe' | 'di-lai' | 'khac';

export type Jar = { id: JarId; name: string; limit: number };

export type Spend = {
  id: string;
  jarId: JarId;
  amount: number;
  place: string;
  at: string;
};

export const seedJars: Jar[] = [
  { id: 'an-ngoai', name: 'Ăn ngoài', limit: 650_000 },
  { id: 'ca-phe', name: 'Cà phê', limit: 300_000 },
  { id: 'di-lai', name: 'Đi lại', limit: 300_000 },
  { id: 'khac', name: 'Khác', limit: 250_000 },
];

// [weekday 0..6, "HH:MM", place, jar, amount]
type Row = [number, string, string, JarId, number];

// Two weeks ago: 1.410.000 ₫
const twoWeeksAgo: Row[] = [
  [0, '07:40', 'Phúc Long', 'ca-phe', 45_000],
  [0, '12:05', 'Cơm tấm Phúc Lộc Thọ', 'an-ngoai', 55_000],
  [0, '18:35', 'Grab', 'di-lai', 40_000],
  [1, '08:00', 'Highlands', 'ca-phe', 49_000],
  [1, '12:15', 'Bún bò Gánh', 'an-ngoai', 65_000],
  [1, '18:20', 'Grab', 'di-lai', 38_000],
  [1, '19:40', 'Bách Hóa Xanh', 'khac', 130_000],
  [2, '07:50', 'Phúc Long', 'ca-phe', 55_000],
  [2, '12:30', 'Phở Hòa', 'an-ngoai', 75_000],
  [3, '08:05', 'Highlands', 'ca-phe', 49_000],
  [3, '12:10', 'Bún chả Hà Nội', 'an-ngoai', 60_000],
  [3, '18:25', 'Grab', 'di-lai', 35_000],
  [3, '20:00', 'Guardian', 'khac', 85_000],
  [4, '07:45', 'Cà phê Cộng', 'ca-phe', 39_000],
  [4, '19:30', 'Lẩu bò Sài Gòn', 'an-ngoai', 150_000],
  [4, '22:10', 'Grab', 'di-lai', 48_000],
  [5, '09:30', 'Highlands', 'ca-phe', 59_000],
  [5, '12:40', 'Cơm gà Hải Nam', 'an-ngoai', 85_000],
  [5, '16:00', 'Grab', 'di-lai', 60_000],
  [6, '10:15', 'Phúc Long', 'ca-phe', 45_000],
  [6, '17:20', 'Bách Hóa Xanh', 'khac', 110_000],
  [6, '19:05', 'Grab', 'di-lai', 33_000],
];

// Last week: 1.495.000 ₫; Monday and Tuesday total 593.000 ₫ (the comparison figure on a Tuesday)
const lastWeek: Row[] = [
  [0, '07:50', 'Highlands', 'ca-phe', 49_000],
  [0, '12:15', 'Bún bò Gánh', 'an-ngoai', 70_000],
  [0, '18:40', 'Grab', 'di-lai', 42_000],
  [0, '20:10', 'Bách Hóa Xanh', 'khac', 186_000],
  [1, '08:00', 'Phúc Long', 'ca-phe', 55_000],
  [1, '12:30', 'Cơm tấm Phúc Lộc Thọ', 'an-ngoai', 65_000],
  [1, '18:20', 'Grab', 'di-lai', 36_000],
  [1, '19:30', 'Pharmacity', 'khac', 90_000],
  [2, '07:55', 'Highlands', 'ca-phe', 49_000],
  [2, '12:20', 'Phở Hòa', 'an-ngoai', 75_000],
  [2, '18:30', 'Grab', 'di-lai', 40_000],
  [3, '08:10', 'Phúc Long', 'ca-phe', 45_000],
  [3, '12:05', 'Bún chả Hà Nội', 'an-ngoai', 60_000],
  [3, '18:15', 'Grab', 'di-lai', 35_000],
  [4, '08:00', 'Highlands', 'ca-phe', 59_000],
  [4, '19:20', 'Lẩu bò Sài Gòn', 'an-ngoai', 120_000],
  [4, '22:00', 'Grab', 'di-lai', 45_000],
  [5, '09:40', 'Cà phê Cộng', 'ca-phe', 39_000],
  [5, '13:00', "Pizza 4P's", 'an-ngoai', 165_000],
  [5, '16:30', 'Grab', 'di-lai', 55_000],
  [6, '10:00', 'Phúc Long', 'ca-phe', 45_000],
  [6, '17:45', 'Bách Hóa Xanh', 'khac', 70_000],
];

// This week, cut at today's weekday. Through Tuesday: 379.000 ₫ (cà phê 104.000 of 300.000).
const thisWeek: Row[] = [
  [0, '07:45', 'Phúc Long', 'ca-phe', 45_000],
  [0, '12:10', 'Bún bò Gánh', 'an-ngoai', 65_000],
  [0, '18:30', 'Grab', 'di-lai', 38_000],
  [0, '19:05', 'Bách Hóa Xanh', 'khac', 112_000],
  [1, '08:05', 'Highlands', 'ca-phe', 59_000],
  [1, '12:20', 'Cơm tấm Phúc Lộc Thọ', 'an-ngoai', 60_000],
  [2, '07:50', 'Phúc Long', 'ca-phe', 45_000],
  [2, '12:25', 'Phở Hòa', 'an-ngoai', 75_000],
  [2, '18:35', 'Grab', 'di-lai', 40_000],
  [3, '08:00', 'Highlands', 'ca-phe', 49_000],
  [3, '12:10', 'Bún chả Hà Nội', 'an-ngoai', 60_000],
  [3, '18:20', 'Grab', 'di-lai', 36_000],
  [4, '07:55', 'Phúc Long', 'ca-phe', 55_000],
  [4, '19:30', 'Lẩu bò Sài Gòn', 'an-ngoai', 140_000],
  [4, '22:05', 'Grab', 'di-lai', 42_000],
  [5, '09:30', 'Cà phê Cộng', 'ca-phe', 39_000],
  [5, '12:45', 'Cơm gà Hải Nam', 'an-ngoai', 85_000],
  [5, '16:10', 'Grab', 'di-lai', 50_000],
  [5, '18:00', 'Bách Hóa Xanh', 'khac', 95_000],
  [6, '10:20', 'Highlands', 'ca-phe', 49_000],
  [6, '19:00', 'Grab', 'di-lai', 35_000],
];

function materialize(rows: Row[], start: Date, prefix: string, cutWeekday?: number): Spend[] {
  return rows
    .filter(([weekday]) => cutWeekday === undefined || weekday <= cutWeekday)
    .map(([weekday, hhmm, place, jarId, amount], i) => {
      const [h, m] = hhmm.split(':').map(Number);
      const at = addDays(start, weekday);
      at.setHours(h, m, 0, 0);
      return { id: `${prefix}-${i + 1}`, jarId, amount, place, at: at.toISOString() };
    });
}

export function seedSpends(now = new Date()): Spend[] {
  const start = weekStart(now);
  return [
    ...materialize(twoWeeksAgo, addDays(start, -14), 'w2'),
    ...materialize(lastWeek, addDays(start, -7), 'w1'),
    ...materialize(thisWeek, start, 'w0', weekdayIndex(now)),
  ];
}
