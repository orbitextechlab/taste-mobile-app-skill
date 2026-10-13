---
# MOBILE-DESIGN.md
# Design source of truth for Cây (house plant care). Written by taste-mobile-app-skill 0.3.0 in
# --autonomous mode on an empty repo; schema 3. Phases 0 to 7 complete from code; the device pass
# (Phase 7 on a simulator, Phase 8 demo clip) is pending. Fields marked (inferred) were assumed in
# the Assumptions block and may be corrected; a re-run refreshes this file and reports the delta.
version: 3
updated: 2026-10-13
stack: expo
platforms:
  ios: first-class
  android: first-class
  web: none
posture: unified-brand
dials:
  expression: 7   # the content layer is one full-bleed species-colored field with a silhouette; chrome stays native
  motion: 5       # one settling element (the leaf) on the success moment, rows move in place; nothing enters
  density: 3      # three to eight plants, one plant per viewport on Hôm nay, 64 pt rows, 20 pt gutters

visual_identity:
  territory: "balcony at seven in the morning × seed packet"
  emotional_target: "relief in two seconds: this one needs water, done"
  not: "a wellness app, a botanical encyclopedia"

references:
  - source: Planta
    principles:
      - type: imagery
        observation: "one plant per card; the plant's image fills it and the name sits on the image"
        principle: "the plant is the subject; chrome stays out of its way"
        application: "Hôm nay and Chi tiết cây: the plant's field is the first viewport, the name sits on it"
      - type: hierarchy
        observation: "under the name, one line of care data (water in n days) and one action"
        principle: "one plant, one fact, one action"
        application: "the care line '650 ml · đến hạn hôm nay' and the single Đã tưới button on the field"
    do_not_copy: "the photo card grid, the green brand, the plant database, the paywall"
  - source: Apple Reminders
    principles:
      - type: surface
        observation: "a due list is plain rows on an open canvas, grouped under a title, no cards"
        principle: "a to-do list is a list, not cards"
        application: "the Sắp tới rows under the field on Hôm nay; Cây của tôi; Lịch"
      - type: interaction
        observation: "completing is one tap on the row's leading control; the item stays briefly, then leaves; Undo is not a dialog"
        principle: "completion is one tap and reversible"
        application: "Đã tưới is one tap; the plant stays as the hero for a second, then the next due plant takes over; Hoàn tác in a snackbar"
    do_not_copy: "the circle checkbox, the colored list icon grid, smart lists"
  - source: Google Keep
    principles:
      - type: color
        observation: "a note's background color is a category label; text stays dark on it; the chrome is white"
        principle: "color is a label, not decoration; each hue means one thing"
        application: "each species owns one field color and one ink; location is a text label, never a color; the chrome is neutral"
      - type: composition
        observation: "text sits directly on the colored note with no inner container"
        principle: "type on color, no box"
        application: "name, care line and buttons sit directly on the species field"
    do_not_copy: "the masonry grid, the pastel palette, the note metaphor"
  - source: owner reference image (lime field with a monstera silhouette; cobalt variant with a potted plant)
    principles:
      - type: composition
        observation: "one full-bleed color field, one big silhouette, the name in large type, one data line, two actions"
        principle: "the plant that needs water is the whole screen; nothing competes"
        application: "the hero band on Hôm nay and Chi tiết cây"
      - type: imagery
        observation: "the silhouette is a darker tone of the field's own hue, flat, one shape"
        principle: "one hue per field, two tones: field and ink"
        application: "every species has a field and an ink; the silhouette, the name and the care line use the ink"
    do_not_copy: "the exact lime and cobalt values, the two buttons at equal weight, a blue field (blue is the water accent here)"

visual_dna:
  composition: "Hero on Hôm nay and Chi tiết cây (the species field takes the top 60% of the viewport, silhouette bottom-right, name top-left); Focused Task on Thêm cây (the live preview field is the object); List on Cây của tôi (grouped by location) and Lịch (grouped by day); leading axis; anchors sit top-left on the field"
  hierarchy: "level 1 the field color and the display name (color + size + position); level 2 the care line in ink at body-lg (weight 600); level 3 muted rows and captions (color); boxes never separate levels"
  typography: "system UI face (SF, Roboto); one display size (34) for the plant name on the field, the screen title on list roots and the interval numeral on Thêm cây; tabular figures for ml and dates; sentence case everywhere; no uppercase"
  imagery: "one flat SVG silhouette per species (monstera, pothos, sansevieria, cactus, fiddle-leaf fig), one or two paths, filled with the species ink; large and bleeding off the field's bottom-right on hero screens, 32 pt as a naked leading glyph on rows; no photos, no gradients, no emoji, no stock"
  color: "neutral surface and text; five species fields, each with its ink, used only as the plant's own field or glyph; one accent (water blue) for Đã tưới, the due marker and the selected chip; danger only on errors"
  surfaces: "open canvas; the species field is the only filled surface; hairline dividers between rows; no cards, no shadows, no elevation on content"
  shapes: "field 0 (it bleeds to the edges); buttons and the stepper 14; chips pill; snackbar 12; sheet platform; the silhouette has no container"
  iconography: "Material Icons (one family) at 24, in the tab bar, the header actions and the close affordance only; none in rows (the silhouette is the row's glyph)"
  motion: "on Đã tưới the silhouette settles upright (400 ms) and the care line swaps in place (150 ms); the hero cross-fades to the next due plant after 1 s (200 ms); rows move in place (250 ms); nothing enters; nothing loops"
  interaction: "one tap Đã tưới on the field or on a row; Để tối nay postpones to 18:00; Hoàn tác in a snackbar for 5 s; stepper with number pad fallback; one success haptic per watering; selection haptic on species chips and the stepper"

composition:
  default_archetype: hero
  allowed: [hero, focused-task, list]
  prohibited: [editorial, feed, dashboard, canvas, immersive]   # no discovery feed, no stats, nothing to compose or capture
  repetition_limits: "0 cards on every screen; 1 field per screen; 1 display element per screen; 1 filled button per screen; on Hôm nay the row groups (Cũng hôm nay, Tối nay, Sắp tới, Đã tưới hôm nay) share one row grammar and may reach four, because they are the states of one due list, not sections; two are present in the seed state"

motion_system:
  character: settle
  signature: "on Đã tưới the plant's silhouette settles upright from its thirsty tilt (rotate -6° to 0° about its base, 400 ms, decelerate) while the care line swaps its date in place (150 ms); the field, the name, the buttons, the chrome and the rows below never move"
  moments:
    enter: "platform only; on Hôm nay and Chi tiết cây the silhouette is already in place at paint, tilted when the plant is due; no settling on enter so the settle keeps its meaning"
    change: "the hero field cross-fades to the next due plant 1 s after a confirmation (200 ms); rows enter and leave in place while siblings close the gap (250 ms); on Thêm cây the interval numeral and the consequence date swap in place on every stepper tap (150 ms); the preview field swaps color on species change (150 ms)"
    success: "Đã tưới on Hôm nay or on Chi tiết cây: one success haptic; the silhouette settles upright (400 ms) while the care line swaps (150 ms, concurrent); 400 ms total; then a snackbar with Hoàn tác for 5 s"
    gesture: "platform gestures only (back swipe, modal drag, keyboard dismiss); Hoàn tác is a button, not a swipe"
  never: "entrance of any element, loops, bounces, moving chrome, the field changing size, parallax on the field, counters from zero, a celebration on Thêm cây"

colors:
  surface: "#F7F8F4"        # source: a white apartment wall in morning light
  surface-alt: "#ECEEE6"
  text: "#1B1F17"           # source: leaf shadow
  text-muted: "#5F665A"
  accent: "#1A66C9"         # source: water in the watering can; Đã tưới, due marker, selected chip
  on-accent: "#FFFFFF"
  danger: "#B42318"
  divider: "#DDE0D6"
  # species fields and inks: one hue per species, two tones (source: the leaf, the flower, the pot)
  monstera: { field: "#B9DC4C", ink: "#2D4713" }       # lime: light through a young monstera leaf
  pothos: { field: "#86D6B0", ink: "#0E4B32" }         # mint: golden pothos in shade
  sansevieria: { field: "#E5C94F", ink: "#4A3B06" }    # ochre: the yellow leaf margin
  cactus: { field: "#F0A8BA", ink: "#5C1730" }         # pink: the opuntia flower
  fig: { field: "#E6A47C", ink: "#552611" }            # clay: the terracotta pot a fig lives in
colors-dark:
  surface: "#121410"
  surface-alt: "#1C1F19"
  text: "#F1F3EC"
  text-muted: "#9DA496"
  accent: "#6FA8FF"
  on-accent: "#08172E"
  danger: "#F09A8E"
  divider: "#2A2E27"
  monstera: { field: "#3E5A14", ink: "#D6F08A" }
  pothos: { field: "#1E5A41", ink: "#A9EBD0" }
  sansevieria: { field: "#5C4A0C", ink: "#F0DC80" }
  cactus: { field: "#6A2238", ink: "#F5BFCC" }
  fig: { field: "#6B3418", ink: "#F2C2A4" }
type:
  ui-family: system
  display-family: none       # the display moment is the system face at 34, weight 700, on the field
  scale:
    caption: { size: 12, line: 16 }
    body:    { size: 14, line: 20 }
    body-lg: { size: 16, line: 22 }
    heading: { size: 22, line: 28 }
    display: { size: 34, line: 40 }
  dynamic-type: true
spacing: [4, 8, 12, 16, 20, 24, 32, 48]
radius:
  field: 0
  control: 14
  chip: 999
  snackbar: 12
  sheet: platform
elevation:
  flat: 0
  raised: 0
  overlay: 3                 # the snackbar only
icons:
  family: material-icons
  weight: regular
motion:
  durations: { fast: 150, base: 200, slow: 250, settle: 400 }
  reduced-motion: honored
---

# Cây design direction

## App Read

`APP READ: utility (house plant care) for people in Vietnamese apartments with a few plants on the balcony and the window sill, opened for a few seconds in the morning, one-handed, standing by the window, mostly to see what needs water today and to confirm watering; calm and plain language with one bold color field; leaning Expo + native chrome with a fully branded content layer. platforms: iOS first-class · Android first-class · web none. posture: unified-brand. inferred: audience detail (adults with 3 to 8 plants), frequency (once a morning, under 30 s), no notifications in v1, no account, the owner's reference image as a fourth reference.`

Assumptions (autonomous mode, no question round):

1. Audience: adults living in an apartment with three to eight plants, opening the app once each morning for under thirty seconds, one-handed. (inferred)
2. Mood: calm, bold, plain; not cute. (inferred)
3. References: Planta (one plant per card), Apple Reminders (a due list is a list), Google Keep (color as a label), and the owner's reference image (lime field with a monstera silhouette). (given)

Mood: calm, bold, plain, not cute. Calm is one plant per viewport, a muted text ramp and motion only on the watering. Bold is one full-bleed species field with the name at display size and chrome nearly invisible on it. Plain is sentence case, concrete verbs, no greeting, no exclamation marks. Not cute is no mascot, no faces on plants, no celebration on Thêm cây. The adjectives decide nothing by themselves.

## Visual territory

`balcony at seven in the morning × seed packet`, because the balcony in early light is where and when the app is used (a few plants, strong flat color, one leaf at a time), and a seed packet is how a plant has always been printed: one flat silhouette, the name in large type, one line of care facts, nothing else. Not a wellness app (no breathing gradients, no streaks) and not a botanical encyclopedia (no species browsing, no Latin names leading). Emotional target: relief in two seconds, at the moment of tapping Đã tưới.

## Reference principles

**Planta.** One plant per card, the image filling it and the name sitting on the image; under the name one line of care data and one action. The principle is that the plant is the subject and one plant carries one fact and one action. Applied to the hero band on Hôm nay and Chi tiết cây: the field is the first viewport, the name sits on it, the care line and Đã tưới follow. Not copied: the photo card grid, the green brand, the plant database and the paywall.

**Apple Reminders.** A due list is plain rows under a title with no cards; completing is one tap on the row, the item stays briefly and leaves, and Undo is not a dialog. Applied to every row group (Cũng hôm nay, Sắp tới, Cây của tôi, Lịch) and to the watering flow: one tap, the plant stays as the hero for a second, then the next due plant takes over, Hoàn tác in a snackbar. Not copied: the circle checkbox, the colored list icon grid, smart lists.

**Google Keep.** A note's background is a category label; text stays dark on it; chrome is white; text sits on the color with no inner box. Applied to the species fields: each species owns one field and one ink, location is a text label, the chrome is neutral, and name, care line and buttons sit directly on the field. Not copied: the masonry grid, the pastel palette, the note metaphor.

**Owner reference image.** One full-bleed field, one big silhouette, the name in large type, one data line, two actions; the silhouette is a darker tone of the field's own hue. Applied as the hero band and as the two-tone rule per species. Not copied: the exact lime and cobalt values, the two buttons at equal weight (Đã tưới is the only filled button; Để tối nay is text), and a blue field, because blue is reserved for water.

Where Planta (image-led hero) and Reminders (a list) meet on Hôm nay, Planta wins for the plant that is due and Reminders wins for everything due later: one hero, then rows.

## Visual DNA

### Composition
Hôm nay and Chi tiết cây are Hero: the species field takes the top 60% of the viewport so the Đã tưới button sits in the lower half, the silhouette sits bottom-right and bleeds off the field's edges, the name sits top-left at display size, the care line and the actions follow on the field; rows on the open canvas below. Thêm cây is Focused Task: a live preview field (the object) at the top with the name typed directly on it at heading size, the species chips that complete the object, the interval stepper as the hero input with the consequence line, the location chips, then the sticky CTA. Cây của tôi and Lịch are List: a display-size title, grouped rows with a 32 pt silhouette as the glyph. The axis is leading everywhere; only empty states are centered.

### Hierarchy
Level 1 is the field color with the name on it (color, size and position). Level 2 is the care line at body-lg weight 600 in the species ink. Level 3 is muted rows and captions. Nothing is boxed; sections are separated by space and a body-weight heading.

### Typography
System UI face. One display size, 34 weight 700: the plant name on the field, the title on Cây của tôi and Lịch, the interval numeral on Thêm cây; one per screen. Heading 22 only for group titles that need it (none in v1 beyond the modal title). Tabular figures on every ml figure and date so the care line never changes width when it swaps. Sentence case everywhere; the app never sets anything in uppercase.

### Imagery
Five silhouettes drawn for this app with react-native-svg, one or two paths each, flat fill in the species ink: monstera (split leaf with two holes), pothos (heart leaf with a trailing vine), sansevieria (five sword leaves), cactus (an opuntia with two ears in a pot), fiddle-leaf fig (three fiddle leaves on a trunk in a pot). On hero screens the silhouette is large (about 70% of the field height), anchored bottom-right and clipped by the field. On rows it is a 32 pt naked glyph in the species field color at a fixed leading width. On species chips it is 20 pt in the ink. The due plant's hero silhouette is drawn tilted 6° (thirsty); upright otherwise. No photos, no gradients, no emoji.

### Surfaces
Open canvas in surface. The species field is the only filled surface and it bleeds to the edges and under the status bar. Rows are separated by hairline dividers. No cards, no shadows; the snackbar is the only overlay.

### Shapes
The field has no radius (it is the page). Buttons and the stepper are 14. Chips are pills so they read as controls. The snackbar is 12. The silhouette has no container. The modal uses the platform sheet.

### Iconography
Material Icons at 24, regular, in the tab bar (water-drop, yard, calendar-today), the header add and edit actions, and the modal's close affordance. None in rows: the silhouette is the row's glyph. No icon inside the field.

### Motion
On Đã tưới the silhouette settles upright and the care line swaps in place; one second later the field cross-fades to the next due plant. Rows enter and leave in place with their siblings closing the gap. On Thêm cây the numeral and the consequence date swap in place. Pressed feedback on everything touchable. Nothing enters, nothing loops, nothing bounces. Expanded under Motion system.

### Interaction
Đã tưới is one tap on the field or on a row. Để tối nay postpones the plant to 18:00 the same day and moves it to a Tối nay group. Hoàn tác in a snackbar for 5 s reverts the watering. The interval stepper has a number pad fallback with a Done bar. Haptics: one success haptic on Đã tưới, selection on species chips and the stepper, nothing on navigation or rows.

## Composition system

Default archetype Hero (the morning glance). Allowed: Hero (Hôm nay, Chi tiết cây), Focused Task (Thêm cây), List (Cây của tôi, Lịch). Prohibited: Editorial and Feed (no discovery content), Dashboard (eight plants need no statistics), Canvas and Immersive (nothing to compose or capture). Repetition limits: zero cards on every screen; one field per screen; one display element per screen; one filled button per screen. On Hôm nay the row groups share one row grammar and may reach four (Cũng hôm nay, Tối nay, Sắp tới, Đã tưới hôm nay): they are the states of one due list (the Apple Reminders principle), not sections with their own shape, and the seed state shows two; this overrides the default of two in composition.md §4 for that reason. First viewport commitments for the tab roots: Hôm nay anchors on the species field with the silhouette and the name, task "see what needs water and confirm", identity the species field, next Đã tưới; Cây của tôi anchors on the title and the first group's first row, task "find a plant", identity the species-colored silhouettes on rows, next tap a row or +; Lịch anchors on the Hôm nay group's first row, task "see the coming days", identity the silhouettes with the dates, next tap a row.

## Motion system

The core moment is confirming a watering. In the domain, water is poured, the soil darkens, and a thirsty leaf that was drooping lifts and settles upright over the next hours. The app borrows the lift, not the picture of water: the due plant's silhouette is drawn tilted 6° about its base, and on Đã tưới it settles upright in 400 ms, decelerating, while the care line swaps "đến hạn hôm nay" for the next date in place (150 ms, concurrent). Everything else stays still: the field, the name, the buttons, the chrome, the rows below. It derives from the Apple Reminders interaction principle (completion is one tap; the item stays briefly, then leaves) and from the owner reference's composition (one plant, one silhouette); not copied: Reminders' circle fill animation and its row strike-through.

Character is `settle`: decelerate, no overshoot. A seed packet does not bounce, and the audience is standing by the window with a watering can in the other hand; the motion should feel like the plant relaxing, not like a game.

Enter is platform only. The hero does not settle on enter even though band 5 allows one settling element, because the settle means "you watered it"; if it also played on arrival it would stop meaning anything (M-AI-12 as wallpaper). Change happens in place: one second after a confirmation the hero field cross-fades to the next due plant (200 ms) so a second tap is ready, or to the "không cần tưới" state; the watered plant's row joins the Đã tưới hôm nay group with its siblings closing the gap (250 ms); on Thêm cây the interval numeral and the consequence date swap in place on every tap (150 ms) and the preview field swaps color on a species change (150 ms). Success is one event, confirming a watering, on Hôm nay and on Chi tiết cây: haptic, settle, line swap, 400 ms, then a snackbar with Hoàn tác. Gestures are the platform's; Hoàn tác is a button. Reduced motion: the silhouette snaps upright, the line and the field swap instantly, layout transitions are 0 ms. Never: entrance of any element, loops, bounces, moving chrome, the field changing size, parallax on the field, counters from zero, a celebration when a plant is added.

## Direction: Bao hạt giống

**Idea.** The plant that needs water this morning is printed like a seed packet: one flat field in its own color, one silhouette, the name large, one line of care facts, one button.

**Hierarchy.** The eye lands on the field and the name, drops to the care line, then to Đã tưới; everything under the field is quiet rows in muted type.

**Imagery.** The five silhouettes, large and clipped on hero screens, small as row glyphs. Nothing else.

## Signature

Dominant idea: the species field with its silhouette and the name on it. Supporting behaviors: the silhouette bleeding off the field's bottom-right edge, and the settle on Đã tưới. Signature screens: Hôm nay, Chi tiết cây, and the Đã tưới state on both. Quiet screens: Cây của tôi and Lịch (the silhouette appears only as a 32 pt row glyph, no field), Thêm cây (the preview field is small and is the object, not the signature).

## Chrome

Native tab bar with three destinations, tinted with the accent. Tab roots hide the navigator header: Hôm nay starts with the field under the status bar; Cây của tôi and Lịch set their title in content inside the top inset with the + action beside it. Chi tiết cây is a push on the root stack with a transparent native header over the field (back chevron and Sửa in the species ink). Thêm cây is a page sheet with a custom top bar inside (close affordance leading, title), which skips the top inset on iOS because the sheet already starts below the status bar. EXPRESSION 7 means the content is painted and the chrome is not: insets, the back gesture, the modal drag and the tab bar stay native.

## Copy voice

Short plain Vietnamese, present tense, no exclamation marks, no greeting. CTAs name the result: "Đã tưới", "Để tối nay", "Thêm cây", "Lưu", "Hoàn tác". Care lines state the figure and the date: "650 ml · đến hạn hôm nay", "650 ml · Thứ ba 20/10". The app never says "Chào", "Tuyệt vời", "Oops".

## Deliberately not doing

- The card grid of plants (C-AI-02, B3): rows with a glyph, never cards; the field exists once per screen.
- The stat row (B8) and a Dashboard: eight plants need no numbers; Lịch is a list of days.
- Cream surface with terracotta as the brand (A2): the neutral surface is a cool morning white; clay is one species label among five.
- A celebration on Thêm cây (M-AI-04): the only success moment is the watering.
- The tilt or the settle on rows or on enter (I5, M-AI-12): the signature lives on the hero only.

## Alternatives considered

Sổ tưới (kitchen calendar × watering can): the category standard, native grouped lists with a small silhouette glyph and a water-blue accent, EXPRESSION 3; rejected because its identity lived in the glyph alone and would fail I1 the moment the glyph was simplified. Nhãn vườn (nursery label stake × window sill): white surface, each plant a label stake with a line-drawn silhouette, EXPRESSION 5, DENSITY 4; rejected because the stake competed with the plant for the anchor and served the management list more than the morning glance.

## Nav Read

```
NAV READ
platforms: iOS first-class, Android first-class, web none
tabs (3): Hôm nay · Cây của tôi · Lịch
routes:
  (tabs)/today               tab root   → push plant/[id]; present add (modal) from the empty state
  (tabs)/plants              tab root   → push plant/[id]; present add (modal)
  (tabs)/schedule            tab root   → push plant/[id]
  plant/[id]                 push       (root stack, covers the tab bar; transparent native header) → present add?id= (edit)
  add                        modal      (page sheet; ?id= edits the plant; no internal push; confirms discard when dirty)
entry points:
  add ← "+" header action (Cây của tôi); "Thêm cây" in the empty state (Hôm nay, Cây của tôi, Lịch)
  add?id= ← "Sửa" header action (plant/[id])
  plant/[id] ← any row (Hôm nay, Cây của tôi, Lịch)
sheets: none
modals: add (dirty state confirms discard; a valid draft is not kept)
full-screen groups: none
deep links: /plant/:id
android back: default pop; add confirms discard when dirty
max taps to any core screen: 1 (Đã tưới on Hôm nay); 2 (any plant detail, Thêm cây)
```

Three tabs, no Settings tab, no Profile tab: no account, no settings in v1. Đã tưới is a state on Hôm nay and on Chi tiết cây, not a route, because the plant should not leave the screen when it is watered.

## Screen inventory

| Screen | Purpose | Archetype | Focal point | Hierarchy | Primary action | Signature | Motion | Content strategy | Surface strategy | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hôm nay (tabs)/today | see what needs water this morning and confirm it | Hero | the species field with the tilted silhouette and the name, top 60% | field with name > care line "650 ml · đến hạn hôm nay" > Đã tưới (filled) and Để tối nay (text) > rows Cũng hôm nay, Tối nay, Sắp tới, Đã tưới hôm nay | Đã tưới | the field, the silhouette bleeding off the edge, the settle | enter: platform only; change: the field cross-fades to the next due plant 1 s after a confirmation, rows move in place; success: Đã tưới (haptic, settle 400 ms, line swap, snackbar) | object-first, one plant per viewport | open canvas; the field is the only fill | L skeleton field in surface-alt with two placeholder bars / E no plants: "Chưa có cây nào. Thêm cây đầu tiên để Cây nhắc bạn tưới." + Thêm cây; nothing due: the next plant's field upright with "còn 2 ngày" and no filled button / Err "Không đọc được dữ liệu cây" + Thử lại / P | n/a | none |
| Chi tiết cây plant/[id] | one plant: where it lives, how often, when last, the log | Hero | the species field with the silhouette, top 60% | field with name > care line > Đã tưới (filled when due, outlined otherwise) and Để tối nay (when due) > rows: Vị trí, Tưới mỗi n ngày · ml, Tưới lần cuối > Nhật ký tưới rows | Đã tưới; Sửa in the header | the field, the silhouette, the settle | enter: platform only; change: the new log row enters in place; success: Đã tưới (haptic, settle, line swap, snackbar) | object-first | field on open canvas, then rows | L skeleton field / E not found: "Không tìm thấy cây này." + Về Cây của tôi; no log: "Chưa có lần tưới nào được ghi." / Err watering failed: inline under the buttons + the buttons stay / P | n/a | none |
| Đã tưới (state on Hôm nay and Chi tiết cây) | the success moment | Hero (state) | the silhouette settling upright | settled silhouette > care line now "650 ml · Thứ ba 20/10" > snackbar "Đã tưới Mon lá xẻ · Hoàn tác" | Hoàn tác (snackbar, 5 s) | the settle | success: haptic, settle 400 ms, line swap 150 ms concurrent; change: on Hôm nay the field cross-fades to the next due plant after 1 s | object-first | same as its host screen; snackbar overlay | L n/a (instant) / E on Hôm nay when no plant remains due: the "không cần tưới" state / Err the store rejected (plant gone): inline, no settle / P | n/a | none |
| Thêm cây add (modal, also Sửa cây with ?id=) | add a plant so it gets watered on schedule | Focused Task | the live preview field with the name typed on it, then the interval numeral | preview field (name input at heading size on the species color) > species chips with silhouettes (they complete the object and set the interval default) > interval stepper (display numeral, "ngày") > consequence "Tưới lần tới: Thứ ba 20/10" with "Mỗi 7 ngày · 650 ml" under it > location chips > CTA Thêm cây / Lưu | Thêm cây (Lưu when editing) | quiet; the preview field is the object | enter: platform only; change: the numeral and the consequence date swap in place on every tap, the preview swaps color on species change | object-first | open canvas; the preview field; no boxes except the name's underline | L edit mode reads the plant; missing id: "Không tìm thấy cây này." + Đóng / E the blank form: neutral preview with "Tên cây" placeholder, no species selected, CTA disabled / Err name empty on submit: inline under the preview, draft kept / P | name: default keyboard, autocorrect off, done, focused on open [R-KB10]; interval: stepper default, number pad fallback with a Done bar [R-KB7]; CTA in a keyboard-sticky footer [R-KB2] | none |
| Cây của tôi (tabs)/plants | find a plant | List | the title, then the first group's first row | title > group heading (location) > 64 pt rows: silhouette glyph, name, "Thứ bảy 18/10 · 200 ml"; due rows show "Hôm nay" in accent | open a plant; + to add | quiet; silhouettes as row glyphs | pressed only | list-first, grouped by location | open canvas, hairline dividers | L 6 skeleton rows / E "Chưa có cây nào." + Thêm cây / Err "Không đọc được dữ liệu cây" + Thử lại / P | n/a | none |
| Lịch (tabs)/schedule | see the next two weeks of waterings by day | List | the Hôm nay group's first row | title > day heading "Hôm nay, thứ ba 13/10" > rows: silhouette glyph, name, "650 ml"; later days follow; days without a watering are skipped | open a plant | quiet; silhouettes as row glyphs | pressed only | list-first, grouped by day | open canvas, hairline dividers | L skeleton rows / E no plants: "Không có lịch tưới. Thêm cây để thấy lịch ở đây." + Thêm cây / Err + Thử lại / P | n/a | none |

**Sameness check.** Six rows, three archetypes: Hero 2 (plus the Đã tưới state, which lives on them), Focused Task 1, List 2. No archetype other than List covers more than half. The two Hero screens differ in what follows the field (due groups vs the plant's facts and log) and in the header (none vs transparent native). The two List screens differ in grouping (location vs day), in the row's trailing line (next date vs amount) and in the anchor (title and first row vs the Hôm nay group). Passes screen-archetypes §3. `composition.allowed` and `composition.prohibited` confirmed as written in Phase 4; no change.

**Forms (patterns §4b).** Thêm cây shows the object (the live preview field), makes the interval the hero input with a stepper and the name a plain input on the field, shows the consequence live ("Tưới lần tới: Thứ ba 20/10"), and reaches the CTA through the chips and the stepper, not empty space.

## Flow decisions

- Onboarding: zero slides. The first screen is Hôm nay with its empty state and Thêm cây.
- Sign-in timing: none. There is no account in v1; data lives on the device.
- Permissions: none in v1. Notifications would be the first (triggered by a "Nhắc tôi lúc 7:00" row on a plant, with a pre-prompt), not at launch.
- Success moment: confirming a watering on Hôm nay or Chi tiết cây: one success haptic, the silhouette settles upright, the care line swaps to the next date, a snackbar "Đã tưới Mon lá xẻ · Hoàn tác" for 5 s. Nowhere else; adding a plant gets the modal's dismiss and the new row in place.
- Postpone: Để tối nay sets the plant's due to 18:00 today; it leaves the hero and sits under Tối nay until then.
- Undo: Hoàn tác from the snackbar within 5 s reverts the watering and the plant returns as the hero.

## Visual QA contract

Phase 7 compares the build against these commitments; none may change without updating this file first.

- Archetype, focal point and signature per screen as in the inventory. Signature screens: Hôm nay and Chi tiết cây (and their Đã tưới state). No field on Cây của tôi or Lịch; the preview field on Thêm cây is the object, small, with no tilt and no settle.
- Repetition limits: 0 cards on every screen; 1 field per screen; 1 display element per screen; 1 filled button per screen; on Hôm nay up to four row groups sharing the row grammar (the due list's states), two in the seed state.
- Identity element per tab root: Hôm nay the species field with the silhouette; Cây của tôi the species-colored silhouettes on rows; Lịch the silhouettes with the dates.
- First viewport per tab root: Hôm nay anchor = the field with the silhouette and the name, task = see what needs water and confirm, identity = the field, next = Đã tưới. Cây của tôi anchor = the title and the first row, task = find a plant, identity = the row glyphs, next = tap a row or +. Lịch anchor = the Hôm nay group's first row, task = see the coming days, identity = the row glyphs with the dates, next = tap a row.
- Domain grounding per screen: the species silhouette and the ml figure with a date on every screen; the interval in days and the next-water date on Thêm cây.
- Posture proof (unified-brand): native tab bar, native transparent header on Chi tiết cây, platform page sheet for Thêm cây, system font.
- Motion: character settle; the signature motion is the settle on Hôm nay and Chi tiết cây and nowhere else; the success moment plays once per watering, where motion_system.success says; nothing enters, loops or bounces on any screen; the Motion field per screen as in the inventory.

## Demo

```
DEMO: Cây · tưới hai cây đến hạn sáng nay · 12s
beat 1  0–3 s    identity   Hôm nay at its first viewport: lime field, the monstera silhouette tilted, "Mon lá xẻ", "650 ml · đến hạn hôm nay", Đã tưới; below, Cũng hôm nay: Trầu bà vàng; no touch
beat 2  3–9 s    the task   tap Đã tưới: haptic, the leaf settles upright, the line swaps to "650 ml · Thứ ba 20/10", snackbar "Đã tưới Mon lá xẻ · Hoàn tác"; after 1 s the field cross-fades to mint with Trầu bà vàng; tap Đã tưới again
beat 3  last 3 s success    the pothos settles, "300 ml · Thứ bảy 18/10"; after 1 s the field shows Mon Thái with "500 ml · còn 1 ngày" and no filled button; hold on that state
signature visible at: beat 2 at about 0:04 and beat 3 at about 0:10, Hôm nay
nothing else moves: the name, the buttons, the tab bar, the rows below (they update in place only after the cross-fade)
data: Mon lá xẻ (monstera, 650 ml, every 7 days, last 06/10) and Trầu bà vàng (pothos, 300 ml, every 5 days, last 08/10) from data/plants.ts
recorded: 2026-10-13, iPhone 17 Pro simulator (iOS 27.0), Expo Go; screens/demo.gif (9.6 s). Pauses between the two taps were trimmed; every animation plays at its real speed
```

## Rule exceptions

None.

## Change log

- 2026-10-13: device pass and Phase 8 demo on an iPhone 17 Pro simulator (iOS 27.0, Expo Go); screens captured in `screens/`. Two defects found on the device and fixed. First, the monstera silhouette ran behind Để tối nay and made the label unreadable; the text button in the hero now sits on the field colour (`backdrop`). Second, the second Đã tưới of a session cross-faded twice with a ghosted silhouette: the store notified synchronously before the hero was held, so the next due plant took over for one render and handed back. The hero is now held before the watering is written. VQ11: the settle plays once per watering (demo.gif 0:03 and 0:06), the care line swaps in place, the field cross-fades once a second later. VQ12: settle throughout, one success haptic per watering, nothing moves under the thumb.
- 2026-10-13: Phase 7 fix-once round, from code (no simulator in this session). VQ9 on Hôm nay: with the field at 55% the Đã tưới button centred at about 49% of the screen; the field is now 60% (min 400 pt) on both Hero screens so the decision sits in the lower half; inventory and DNA updated. Thêm cây: the name input and the interval numeral were both at display size (two display elements); the name is now heading size and the numeral is the screen's display element; the stepper moved above the location chips so the hero input follows the object, and choosing a species sets the interval default until the stepper is touched; the declared 150 ms preview colour swap on species change was not built and now is (PlantField animates its fill). VQ4 on Hôm nay: the row groups can reach four in some states (Cũng hôm nay, Tối nay, Sắp tới, Đã tưới hôm nay) against the contract's two; the limit is amended with the reason above instead of merging groups.
- 2026-10-13: created by taste-mobile-app-skill 0.3.0 in --autonomous mode (schema 3). Direction "Bao hạt giống" chosen over "Sổ tưới" and "Nhãn vườn" because the audience's task is a two-second glance and the field answers it without reading. Phases 0 to 5 written before any code; Phase 6 built all six inventory screens; Phase 7 ran the mechanical pass (typecheck, both grep blocks, layout-mechanics checklist) and the visual pass from code. The device pass on a simulator (Phase 7 V-type answers, Phase 8 demo clip) is pending.
