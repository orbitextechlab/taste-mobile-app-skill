---
# MOBILE-DESIGN.md
# Design source of truth for the running tracker "Chạy". Written by taste-mobile-app-skill 0.3.0
# in --autonomous mode (schema 3). Every field marked (inferred) was decided from the brief and
# the domain without a question round and may be corrected; a re-run refreshes this file and
# reports the delta instead of regenerating it. The device pass (Phase 7 on a simulator and the
# Phase 8 clip) is pending; see the change log.
version: 3
updated: 2026-10-13
stack: expo                      # given in the brief
platforms:
  ios: first-class
  android: first-class
  web: none
posture: unified-brand
dials:
  expression: 7   # the content is the brand (a full-bleed bib field, one display numeral); chrome stays native
  motion: 6       # numbers roll, one choreographed success moment, nothing enters or loops
  density: 3      # one number per viewport, 64 pt rows, display type generous; read with sweat on the screen

visual_identity:
  territory: "race bib × painted lane line"
  emotional_target: "momentum at the moment the run ends: the number stops and the line reaches its end"
  not: "a fitness dashboard (rings, stat tiles), a wellness app (soft gradients, encouragement copy)"

references:
  - source: "Nike Run Club (inferred, category standard)"
    principles:
      - type: hierarchy
        observation: "during a run one figure fills the screen; pace and time are caption-sized under it"
        principle: "one number dominates the live screen; everything else is a caption"
        application: "Chạy: the km numeral at display size, pace and time at body-lg in the top row"
      - type: interaction
        observation: "the pause control is one large target in the thumb zone; ending the run is a second, deliberate step"
        principle: "the only control during a run is the one the runner needs; ending is never one accidental tap"
        application: "Chạy: Tạm dừng alone while running; Kết thúc appears only once paused"
    do_not_copy: "the black screen with the volt accent, the hold-to-end gesture, the coach voice and the guided-run copy"
  - source: "Apple Fitness (inferred, category standard)"
    principles:
      - type: composition
        observation: "the rings appear on the summary only; every other screen is a grouped list with system type"
        principle: "the one chart lives on the summary; lists everywhere else"
        application: "the lane line is drawn on Hôm nay and Kết thúc; Lịch sử and Chi tiết are lists of tabular figures"
      - type: typography
        observation: "metrics are set in tabular rounded figures with the unit in a smaller weight beside them"
        principle: "numerals are the type system; units are quiet"
        application: "every distance, pace and time uses tabular figures; the unit beside a display numeral is heading size and muted, in rows it is body size and muted"
    do_not_copy: "the three colored rings, the award medals, the black summary surface"
  - source: "Strava (inferred, category standard)"
    principles:
      - type: content-density
        observation: "after a run the route map leads, then a splits table with one row per km and the pace as a bar"
        principle: "the route and the splits belong after the run, in a table, not during it"
        application: "Chi tiết buổi chạy: distance first, then a per-km table with pace and elapsed; nothing of this on Chạy"
      - type: surface
        observation: "the activity detail is an open canvas with hairline sections, not cards"
        principle: "one run is one object; sections are separated by space and hairlines"
        application: "Chi tiết and Kết thúc: open canvas, hairline between the figures and the splits"
    do_not_copy: "the orange brand, the map as the hero (there is no GPS here), segments, kudos, the social feed"
  - source: "Owner's reference image: a red full-bleed screen with 6.8 KM above a track outline and one Start button; an amber screen with 16 KM beside a ruler-like lane"
    principles:
      - type: color
        observation: "a single saturated field fills the screen; the numeral is set in black on it; white only for small labels"
        principle: "the surface is one color field from the domain, not a background with cards on it"
        application: "Chạy and Kết thúc are the bib-red field edge to edge; the numeral is ink, labels are white"
      - type: imagery
        observation: "the only drawing is a thin geometric line from the domain (a track outline, a ruler lane) directly under the number"
        principle: "one line drawing from the domain, under the number, is the whole illustration budget"
        application: "the lane line with km ticks, drawn with SVG, on Hôm nay and Kết thúc; no other illustration anywhere"
      - type: interaction
        observation: "one button on the start screen"
        principle: "the start screen has one decision"
        application: "Hôm nay has one filled pill, Bắt đầu chạy, in the thumb zone"
    do_not_copy: "the exact track-oval outline, the amber second screen (one field color in this app), KM in uppercase as a word"

visual_dna:
  composition: "Hero on Hôm nay, Kết thúc and Chi tiết (one display numeral over a line or a table); Immersive on Chạy (the field is the screen, one control); List on Lịch sử; Dashboard on Kế hoạch (the week strip is the headline module); leading axis everywhere, including the numeral, which sits left in the top third; single-message states are the only centered content"
  hierarchy: "level 1 by size and position (the display numeral, top third, leading); level 2 by weight (body-lg 600 figures); level 3 by muted color (labels, dates, places); never by boxes"
  typography: "system UI face (SF on iOS, Roboto on Android); no custom face; one display size 96 with weight 800 and tabular figures for the one number per screen; heading 24 for tab-root titles and for the unit beside the display numeral (weight 500, muted); units in rows at body size; sentence case everywhere, no uppercase"
  imagery: "no photos, no illustration; the lane line (a hairline with a tick per km) is the only drawing, on Hôm nay and Kết thúc; the week strip on Kế hoạch is type and hairlines"
  color: "white surface and ink text on every screen except Chạy and Kết thúc, which are the bib-red field edge to edge; on the field the numeral is ink (display size only, 4.0:1 is enough for 96 pt) and all small text is white; red appears off the field only on the Bắt đầu chạy pill and the today marker; red never encodes state, progress or error; danger is a separate dark red for the two destructive texts"
  surfaces: "open canvas; hairline dividers; zero cards; zero shadows; the field is a background, never a container"
  shapes: "radius 999 (the track oval) on the four run controls (Bắt đầu, Tạm dừng, Tiếp tục, Kết thúc) and on Lưu buổi chạy; 999 on place chips; 0 on everything else: the lane, the week strip, the rows; sheet is the platform default"
  iconography: "Ionicons outline, 24, in the tab bar and the two top-row buttons of the run group only; none in rows, none beside numbers"
  motion: "the km numeral rolls 180 ms on each change during a run; on Kết thúc the numeral settles once and the lane draws 400 ms; the Kế hoạch day cell fills in place after a save; nothing else moves; press feedback 120 ms"
  interaction: "tap only, large targets (64 pt run controls, 56 pt start pill, 64 pt rows); no swipe actions (sweat); Kết thúc only from the paused state; undo from the snackbar within 5 s after a save; one success haptic on arriving at Kết thúc; one light impact on pause and resume; Xóa and Bỏ buổi chạy through a destructive alert with Cancel"

composition:
  default_archetype: "hero"
  allowed: [hero, immersive, list, dashboard]
  prohibited: [editorial, feed, canvas, focused-task]   # no discovery content, no media feed, nothing composed freely, no form: the only input is a tap and a place chip
  repetition_limits: "0 cards on every screen; 1 section grammar per screen besides the figures row; 1 filled button per screen; 1 display numeral per screen; the lane line on Hôm nay and Kết thúc only"

motion_system:
  character: "snap"
  signature: "on Kết thúc the distance numeral stops rolling and settles on the final figure (180 ms), then the lane line under it draws from its start to its end in 400 ms; the field, the pace and time figures, the place chips and the buttons are laid out before paint and never move"
  moments:
    enter: "platform only on every screen; the run group arrives as a full-screen modal with its figures already laid out; on Kết thúc the settle-and-draw is the success moment, not an entrance"
    change: "on Chạy the km numeral rolls 180 ms when its one decimal changes; elapsed time and pace swap in place every second with no animation (linear real time); on Kế hoạch the saved day's cell fills in place; on Hôm nay the number swaps to the saved run in place"
    success: "Kết thúc, on arrival from Kết thúc on Chạy: one success haptic at 0 ms, the numeral settles 0 to 180 ms, the lane draws 180 to 580 ms, then still; Lưu buổi chạy is the next action, back returns to the paused run"
    gesture: "platform gestures only (back swipe on pushed screens); the run group has no swipe to dismiss; no swipe actions on rows"
  never: "entrance of rows or lists, loops (no pulsing Bắt đầu, no breathing timer), bounces on taps, the field color, the chrome, counters from zero on Hôm nay or Chi tiết, the lane on any screen but the two named"

colors:
  surface: "#FFFFFF"
  surface-alt: "#F2F1EC"   # source: Tyvek bib paper off-white; skeletons and hairline sections
  text: "#121212"          # source: the bib's black numerals
  text-muted: "#6B6964"
  accent: "#E3262C"        # source: the red field of a race bib (and the owner's reference screen); the field on Chạy and Kết thúc, the Bắt đầu pill, the today marker
  on-field: "#FFFFFF"      # small text and the lane on the red field
  danger: "#8E1B1F"        # Xóa buổi chạy and Bỏ buổi chạy text only; alerts are system
colors-dark:
  surface: "#121212"
  surface-alt: "#1E1D1A"
  text: "#F4F3EE"
  text-muted: "#A3A19B"
  accent: "#E3262C"        # the bib keeps its hue; the numeral on the field stays ink #121212
  on-field: "#FFFFFF"
  danger: "#F2B8B5"
type:
  ui-family: system
  display-family: none       # system face at weight 800, tabular figures, letter-spacing -2
  scale:
    caption: { size: 12, line: 16 }
    body:    { size: 14, line: 20 }
    body-lg: { size: 16, line: 22 }
    heading: { size: 24, line: 30 }
    display: { size: 96, line: 104 }
  dynamic-type: true         # the display numeral is capped at 1.3x so "12,4 km" still fits one line
spacing: [4, 8, 12, 16, 24, 32, 48, 64]
radius:
  control: 999               # the track oval: run controls, the start pill, place chips
  lane: 0                    # the lane, the week strip, rows
  sheet: platform
elevation:
  flat: 0
  raised: 0
  overlay: 0                 # no custom overlays; alerts are system
icons:
  family: ionicons
  weight: outline
motion:
  durations: { fast: 120, base: 180, slow: 400 }
  reduced-motion: honored
---

# Chạy design direction

## App Read

`APP READ: fitness tracker (running) for amateur runners in Vietnam who run at dawn or in the evening, one-handed, often with sweat on the screen; a glance during the run, a slow read after it. Plain momentum language, no coaching voice. Leaning Expo + native chrome with branded content. platforms: iOS first-class · Android first-class · web none. posture: unified-brand. inferred: audience level (recreational, 5 to 12 km, not racing), no existing brand, the three category references, the place of a run (chosen by the runner, since there is no GPS in this build), no account or sync in v1.`

Assumptions (autonomous mode, brief gate skipped):

1. The runner opens the app three or four times a week, for a minute before the run and a minute after; the live screen is looked at for one second at a time, so everything on it is readable at arm's length through sweat.
2. Mood: direct, bright, athletic, and not motivational. Each adjective is translated under Visual DNA; the adjectives decide nothing.
3. References: Nike Run Club for the live hierarchy, Apple Fitness for where charts live, Strava for what comes after the run, plus the owner's reference image. All four extracted below.

## Visual territory

`race bib × painted lane line`, because the bib is the one object every runner pins on and reads at a glance (a bright paper field, one black number, nothing else), and the painted lane line on a track is how distance is made visible without a chart: a line with marks. Not a fitness dashboard (no rings, no stat tiles, no streaks) and not a wellness app (no gradients, no encouragement copy, no mascots), because the runner wants the number, not a mood. Emotional target: momentum at the moment the run ends, when the number stops and the line reaches its end.

## Reference principles

**Nike Run Club** (category standard, inferred). During a run one figure fills the screen and pace and time sit under it at caption size; the pause control is one large target and ending the run is a second deliberate step. Applied to Chạy: the km numeral at display size, pace and elapsed at body-lg in the top row, Tạm dừng alone while running and Kết thúc only once paused. Not copied: the black screen with the volt accent, the hold-to-end gesture, the coach voice.

**Apple Fitness** (category standard, inferred). The rings appear on the summary only and every other screen is a list of tabular figures with quiet units. Applied as the rule that the lane line is drawn on Hôm nay and Kết thúc and nowhere else, and that every figure in the app is tabular with its unit at body size in muted color. Not copied: the rings, the medals, the black summary surface.

**Strava** (category standard, inferred). The route and the splits belong after the run, in a table with one row per km, on an open canvas with hairlines. Applied to Chi tiết buổi chạy: distance first, then the per-km table; nothing of this on the live screen. Not copied: the orange, the map as the hero (there is no GPS in this build), segments and kudos.

**The owner's reference image.** A single saturated field fills the screen, the numeral is black on it and only small labels are white; the only drawing is a thin geometric line from the domain under the number; the start screen has one button. Applied as the red field on Chạy and Kết thúc, the ink numeral with white labels, the lane line, and the single Bắt đầu chạy pill on Hôm nay. Not copied: the exact track-oval outline, the amber second screen (this app has one field color), "KM" as an uppercase word.

Where NRC (one number, nothing else) and Strava (splits) would meet on the same screen, NRC wins on Chạy and Strava wins on Chi tiết; no screen carries both.

## Visual DNA

### Composition
Hôm nay, Kết thúc and Chi tiết are Hero screens: one display numeral in the top third, leading, with a line or a table under it. Chạy is Immersive: the red field is the screen, the numeral is the content and the one control sits in the thumb zone. Lịch sử is a List grouped by week. Kế hoạch is a Dashboard whose headline module is the week strip (seven day columns, the planned figure in each, the done ones filled), followed by a plain list of sessions. The axis is leading everywhere, including the numeral, which is left-aligned so the eye reads number, unit, label in one pass; only the empty and error sentences are centered.

### Hierarchy
Level 1 is the display numeral by size and position. Level 2 is the figures row (pace, time) by weight at body-lg 600. Level 3 is the label line (date, place, plan) in muted color. Boxes never separate levels; space and hairlines do.

### Typography
System face. Weight 800 with tabular figures and letter-spacing minus two for the display numeral, so "12,4" and "5,8" occupy predictable width and a rolling digit never shifts its neighbours. Decimal comma and Vietnamese formatting throughout ("5,8 km", "5:48 /km", "1:02:14"). Heading 24 for the three tab-root titles and for the unit beside the display numeral (weight 500, muted, baseline-aligned), so the number and its unit read as one object; units in rows are body size. Nothing uppercase, no eyebrow labels.

### Imagery
No photos, no illustration. The lane line, a hairline with one tick per km and an end cap, drawn with SVG in the text color of its surface (ink on white, white on red), on Hôm nay and Kết thúc. The week strip on Kế hoạch is type and hairlines, not a chart.

### Surfaces
Open canvas. The red field on Chạy and Kết thúc is the surface itself, edge to edge under the status bar and the home indicator; nothing is drawn as a card on it. White everywhere else. Hairline dividers between rows. No shadows, no elevation, no custom overlays.

### Shapes
The pill (radius 999) is the track oval and marks the run controls: Bắt đầu chạy, Tạm dừng, Tiếp tục, Kết thúc, Lưu buổi chạy, and the place chips. Everything that comes from the lane world is square: the lane, the week strip, the rows, the skeletons. No universal radius.

### Iconography
Ionicons outline at 24, in the tab bar (three items) and the back and close buttons of the run group. None in rows, none beside numbers, no emoji.

### Motion
Press feedback 120 ms (scale 0.97). The km numeral rolls 180 ms when its displayed value changes during a run. On Kết thúc the numeral settles once and the lane draws over 400 ms. The saved day's cell on Kế hoạch and the number on Hôm nay change in place. Elapsed time and pace swap every second with no animation. Nothing enters, loops or bounces.

### Interaction
Tap only, large targets: 64 pt run controls, a 56 pt start pill, 64 pt rows, 44 pt icon buttons with hit slop. No swipe actions, because a sweaty thumb swipes by accident. Kết thúc is reachable only from the paused state. After Lưu, a snackbar with Hoàn tác stays 5 s on Hôm nay. One success haptic on arriving at Kết thúc; one light impact on Tạm dừng and Tiếp tục. Xóa buổi chạy (Chi tiết) and Bỏ buổi chạy (Kết thúc) open a system alert with a verb label and a Cancel.

## Composition system

Default archetype Hero. Allowed: Hero (Hôm nay, Kết thúc, Chi tiết), Immersive (Chạy), List (Lịch sử), Dashboard (Kế hoạch). Prohibited: Editorial and Feed (no discovery content, no media), Canvas (nothing is composed), Focused Task (the only input in the app is a tap and a place chip; a form would invent fields). Repetition limits: zero cards on every screen; one section grammar per screen besides the figures row; one filled button per screen; one display numeral per screen; the lane on Hôm nay and Kết thúc only. The three Hero screens differ in anchor treatment (planned number over a static lane; final number over a drawing lane on the field; a past number over a table) and in what follows the numeral.

First viewport commitments for the tab roots: Hôm nay anchors on the display numeral (today's planned km or the saved run), task "start the run", identity the ink numeral over the lane line, next the Bắt đầu chạy pill in the thumb zone. Lịch sử anchors on the first row of Tuần này, task "find a run", identity the tabular distance column with pace and time under it, next tap a row. Kế hoạch anchors on the week strip, task "see what is left this week", identity the strip with done days filled, next tap today's session.

## Motion system

The core moment is the end of a run: the runner taps Kết thúc and the number that has been moving for thirty minutes stops. On a track, what physically happens is that the runner crosses the line and the stopwatch stops; the distance is now a fixed figure painted on the lane. The signature motion borrows that behaviour: on Kết thúc the numeral settles once (180 ms, the same roll it performed on every change during the run, now ending), and the lane line under it draws from start to end in 400 ms. Nothing else on the screen moves: the field, the pace and time figures, the place chips and the buttons are laid out before paint. It derives from the Apple Fitness motion principle that the summary is where the one chart animates and from the reference image's single line under the number; not copied: the rings closing, the medal flip.

Character `snap`: fast, decelerating, a slight overshoot is allowed only on press release. A race bib does not bounce, and a runner's taps during a run are quick and repeated, so every feedback is 120 ms and every change is proportional to the change (one decimal rolling eight points, not the screen flashing).

Enter is platform only on every screen: the run group arrives as a full-screen modal with its figures already laid out, and Hôm nay's number is present at paint (M-AI-10: it never counts up). Change happens in place: the km numeral rolls when its decimal changes; elapsed time and pace swap every second with no animation because they track real time (linear by definition); on Kế hoạch the saved day's cell fills and on Hôm nay the number swaps to the saved run. Success is one event on one screen, Kết thúc, under 600 ms before it is still. Gestures are the platform's: back swipe on pushed screens; the run group cannot be swiped away; no swipe actions on rows. Nothing enters, loops (the start pill never pulses, the timer never breathes), bounces, or counts from zero; the field color and the chrome never animate; the lane never appears on a third screen.

## Direction: Số bib

**Idea.** The screen is the bib pinned on the runner's chest: one bright field, one black number, nothing to read but the distance; off the field, a white page with the same number over a lane line.

**Hierarchy.** The eye lands on the numeral, drops to the figures row (pace, time), then reads the muted label (date, place, plan). Labels never compete with values. The one filled pill is the only other object with weight.

**Imagery.** The lane line only, under the number on Hôm nay and Kết thúc. Nothing else.

## Signature

Dominant idea: the display numeral in ink over the lane line. Supporting behaviors: the red field (Chạy and Kết thúc are the field edge to edge) and the pill controls (the track oval). Signature screens: Hôm nay (tab root) and Kết thúc (the success moment), where numeral and lane appear together. Chạy carries the field and the numeral but no lane, so the live screen has nothing to read but the number. Quiet screens: Lịch sử, Chi tiết, Kế hoạch, where the numeral or the week strip is the dominant idea and there is no field and no lane.

## Chrome

Native tab bar (three destinations, Ionicons, tinted ink with red on the active item avoided: active is ink, inactive muted, so red stays on the field and the pill). Pushed screens (Chi tiết) use the native Stack header with the place as the title and the minimal back affordance. Tab roots hide the navigator header and set their own heading-size title inside the content, below the top inset, so the white canvas starts under the status bar. The run group is a full-screen modal (`fullScreenModal`) with the navigator header hidden: Chạy is Immersive and owns a top row inset by `insets.top` with the elapsed time and pace; Kết thúc owns the same top row with a back button that returns to the paused run. The modal covers the status bar on both platforms, so the top inset is applied there, unlike a page sheet. EXPRESSION 7 means the content is branded and the chrome is still the platform's: insets, 44 pt targets, the back gesture on pushed screens and reduced motion stay native.

## Copy voice

Short Vietnamese, present tense, no exclamation marks, no greeting. CTAs name the result: "Bắt đầu chạy", "Tạm dừng", "Tiếp tục", "Kết thúc", "Lưu buổi chạy", "Bỏ buổi chạy", "Hoàn tác", "Xóa buổi chạy". Consequence lines state figures: "Kế hoạch 6 km, còn thiếu 0,2 km", "Tuần này 5,2 / 27 km". The app never says "Chào mừng", "Tuyệt vời", "Cố lên", "Oops".

## Deliberately not doing

- The stat triplet and the rings (B8, dials.md fitness bias): no three equal tiles on Hôm nay, no ring anywhere; one number with its unit and one line.
- Red as progress or error (fitness bias "red for progress"): red is the field and the start pill; progress is the lane, errors are text.
- Centered composition on content screens (C-AI-04, H4): the numeral is left-aligned; only single-message states are centered.
- Cards per run on Lịch sử and per day on Kế hoạch (C-AI-02, H2): rows with hairlines and a seven-column strip.
- The map as the hero (Strava): there is no GPS in this build and a decorative map would be a lie.

## Alternatives considered

Nhựa đường (asphalt at dawn × stopwatch): the honest category standard, white grouped lists, tabular numerals, a dark asphalt live screen with white digits and a green accent from a shoe's reflective strip; rejected because its identity lived entirely in the live screen's dark surface, and off that screen it would survive an accent swap unchanged (I1). Bảng kết quả (race results board × stopwatch): EXPRESSION 5, DENSITY 5, splits tables as the hero of Lịch sử and Chi tiết, Hôm nay as a dense weekly table; rejected because the audience is amateur and one-handed with sweat on the screen, and a dense table is what they cannot read at arm's length.

## Nav Read

```
NAV READ
platforms: iOS first-class, Android first-class, web none
tabs (3): Hôm nay · Lịch sử · Kế hoạch
routes:
  (tabs)/today               tab root      → present (run) (full-screen group); push run/[id] from the last-run row
  (tabs)/history             tab root      → push run/[id]
  (tabs)/plan                tab root      → push run/[id] from a done session row
  run/[id]                   push          (Chi tiết buổi chạy: native header, title = place)
  (run)/live                 full-screen group step 1: the live run (Immersive); no swipe to dismiss (gestureEnabled false); Android back pauses instead of leaving
  (run)/finish               step 2: Kết thúc (Hero, the success moment); back returns to live, paused; Lưu dismisses the group to (tabs)/today
  +not-found                 explains the link and offers Về Hôm nay
entry points:
  (run)/live ← "Bắt đầu chạy" pill (Hôm nay); "Bắt đầu chạy" pill in the empty state of Lịch sử
  run/[id] ← last-run row (Hôm nay); any row (Lịch sử); a done session row (Kế hoạch)
sheets: none
modals: (run) group only; Kết thúc confirms Bỏ buổi chạy through a destructive alert; Chi tiết confirms Xóa buổi chạy through a destructive alert
full-screen groups: (run) two steps
deep links: /run/:id (a deleted id lands on the not-found explanation)
android back: default pop; (run)/live: back pauses the run instead of leaving (declared exception); (run)/finish: back pops to live, paused
max taps to any core screen: 1 (Bắt đầu chạy from Hôm nay); 2 (a run's splits from Lịch sử)
```

Three tabs, no settings tab, no profile: a single runner per device, nothing to configure in v1. The run is a full-screen group with two steps because it owns the screen for half an hour and ends with a decision; it is not a modal sheet, which could be swiped away by a wet thumb. There are no bottom sheets: the only choice in the app (the place) is a chip row on Kết thúc.

## Screen inventory

| Screen | Purpose | Archetype | Focal point | Hierarchy | Primary action | Signature | Motion | Content strategy | Surface strategy | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hôm nay (tabs)/today | see today's run and start it | Hero | the display numeral (today's planned km, or the run saved today), top third, leading | numeral + unit > lane line under it > label line (plan or the saved run's time and place) > Tuần này line and last-run row > Bắt đầu chạy | Bắt đầu chạy | ink numeral over the lane line; the red pill | pressed only; change: the number swaps to the saved run in place after Lưu | number-first | open canvas, hairline rows, no cards | L skeleton numeral and lane / E no plan today and no runs: "Chưa có buổi chạy nào" + Bắt đầu chạy / Err "Không đọc được dữ liệu" + Thử lại / P | n/a | none |
| Chạy (run)/live | run, glance, pause | Immersive | the km numeral in ink on the red field, top third, leading | numeral + km > top row elapsed and pace (white, body-lg tabular) > state line (Đang chạy, Đã tạm dừng) > Tạm dừng pill; when paused Kết thúc outlined above Tiếp tục filled, which takes the exact spot Tạm dừng had | Tạm dừng; Tiếp tục when paused | the red field with the ink numeral; no lane | enter: platform only; change: the km numeral rolls 180 ms when its decimal changes; elapsed and pace swap every second with no animation; the footer swaps in place on pause and Tiếp tục keeps Tạm dừng's spot, so nothing moves under the thumb | number-first | the field edge to edge; controls in the thumb zone inside the bottom inset | L first second "Đang bắt tín hiệu" with the numeral muted / E paused: "Đã tạm dừng" with Tiếp tục and Kết thúc / Err ticker stalled over 5 s: "Tín hiệu gián đoạn 12 s, số đo giữ nguyên" in place / P running | n/a | none in this build (location would be asked on the first Bắt đầu chạy with a pre-prompt; the simulator has no GPS, so the ticker is simulated) |
| Kết thúc (run)/finish | see the finished run and keep it | Hero | the final numeral in ink on the red field, top third, leading | numeral + km > lane line drawing to its end > figures row (pace, time) > consequence line against the plan > place chips > Lưu buổi chạy, Bỏ buổi chạy as text | Lưu buổi chạy | numeral over the lane on the field (the peak of the signature) | success: haptic at 0 ms, the numeral settles 0 to 180 ms, the lane draws 180 to 580 ms, then still; enter: platform only; nothing else moves | number-first | the field edge to edge; one filled pill; chips outlined white | L saving: the pill shows a spinner in place of its label / E under 100 m: "Chưa đủ 100 m để lưu" + Tiếp tục and Bỏ buổi chạy, no haptic, no lane / Err save failed: "Chưa lưu được" + Thử lại, the run kept / P | n/a | none |
| Lịch sử (tabs)/history | find a past run | List | the first row of Tuần này | week header > rows: weekday and date, place; distance tabular 600 right, pace and time muted under it | open a run | quiet | pressed only | list-first | grouped list by week, hairlines, no cards | L six skeleton rows / E "Chưa có buổi chạy nào" + Bắt đầu chạy / Err "Không đọc được dữ liệu" + Thử lại / P | n/a | none |
| Chi tiết buổi chạy run/[id] | read one run and its splits | Hero | the display numeral, top third, leading, under the native header | numeral + km > figures row (pace, time, date and start time) > Từng km table: km, pace, elapsed, the fastest row in weight > Xóa buổi chạy as danger text | none (reading); Xóa buổi chạy is secondary and destructive | quiet; the numeral without a lane | pressed only | number-first then table | open canvas, hairline table rows | L skeleton numeral and four rows / E run under 1 km: "Chưa đủ 1 km để tách từng km" / Err not found: "Không tìm thấy buổi chạy này" + Về Lịch sử / P | n/a | none |
| Kế hoạch (tabs)/plan | see this week's plan and what is done | Dashboard | the week strip (seven columns with the planned km, done days filled, today marked) | week strip with its total line "5,2 / 27 km" > session rows (day, distance, kind; done rows show the actual distance and push the run) > nothing else | open today's session (the row); start from the empty state | quiet; the strip is type and hairlines | pressed only; change: the saved day's cell fills in place after Lưu | number-first (the week) | open canvas; one headline module; a plain list | L skeleton strip and three rows / E no plan this week: "Tuần này chưa có kế hoạch" + Dùng kế hoạch 4 buổi / Err "Không đọc được dữ liệu" + Thử lại / P | n/a | none |

**Sameness check.** Six rows, four archetypes: Hero 3, Immersive 1, List 1, Dashboard 1. Hero covers three of six, exactly half and not more. The three Hero screens differ in anchor treatment (planned number over a static lane on white; final number over a drawing lane on the field; a past number over a splits table under a native header) and in what follows the numeral (a start pill; place chips and a save pill; a table and a destructive text). Passes screen-archetypes §3. `composition.allowed` confirmed as [hero, immersive, list, dashboard]; `prohibited` confirmed as [editorial, feed, canvas, focused-task]; no change from the Phase 4 draft.

**Forms (patterns §4b).** There is no form. The place on Kết thúc is a chip row with the last run's place preselected, so saving never requires a keyboard.

## Flow decisions

- Onboarding: zero slides. The first screen is Hôm nay with the week's plan and the Bắt đầu chạy pill; with no plan and no runs it shows the empty state and the same pill.
- Sign-in timing: none in v1; nothing leaves the device. If sync arrives later it is asked for after the first saved run, never before.
- Permissions: none in this build. The simulator has no GPS, so the live run is driven by a simulated ticker in `data/live.ts` (pace between 5:40 and 6:10 per km, distance accrues per second, splits recorded at each km). A real location permission would be asked on the first tap of Bắt đầu chạy with the pre-prompt "Để đo quãng đường, app cần vị trí khi đang chạy." and a decline path that starts a time-only run; this is recorded here so the next session builds it where the Nav Read says.
- Success moment: Kết thúc, on arrival: one success haptic, the numeral settles, the lane draws, under 600 ms. Nowhere else. Lưu buổi chạy posts a snackbar "Đã lưu 5,8 km · Thảo Điền · Hoàn tác" on Hôm nay for 5 s; Hoàn tác removes the run.
- Undo and delete: a saved run can be undone from the snackbar within 5 s and deleted from Chi tiết through a destructive alert (Xóa / Giữ lại). Bỏ buổi chạy on Kết thúc is a destructive alert (Bỏ / Giữ lại).
- Finish safety: Kết thúc is only reachable from the paused state, so one accidental tap during a run can at most pause it. Android back on Chạy pauses instead of leaving.
- Hôm nay logic: if a run was saved today, it is the number; otherwise today's planned session; otherwise the last run with its date. The plan is a weekday template applied to the current week (T2 5 km dễ, T3 6 km dễ, T5 6 km dễ, T7 10 km dài), so the week never goes stale.

## Visual QA contract

Phase 7 compares the build against these commitments; none may change without updating this file first.

- Archetype, focal point and signature per screen: as in the inventory. Signature screens are Hôm nay and Kết thúc (numeral over the lane). Chạy carries the field and the numeral, no lane. Lịch sử, Chi tiết and Kế hoạch have no field and no lane.
- Repetition limits: 0 cards on every screen; 1 filled pill per screen; 1 display numeral per screen; 1 section grammar per screen besides the figures row; the lane on exactly two screens.
- Identity element per tab root: Hôm nay the ink numeral over the lane; Lịch sử the tabular distance column with pace and time under it; Kế hoạch the week strip with done days filled.
- First viewport per tab root: Hôm nay anchor = the numeral, task = start the run, identity = numeral over the lane, next = Bắt đầu chạy. Lịch sử anchor = the first row of Tuần này, task = find a run, identity = the distance column, next = tap a row. Kế hoạch anchor = the week strip, task = see what is left, identity = the strip, next = tap today's session.
- Domain grounding per screen: km with a decimal comma, pace per km, elapsed time, places in Saigon, the week's plan in km, the splits per km.
- Posture proof (unified-brand): native JS tab bar, native Stack header on Chi tiết, system alerts for the two destructive confirmations, platform transitions everywhere; the same components on both platforms.
- Motion: character snap; the signature motion (settle then draw) on Kết thúc only; the km numeral rolls on Chạy only; the success moment plays once, on arriving at Kết thúc; nothing enters, loops or bounces; the Motion field per screen as in the inventory; reduced motion collapses the roll to a swap and the draw to an instant line.

## Demo

```
DEMO: Chạy · một buổi chạy từ Hôm nay đến Kết thúc · 13s
beat 1  0–3 s    identity   Hôm nay at its first viewport: "6" km with "Kế hoạch hôm nay, chạy dễ", the lane line with six ticks, the Tuần này line, the last-run row, the red Bắt đầu chạy pill; no touch
beat 2  3–10 s   the task   tap Bắt đầu chạy → Chạy (the red field, "Đang bắt tín hiệu" for one second, then the numeral rolls as the ticker accrues distance; elapsed and pace tick in the top row) → tap Tạm dừng ("Đã tạm dừng", Kết thúc appears above Tiếp tục, which keeps the spot Tạm dừng had) → tap Kết thúc
beat 3  last 3 s success    Kết thúc: the haptic, the numeral settles, the lane draws to its end in 400 ms; hold on the result state with the figures row, "Kế hoạch 6 km, còn thiếu …", the place chips and Lưu buổi chạy
signature visible at: beat 3, Kết thúc, at about 0:10
nothing else moves: the field, the top row, the place chips, the pill, the Bỏ buổi chạy text
data: the week plan (T3 6 km dễ) from data/plan.ts; the default place Công viên Gia Định (the latest seeded run, 12/10) from data/runs.ts; the ticker in data/live.ts
recorded: pending (no simulator in this session). The ticker runs at real time; data/live.ts exports TIME_SCALE (1) so the recording session can accrue a plausible distance inside a 13 s take and must say so in the delivery note.
```

## Rule exceptions

- Breaking `composition.md` §2 Immersive "a visible way out (X or Done)" on Chạy because an X on a live run is one wet tap away from losing thirty minutes; the way out is Tạm dừng then Kết thúc, and Android back pauses. Kết thúc has the back affordance.

## Change log

- 2026-10-13: created by taste-mobile-app-skill 0.3.0 in --autonomous mode (schema 3). Direction "Số bib" chosen over "Nhựa đường" and "Bảng kết quả" because the audience reads one number one-handed through sweat and the bib is the runner's own object. Phases 1 to 5 complete: App Read with assumptions, dials 7 / 6 / 3, four references extracted, territory, visual DNA, composition system, motion system (snap; settle then draw on Kết thúc), Nav Read, six-screen inventory with the Motion field, flow decisions, the Visual QA contract and the demo beat sheet.
- 2026-10-13: Phase 6 built all six screens from the inventory plus the not-found route. The live run is a simulated ticker (no GPS in the simulator); recorded under Flow decisions and in the README. Phase 7 mechanical pass: TypeScript clean after two type fixes (a readonly tabular token, the live state's elapsed field), both grep blocks clean (five even sizes, one radius token, five gap steps, no inline hex outside the tokens, two destructive alerts with Cancel, bounded maps only). Visual pass from code, fix-once round: the paused footer on Chạy became a column so Tiếp tục keeps the spot Tạm dừng had (VQ12, nothing moves under the thumb); Hôm nay no longer repeats the last run in a row when the hero already shows it (VQ4); the outline Bắt đầu chạy pill at the end of Kế hoạch was removed as a generic CTA ending (H10). The unit beside the display numeral was set at heading size during the build and the typography lines now say so. The device pass (simulator screenshots, VQ11 and VQ12 with timestamps, the Phase 8 clip) is pending for the controller session.
