# Example: plant care app (Cây)

The output of one full run of `taste-mobile-app-skill` 0.3 in `--autonomous` mode on an empty repo, brief "app chăm cây cho căn hộ" (a few plants on the balcony and the window sill, opened for a few seconds each morning to see what needs water and confirm it), stack Expo, posture unified-brand, schema 3 from the start. Everything here was produced by the skill's phases in order; nothing was hand-designed outside the process. The device pass is pending: Phase 7's visual answers are from code and the Phase 8 clip is not recorded yet.

## What is here

| Path | Phase | Content |
|---|---|---|
| `app/MOBILE-DESIGN.md` | 1 to 5, 7 | The locked direction **Bao hạt giống** (balcony at seven in the morning × seed packet): schema 3 front matter with the five species fields and inks, four reference extractions (Planta, Apple Reminders, Google Keep, the owner's reference image), visual DNA, composition system, motion system, Nav Read, a six-screen inventory with a Motion field per screen, flow decisions, the Visual QA contract, the demo beat sheet marked pending, and a change log that records what the fix-once round changed and why |
| `app/` | 6 | Expo SDK 57 + Expo Router 57 source: tokens, an in-memory plant store with eight seeded plants, the five SVG silhouettes, components and all six inventory screens |
| `screens/` | 7, 8 | Not yet present: the device pass adds simulator screenshots and the demo preview (`demo.webp`) here |

No question round was held (autonomous mode); the Assumptions block is at the top of the design file. Three direction cards were drawn (Sổ tưới, Bao hạt giống, Nhãn vườn); Bao hạt giống was chosen because the audience's task is a two-second glance and a full-bleed species field answers it without reading.

## What the build covers

- Tab roots: `Hôm nay` (Hero: the plant that needs water as the whole first viewport, the rest as quiet rows), `Cây của tôi` (List grouped by location), `Lịch` (List, the next two weeks by day).
- `Chi tiết cây` (Hero): the same field under a transparent native header, the plant's facts as rows, the watering log; Đã tưới and Sửa.
- `Đã tưới` is a state on Hôm nay and Chi tiết cây, not a route: the success moment plays in place and Hoàn tác lives in a snackbar.
- `Thêm cây` (Focused Task, page sheet, also Sửa cây with `?id=`): the live preview field with the name typed on it, species chips with silhouettes, the interval stepper with the consequence line "Tưới lần tới: Thứ ba 20/10", location chips, a keyboard-sticky CTA, discard confirmation on a dirty draft.

Shared primitives: the species field (`PlantField`, with the settle and the fill swap), the hero band (`PlantHero`), the five silhouettes (`PlantSilhouette`, one or two SVG paths each, flat fill), the row with a naked silhouette glyph, the interval stepper with a Done bar on the iOS number pad, chips, a snackbar with Hoàn tác, skeletons laid out at content size. Data lives in an in-memory store (`data/plants.ts`) seeded with eight plants last watered in early October 2026, so on 2026-10-13 two are due (Mon lá xẻ, Trầu bà vàng); the seed dates are literal, so on a later day more plants read as overdue. There is no backend; every watering is real inside the session and gone on restart.

## Imagery

No photos and no network images. Each of the five species (monstera, pothos, sansevieria, cactus, fiddle-leaf fig) is a silhouette drawn for this app with `react-native-svg`, filled with the species ink on the species field and with the species field colour on neutral rows. The field and ink pairs are the identity: change the accent and the app is still recognisably itself.

## Motion system

Character `settle`. The signature motion is derived from the core moment, confirming a watering: a thirsty plant's silhouette is drawn tilted 6° and on Đã tưới it settles upright in 400 ms (decelerate, no overshoot) while the care line swaps "đến hạn hôm nay" for the next date in place; nothing else moves. One second later the field cross-fades to the next due plant so the second tap is ready. Enter is platform only on every screen (the hero does not settle on arrival, so the settle keeps its meaning). Rows move in place; the interval numeral and the consequence date swap in place; the preview swaps colour on a species change. One success haptic per watering. Nothing enters, loops, bounces or counts up.

## Demo clip

The beat sheet in `app/MOBILE-DESIGN.md` §Demo: Hôm nay at its first viewport (lime field, the monstera tilted, "Mon lá xẻ", "650 ml · đến hạn hôm nay"), tap Đã tưới (settle, line swap, snackbar), the field cross-fades to Trầu bà vàng, tap Đã tưới again, hold on the "không cần tưới" state with Mon Thái due tomorrow. Marked `recorded: pending`; record it with `xcrun simctl io recordVideo` as `references/demo-video.md` describes, keep the `.mp4` out of version control and put the preview at `screens/demo.webp`.

## What Phase 7 found and fixed (from code)

Mechanical pass: TypeScript clean; the tells grep block and the Expo grep block clean on triage (five even font sizes in the token file only, three radius tokens, four gap steps, no inline hex outside tokens, no magic insets, no springs, no loops, reduced motion honoured in every animated file); the layout-mechanics checklist walked with file:line evidence; the route tree matches the Nav Read.

Visual pass from code, fixed in one round: the Đã tưới button sat at the screen's midpoint with the field at 55%, so the field is 60%; Thêm cây had two display-size elements and its hero input below the location chips, so the name is heading size, the stepper follows the species chips, and a species sets the interval default; the declared preview colour swap was not built and now is; the Hôm nay row groups can reach four against a contract of two, so the limit is amended with its reason (the groups are the due list's states).

Not verified without a device: the settle and the cross-fade at real speed, the page sheet's top inset on iOS, the keyboard-sticky footer with the number pad open, dark mode, Android edge-to-edge, the snackbar's 5 s window. The controller session's device pass covers these.

## Run it

```bash
cd app
npm install --no-audit --no-fund --legacy-peer-deps
npx expo start
```

Open in Expo Go on a device or simulator. If Metro reports a missing `babel-preset-expo`, add it as a devDependency; see `references/stack-expo.md` §2.
