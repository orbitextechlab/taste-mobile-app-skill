# Example: running tracker (Chạy)

The output of one full run of `taste-mobile-app-skill` 0.3 in `--autonomous` mode on an empty repo, brief "a running tracker for amateur runners in Vietnam, one-handed, sweat on the screen", stack Expo, posture unified-brand, iOS and Android both first-class. Everything here was produced by the skill's phases in order (schema 3 from the start: motion system, Motion field per screen, demo beat sheet). The device pass has not run yet: Phase 7 was done from source, and the Phase 8 clip is pending.

## What is here

| Path | Phase | Content |
|---|---|---|
| `app/MOBILE-DESIGN.md` | 1 to 5, 7 | The locked direction **Số bib** (race bib × painted lane line): App Read with an Assumptions block, dials 7 / 6 / 3, four references extracted (Nike Run Club, Apple Fitness, Strava, the owner's reference image), visual DNA, composition system, motion system, Nav Read, a six-screen inventory with a Motion field per screen, flow decisions, the Visual QA contract, the demo beat sheet marked pending, one rule exception, and a change log that records what the build changed |
| `app/` | 6 | Expo SDK 57 + Expo Router 57 source: tokens, in-memory stores, components and all six inventory screens plus the not-found route |
| `screens/` | 7, 8 | Not created yet: the device pass adds it with the simulator screenshots and the demo preview (`demo.webp`) |

No question round: autonomous mode printed the three default assumptions (audience and cadence, mood, references) and continued. Three direction cards were proposed (Số bib, Nhựa đường as the category standard, Bảng kết quả); Số bib was chosen because the audience reads one number one-handed through sweat and the bib is the runner's own object.

## What the build covers

All six screens of the inventory:

- Tab roots: `Hôm nay` (Hero: today's planned km, or the run saved today, or the last run, as the one display numeral over the lane line; the single Bắt đầu chạy pill), `Lịch sử` (List grouped by week, distance tabular with pace and time under it), `Kế hoạch` (Dashboard: the week as a seven-column strip with done days filled, then the week's sessions as rows).
- The run is a two-step full-screen group on the red field: `Chạy` (Immersive: one km numeral in ink, elapsed and pace in the top row, Tạm dừng alone while running, Kết thúc only once paused) and `Kết thúc` (Hero, the success moment: haptic, the numeral settles, the lane draws; figures, the consequence against the plan, place chips, Lưu buổi chạy, Bỏ buổi chạy through a destructive alert; back returns to the paused run).
- `Chi tiết buổi chạy` under the native header: the distance numeral, pace and time, a per-km table with the fastest km in weight, Xóa buổi chạy through a destructive alert.

Shared primitives: the pill button (the track oval, with a 120 ms scale on press and a spring on release only), the bib numeral (display 96, weight 800, tabular, rolling 180 ms on change), the SVG lane line (a hairline with a tick per km that can draw itself in 400 ms), the figures row, the run row, the week strip, static skeletons, a centered state message, a snackbar with Hoàn tác.

Data lives in in-memory stores (`data/`): ten seeded runs from 20 September to 12 October 2026 at Saigon places (Công viên Gia Định, Phú Mỹ Hưng, Thảo Điền, Công viên Lê Văn Tám, Bờ kè Hoàng Sa, Khu đô thị Sala), each defined by its per-km splits so distance and duration are derived, with average paces between 5:46 and 6:05 per km. The week plan is a weekday template (T2 5 km, T3 6 km, T5 6 km, T7 10 km dài) applied to the current week. Each store hydrates asynchronously so the loading state is real; the error state is rendered when hydration throws and is reachable in code, not from the UI in this build.

**The live run is simulated.** The simulator has no GPS, so `data/live.ts` drives the run with a ticker: once a second the pace drifts inside 5:40 to 6:10 per km and the distance grows by that speed; splits are recorded at each km boundary; pause stops the ticker; a timer gap over five seconds (the app in the background) is reported as a stalled signal and accrues no distance. The numbers on screen are therefore real-looking and internally consistent, but they are not measured. `TIME_SCALE` (default 1, real time) exists so that a recording session can accrue a visible distance inside a 13 second take; a clip recorded that way must say so. A real build replaces the ticker with location updates and asks for the permission at the first Bắt đầu chạy, as the design file's flow decisions record. There is no keep-awake either, so the screen may sleep during a long simulated run.

## Motion system

Character `snap`. The signature motion lives on Kết thúc: on arrival, one success haptic, the distance numeral settles once (the same 180 ms roll it performed on every change during the run, now ending), then the lane line under it draws from start to end in 400 ms; the field, the figures, the place chips and the buttons are laid out before paint and never move. On Chạy the km numeral rolls when its decimal changes; elapsed time and pace swap every second with no animation. Enter is platform only everywhere; the saved day's cell on Kế hoạch and the number on Hôm nay change in place. Nothing enters, loops, bounces or counts up from zero; reduced motion collapses the roll to a swap and the draw to an instant line.

## Demo clip

The beat sheet in `app/MOBILE-DESIGN.md` §Demo: Hôm nay at its first viewport ("6" km, kế hoạch hôm nay, the lane with six ticks, the red pill), then Bắt đầu chạy → Chạy (the red field, "Đang bắt tín hiệu" for a second, then the numeral rolling) → Tạm dừng → Kết thúc, ending on the result state with the lane drawn and Lưu buổi chạy visible. Recorded: pending. The ticker runs at real time, so a 13 second take at `TIME_SCALE` 1 would end under 100 m and land on the "Chưa đủ 100 m" state; the recording session either raises `TIME_SCALE` and says so, or records a longer take.

## What Phase 7 found and fixed

Mechanical pass, from source: TypeScript clean after two type fixes (the shared tabular token was a readonly tuple that `TextStyle` rejects; `averagePace` was handed the live state, whose field is `elapsedS`). The `tells-mobile.md` grep block and the `stack-expo.md` block were both clean: five even font sizes (12, 14, 16, 24, 96), one radius token, five gap steps, no inline hex outside `theme/tokens.ts`, no magic insets, no em dashes, no emoji, no gradients, no `@react-navigation` imports, two `Alert.alert` calls (both destructive confirms with Cancel), three `.map` calls inside ScrollViews (all bounded: four place chips, seven plan days, a run's splits), `withSpring` only on press release. Layout mechanics walked per screen with file:line evidence in the session report.

Visual pass, from code (VQ1 to VQ12 and the first viewport test per screen), fix-once round: the paused footer on Chạy replaced the single Tạm dừng pill with two pills side by side, so the spot the thumb had just tapped became the seam between Tiếp tục and Kết thúc; it is now a column and Tiếp tục keeps the exact spot Tạm dừng had (VQ12). Hôm nay repeated the last run in a row when the hero already showed it (no plan, nothing today); the row is now hidden in that case (VQ4). An outline Bắt đầu chạy pill at the end of Kế hoạch was removed as a generic CTA ending (H10); the inventory names the session row as that screen's action.

Not verified without a device: every V-type answer (the first viewport of each tab root, the lane draw and the roll at real speed, the success haptic, the status bar on the red field, the Android ripple on the pills, the fullScreenModal top inset on both platforms, dark mode, large text at 1.3x on the numeral), `router.navigate('/today')` popping the run group after Lưu, the snackbar's Hoàn tác within its 5 s window, the stalled-signal line (needs backgrounding), and the error states (not reachable from the UI).

## Run it

```bash
cd app
npm install --no-audit --no-fund --legacy-peer-deps
npx expo start
```

Open in Expo Go on a device or simulator. If Metro reports a missing `babel-preset-expo`, add it as a devDependency; see `references/stack-expo.md` §2.
