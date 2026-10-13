---
# MOBILE-DESIGN.md
# Design source of truth for Hũ (weekly budget jars). Written by taste-mobile-app-skill 0.3.0 in
# --autonomous mode on an empty repo: every field below was inferred from the brief and the reference
# description, so each inferred value is marked (inferred) and may be corrected by the owner. Phases 0
# to 7 are complete from code; the device pass (Phase 7 on a simulator, Phase 8 recording) is pending.
version: 3
updated: 2026-10-13
stack: expo                      # from the brief
platforms:
  ios: first-class
  android: first-class
  web: none
posture: unified-brand           # from the brief; native chrome on both platforms, one content look
dials:
  expression: 6   # the jar illustration and the display numeral are branded content; chrome stays native (fintech band 4 to 6)
  motion: 5       # one signature motion on the core moment plus numerals rolling; nothing enters, nothing loops (fintech band 3 to 5)
  density: 4      # a glance at one number and a few rows; 56 pt rows, one display element per screen

visual_identity:
  territory: glass jar of coins × kitchen table
  emotional_target: "a calm, honest answer to one question at the counter: can I still afford this week"
  not: a bank dashboard of cards, a crypto ticker

references:
  - source: Apple Wallet
    principles:
      - type: hierarchy
        observation: the pass shows one amount at large scale with a one-line context under it; nothing else on the pass competes
        principle: the amount is the object; everything else is caption
        application: "Tuần này: the remaining amount is the only display-size element, with one caption line under it"
      - type: surface
        observation: transactions sit under the pass as a plain list on the sheet background, with no card around the list or around a row
        principle: no cards of cards; a list is rows separated by hairlines
        application: today's spends on Tuần này and every row on Lịch sử and Hũ are hairline rows on the open canvas
    do_not_copy: the stacked pass metaphor, pass artwork, black chrome, the card tilt on scroll
  - source: Copilot Money
    principles:
      - type: hierarchy
        observation: the budget screen opens with one number and the words that give it meaning ("left to spend"), then the list
        principle: one number with context, then detail; the context line is part of the hero, not metadata
        application: "the line còn lại đến Chủ nhật sits directly under the numeral on Tuần này at caption size; the comparison on Hũ is one figure with one line"
      - type: motion
        observation: when a transaction is categorized the category's remaining amount rolls to its new value; the list and the chrome stay where they are
        principle: only the number that changed moves; the layout never does
        application: "the remaining numeral on Tuần này and the stepper numerals on Đặt hạn mức roll in place; rows and chrome never move (source of the signature motion, see Motion system)"
    do_not_copy: the gradient category illustrations, the rounded dark cards, the spring on the category sheet, the bar fills that animate on every category at once
  - source: Monzo
    principles:
      - type: interaction
        observation: a spend is a row with a merchant and a category; adding or editing one never feels like a form
        principle: the spend is an object with a place and a jar, not a set of fields
        application: "Ghi chi tiêu shows the amount as a typed numeral, the jar as chips and the place as recent-place chips; Lịch sử rows read place, jar, amount"
      - type: typography
        observation: amounts are set in tabular figures, right-aligned, with the merchant on the left
        principle: money is a column
        application: every amount in the app is tabular and right-aligned in rows; the display numeral is tabular so it never changes width while rolling
    do_not_copy: the coral accent, pots drawn as cards, the feed with avatars and emoji, the confetti on savings goals

visual_dna:
  composition: "Hero on Tuần này (numeral and jar take the top 55% of the first viewport); Focused Task on Ghi chi tiêu, Chi tiết chi tiêu and Đặt hạn mức; List on Lịch sử; Dashboard on Hũ; leading axis everywhere; anchors sit in the top third; the jar sits on the leading side with its tick marks to its right"
  hierarchy: "level 1 by size and position (the one display numeral); level 2 by position and the one accent fill (the jar); level 3 by weight 600 (place names, section headers); level 4 by muted color (jar names, times, captions); never by boxes"
  typography: "system UI face (SF on iOS, Roboto on Android); every amount tabular; one display size (40) for the one amount per screen; sentence case; VND formatted 420.000 ₫ with a thin space before the sign, never rounded to 'k' or 'tr'"
  imagery: "the jar drawn with react-native-svg: a 2 pt ink outline, a glass body in surface-alt, the coin level as an accent rect clipped to the body, weekly tick marks on the right side; large on Tuần này, small per row on Hũ and as the Hũ tab icon; nowhere else; no photos, no illustration beyond the jar, no emoji"
  color: "surface (pale bottle glass), surface-alt (the glass body), text, text-muted, one accent (coin brass) on the coin level, the filled button and the selected chip only; danger for an over-limit jar and for delete only; no green for 'under budget'; progress is never red"
  surfaces: "open canvas on every screen; hairline dividers between rows; chips with a 1 pt ink border; no cards anywhere; the sheet and the modal are the platform's"
  shapes: "controls 12 (buttons, the note field); chips pill; the jar's glass corners 16 inside the SVG; sheet platform; no universal radius"
  iconography: "Ionicons outline from @expo/vector-icons, 24 pt, in the tab bar and header actions only; the Hũ tab icon is the jar glyph; no icons in content rows"
  motion: "the coin level settles to its new amount in 300 ms decelerating and the remaining numeral rolls in 200 ms when a spend is saved, undone, edited or deleted; consequence lines swap in place; rows leave in place; nothing enters, nothing loops"
  interaction: "tap a row to open the spend; delete from the detail behind an alert, then Hoàn tác in the snackbar; stepper in 50.000 ₫ steps for limits; chips for the jar and recent places; one success haptic on Lưu in Ghi chi tiêu, selection haptic on a jar chip, nothing else"

composition:
  default_archetype: "focused-task"
  allowed: [hero, focused-task, list, dashboard]
  prohibited: [editorial, feed, canvas, immersive]   # no discovery content, no media, nothing to compose freely, no camera
  repetition_limits: "0 cards on every screen; 1 section grammar per screen beside the row list; 1 filled button per screen; 1 display-size numeral per screen; the jar illustration once per screen at most, small glyphs only on Hũ rows"

motion_system:
  character: "settle"
  signature: "when a spend is saved, the coin level in the jar on Tuần này settles to the new amount in 300 ms, decelerating with no overshoot, and the remaining numeral rolls down in 200 ms; the list below, the tick marks, the button and the chrome do not move"
  moments:
    enter: "platform only on every screen; the modal arrives with the amount field already focused and the jar chips laid out; no element settles on enter"
    change: "the remaining numeral rolls (200 ms) and the coin level settles (300 ms) on Tuần này after any spend change; the small jar levels on Hũ settle after a limit or spend change; the consequence line on Ghi chi tiêu, Chi tiết and Đặt hạn mức swaps its figures in place; the stepper numerals on Đặt hạn mức roll; a deleted or undone row leaves its list in place while siblings close the gap (250 ms)"
    success: "Lưu on Ghi chi tiêu: one success haptic, the modal dismisses with the platform transition, then on Tuần này the coin level settles and the numeral rolls (300 ms) and a snackbar with Hoàn tác stays 5 s; under 600 ms after the dismiss; nowhere else"
    gesture: "platform gestures only (back swipe, modal pull-down, sheet drag, keyboard dismiss on drag); undo is a button in the snackbar, not a swipe"
  never: "entrance of any element, loops, bounces, moving chrome, counters from zero, parallax, the jar level on any screen other than Tuần này and Hũ, the list under the jar"

colors:
  surface: "#F3F4F0"       # source: pale bottle glass seen against a white wall; not cream, which would pull toward the paper-and-serif default
  surface-alt: "#E6E8E1"   # source: the thicker glass of the jar's body; chips selected, skeletons
  text: "#1B1D1A"
  text-muted: "#6A6E66"    # 4.7:1 on surface
  accent: "#C9922E"        # source: the brass of 500 ₫ and 5.000 ₫ coins; fills only (coin level, filled button, selected chip); never text (2.5:1 on surface)
  on-accent: "#1B1D1A"     # ink on brass, 6.1:1
  danger: "#B5412F"        # an over-limit jar and the delete action only
  divider: "#DADDD4"
colors-dark:
  surface: "#141614"
  surface-alt: "#222521"
  text: "#F1F2EE"
  text-muted: "#9A9E96"
  accent: "#D9A441"
  on-accent: "#141614"
  danger: "#E06B59"
  divider: "#2E322D"
type:
  ui-family: system          # SF on iOS, Roboto on Android; no brand face
  display-family: none       # the display moment is the system face at 40 with tabular figures
  scale:
    caption: { size: 12, line: 16 }
    body:    { size: 14, line: 20 }
    body-lg: { size: 16, line: 22 }
    heading: { size: 20, line: 26 }
    display: { size: 40, line: 48 }
  dynamic-type: true
spacing: [4, 8, 12, 16, 24, 32, 40, 48]
radius:
  control: 12              # buttons, the note field, the stepper buttons
  chip: 999
  jar: 16                  # the glass body corners inside the SVG
  sheet: platform          # iOS form sheet; Android form sheet as Expo Router draws it
elevation:
  flat: 0
  raised: 0
  overlay: 3               # the snackbar only
icons:
  family: ionicons
  weight: outline
motion:
  durations: { fast: 120, base: 200, slow: 300, dismiss: 350 }
  reduced-motion: honored
---

# Hũ design direction

## App Read

`APP READ: personal fintech (weekly budget jars) for young office workers in Saigon who set an amount for the week and log each spend in a few seconds at the counter, one-handed, several times a day, plus one glance at the week in the evening; calm, plain language ("one number with context"); leaning Expo with native chrome and branded content. platforms: iOS first-class · Android first-class · web none. posture: unified-brand. inferred: frequency of use (several logs a day), four jars (ăn ngoài, cà phê, đi lại, khác), the week starts on Monday, VND without decimals, no sign-in and no sync in v1, light mode as the default with dark mode supported.`

**Assumptions (autonomous mode).** The brief named the audience, the stack, the posture, the three reference apps and the reference images; it did not name the number of jars, the week boundary, whether spends can be edited after the fact, or whether an account exists. Assumed: four jars with the three named plus "khác"; weeks run Monday to Sunday because the reference copy says "until Sunday"; a spend can be edited and deleted from its detail; no account, no backend, in-memory data seeded for three weeks; the device date decides which week is "this week".

Mood: calm, honest, physical, not a dashboard. Each adjective is translated under Visual DNA; the adjectives decide nothing.

## Visual territory

`glass jar of coins × kitchen table`, because the jar of coins is what a weekly cash budget physically is (the envelope method's visible cousin: you see the level drop) and the kitchen table is where the week is counted: a flat, calm, well-lit surface with nothing on it but the jar and a list. Not a bank dashboard of cards, because the audience is not managing accounts, they are asking one question at a counter; not a crypto ticker, because nothing here is live, volatile or red-and-green. Emotional target: a calm, honest answer to "can I still afford this week", at the moment the spend is saved and the level settles.

## Reference principles

**Apple Wallet.** On a pass, one amount is set at display size with a single line of context and nothing competes with it; the transaction list below is plain rows on the sheet background, with no card around the list or a row. Applied: the remaining amount on Tuần này is the only display-size element, with "còn lại đến Chủ nhật" under it; every list in the app is hairline rows on the open canvas. Not copied: the stacked pass metaphor, the pass artwork and black chrome, the tilt on scroll.

**Copilot Money.** The budget screen opens with one number and the words that give it meaning, then the list; when a transaction is categorized, only the category's remaining amount rolls and the layout holds still. Applied: the caption line is part of the hero on Tuần này; the comparison on Hũ is one figure and one line, not a chart; the rolling numeral and the stillness of the list are the source of this app's motion system. Not copied: the gradient category art, the rounded dark cards, the spring on the category sheet, bar fills animating on every category at once.

**Monzo.** A spend is a row with a merchant and a category, and adding one never feels like a form; amounts are a tabular column on the right. Applied: Ghi chi tiêu is a typed numeral, four jar chips and recent-place chips, with the consequence under the numeral; every amount in the app is tabular and right-aligned in rows. Not copied: the coral accent, pots drawn as cards, the feed with avatars and emoji, confetti on goals.

Where Copilot (one number with context) and Apple Wallet (the amount is the object) meet on Tuần này they agree; Monzo's row grammar wins on every list, and Wallet's "no cards" wins over Monzo's pots on Hũ, where the jars are rows with a glyph, not cards.

## Visual DNA

### Composition
Tuần này is a Hero: the remaining numeral and its caption at the top, the jar directly under it on the leading side with the week's tick marks to its right, today's spends as rows below, the one filled button in the thumb zone. Ghi chi tiêu, Chi tiết chi tiêu and Đặt hạn mức are Focused Task: the object (the jar being spent from, the spend, the four jars), the hero input, the consequence line, secondary content down to the CTA. Lịch sử is a List grouped by week with day captions. Hũ is a Dashboard whose headline is one comparison figure, followed by four jar rows of unequal content and one total line. The axis is leading everywhere; only empty states are a single leading-aligned sentence with one action, never centered.

### Hierarchy
Level 1 is the one display numeral per screen (size 40, top third). Level 2 is the jar, by position and because it carries the only accent fill. Level 3 is weight 600 on place names and section headers at body size. Level 4 is muted color on jar names, times and captions. No boxes separate levels; whitespace (24 between sections, 12 inside) and hairlines do.

### Typography
The system face for everything. Every amount uses tabular figures so columns align and the rolling numeral never changes width (Monzo). One display size, 40, for the one amount per screen: the remaining amount on Tuần này, the typed amount on Ghi chi tiêu and Chi tiết, the comparison figure on Hũ. Sentence case throughout; no uppercase labels. VND is written `420.000 ₫` with a thin space before the sign, never `420k` or `0,4 tr`, and a negative remaining is written with a true minus sign.

### Imagery
The jar is drawn, not photographed: an SVG with a 2 pt ink outline (body with 16 corners, a rim), a glass body filled with surface-alt, and the coin level as one accent-colored rect clipped to the body. Seven tick marks on the right side mark the ideal level at the start of each day of the week; today's tick is drawn in ink with its weekday label (T2 to CN), the others are muted and unlabeled. Large (160 × 200) on Tuần này; 28 pt glyphs with the level and no ticks on the Hũ rows and as the Hũ tab icon. Nowhere else. No photos, no stock, no emoji, no second illustration.

### Surfaces
Open canvas everywhere. Rows are separated by hairline dividers in divider color. Chips have a 1 pt ink border and fill with surface-alt when selected (and accent when the chip is the chosen jar). No cards, no shadows on content; the snackbar is the only raised surface. The modal and the sheet are the platform's own containers.

### Shapes
Controls (the filled button, the note field, the stepper buttons) use 12. Chips are pills. The jar's glass corners are 16 inside the SVG; the rim is 4. The sheet keeps the platform radius. No universal radius: a row has none, the jar and a button do not share one.

### Iconography
Ionicons outline, 24 pt, in the tab bar (Tuần này, Lịch sử) and header actions (add, close) only. The Hũ tab icon is the jar glyph itself at 24 pt, drawn with the same stroke weight, because the jar is the mark of the app. No icons inside content rows: a spend row is place, jar name and amount.

### Motion
Character settle. The coin level settles to its new amount in 300 ms, decelerating, and the remaining numeral rolls in 200 ms, after a spend is saved, undone, edited or deleted. Consequence lines swap their figures in place. Stepper numerals on Đặt hạn mức roll. A deleted row leaves its list in place while siblings close the gap. Pressed feedback is a 0.97 scale over 120 ms with a 150 ms decelerating return, no spring. Nothing enters, nothing loops, nothing bounces.

### Interaction
Tap a row to open the spend. Delete lives on the detail behind an alert with Cancel ("Xóa khoản chi này?"), then Hoàn tác in the snackbar for 5 s. Limits use a stepper in 50.000 ₫ steps, no keyboard. Jar choice and recent places are chips, one tap each. Haptics: one success notification on Lưu in Ghi chi tiêu; a selection tick on a jar chip; nothing on navigation, rows or steppers.

## Composition system

Default archetype Focused Task (three of six screens). Allowed: Hero, Focused Task, List, Dashboard. Prohibited: Editorial, Feed, Canvas, Immersive (no discovery content, no media, nothing to compose freely, no camera). Repetition limits: zero cards on every screen; one section grammar per screen beside the row list (the jar block on Tuần này, the comparison block on Hũ); one filled button per screen; one display-size numeral per screen; the large jar once, on Tuần này only, and small glyphs only on the Hũ rows and tab icon.

First-viewport commitments for the tab roots: Tuần này anchors on the remaining numeral, task "see what is left and log a spend", identity the jar with today's tick, next "Ghi chi tiêu" in the footer. Lịch sử anchors on this week's section header with its total, task "find or correct a spend", identity the tabular amount column with jar names, next tap a row (or + in the header). Hũ anchors on the comparison figure, task "see which jar has room", identity the four small jar glyphs with their levels, next "Hạn mức" in the header.

## Motion system

The core moment is a spend being saved at the counter: a sum of money leaves the week. In the domain, coins come out of the jar and the level drops; nothing else on the table moves. The signature motion borrows that behaviour, not its picture: the coin level in the jar on Tuần này settles to the new amount in 300 ms with a decelerating curve and no overshoot, and the remaining numeral rolls down in 200 ms; the list under the jar, the tick marks, the button and the chrome stay exactly where they are. It derives from the Copilot Money motion principle "only the number that changed moves; the layout never does", extended from the number to the jar level because the jar is this app's object. Not copied: Copilot's bar fills animating on every category at once, and its spring on the category sheet.

Character is `settle` because glass and coins do not bounce, and because the audience is asking a calm question; every change decelerates into place. Pressed feedback keeps the same character (timing in, timing out, no spring), so the app has one character everywhere.

Enter is platform only on every screen: a modal that arrives with the amount field already focused is faster at a counter than one that assembles itself, and nothing on a tab root settles on enter (the level is data, not a reveal; M-AI-10). Change happens in place: the remaining numeral and the level on Tuần này after any spend change, the small levels on Hũ after a limit or spend change, consequence lines swapping their figures, the stepper numerals on Đặt hạn mức rolling, a deleted row leaving while its siblings close the gap. Success is one event: Lưu on Ghi chi tiêu, which gives one success haptic, dismisses the modal with the platform transition, and then (the commit is deferred by the dismiss duration, 350 ms, so the settle is visible rather than hidden behind the sheet) the jar settles and the numeral rolls on Tuần này while a snackbar with Hoàn tác appears; Lưu hạn mức and Lưu thay đổi dismiss with a snackbar and no haptic. Gestures are the platform's; undo is a button. Never: entrance of any element, loops, bounces, moving chrome, counters from zero, parallax, the jar level animating anywhere but Tuần này and Hũ, and the list under the jar.

## Direction: Hũ thủy tinh

**Idea.** The week's money is a glass jar of coins on the kitchen table: you can see how much is left without reading, and the level drops by exactly what you just spent.

**Hierarchy.** The eye lands on the remaining amount, drops to the jar and its today-tick (am I above or below the line), then reads today's rows. Labels never compete with amounts; the only accent is the coin level, the button and the chosen jar chip.

**Imagery.** The drawn jar with its weekly ticks on Tuần này; small jar glyphs with their levels on Hũ. Nothing else, ever.

## Signature

Dominant idea: the jar with its coin level and today's tick on Tuần này, supported by the display numeral above it and by the level settling when a spend is saved. Signature screens: Tuần này (large jar) and Hũ (four small glyphs). Quiet screens: Ghi chi tiêu, Chi tiết chi tiêu, Lịch sử, Đặt hạn mức, where the dominant idea is the typed numeral, the amount column or the stepper row.

## Chrome

Native tab bar with three destinations, the navigator's header on Lịch sử, Hũ and Chi tiết, the platform page sheet for Ghi chi tiêu and a form sheet for Đặt hạn mức, all tinted with ink (active tab text, header tint); the accent never appears in the chrome. Tuần này hides the navigator header because the numeral is the title; its top block reads the top inset from the safe-area API. The modal draws its own close bar without the top inset on iOS (the page sheet already starts below the status bar) and with it on Android. EXPRESSION 6: content is branded, chrome is the platform's.

## Copy voice

Short, plain Vietnamese in the present tense, no greetings, no exclamation marks. CTAs name the result: "Ghi chi tiêu", "Lưu", "Lưu thay đổi", "Lưu hạn mức", "Hoàn tác", "Xóa". Consequence lines state the numbers: "Hũ cà phê: 196.000 → 141.000 ₫, còn 6 ngày". Over-limit copy states the fact: "vượt hạn mức 45.000 ₫", never a warning tone. The app never says "Chào", "Tuyệt vời", "Oops", "Bạn đã tiêu quá nhiều".

## Deliberately not doing

- The gradient balance card and the stat triplet (B2, B8, fintech floor): the remaining amount is type on the canvas with the jar under it; no card, no three-number row.
- Cream surface with a serif display and a terracotta accent (A2): the surface is bottle glass, the face is the system face, the accent is coin brass used only as a fill.
- Every section as heading + card (C-AI-01, C-AI-02) and the template form (B16): Ghi chi tiêu is a numeral, chips and a consequence line; lists are rows on the canvas.
- A chart on Hũ: the week against last week is one figure and one line; the jars are rows with glyphs, not bars.
- Red as a progress color and green as praise: the level is always brass; danger appears only on an over-limit jar and on Xóa.

## Alternatives considered

Phong bì giấy (paper envelope budget × iOS grouped lists), the category standard: native grouped lists with a thin progress bar per jar and no illustration; rejected because its identity lived in the accent alone (I1) and nothing on screen came from the domain beyond the figures. Bảng đen quán (café chalkboard × coin tray): dark-first, chalk-white condensed numerals, the "214.000 ₫ less than last week" pill as the hero; rejected because near-black plus one accent is the second-wave default (A2), a dark default fails at a bright counter at noon, and the pill reads as a ticker.

## Nav Read

```
NAV READ
platforms: iOS first-class, Android first-class, web none
tabs (3): Tuần này · Lịch sử · Hũ
routes:
  (tabs)/week                  tab root   → present log (modal); push spend/[id] from today's rows
  (tabs)/history               tab root   → push spend/[id]; present log from the header +
  (tabs)/jars                  tab root   → present limits (form sheet) from the header
  spend/[id]                   push       (native header; edit amount, jar, note; Xóa behind an alert)
  log                          modal      (page sheet on iOS, modal on Android; own close bar; confirms discard when dirty)
  limits                       form sheet (0.8 detent, grabber; steppers only, no keyboard; Lưu hạn mức applies, dismiss discards)
  +not-found                   explains the missing route and offers Tuần này
entry points:
  log ← "Ghi chi tiêu" filled button in the footer (Tuần này); + in the header (Lịch sử)
  limits ← "Hạn mức" text action in the header (Hũ)
  spend/[id] ← a spend row (Tuần này, Lịch sử)
sheets: limits (Hũ)
modals: log (dirty state confirms discard: "Bỏ khoản chi này?"; saving dismisses without a prompt)
full-screen groups: none
deep links: /spend/:id (a deleted id lands on the detail's not-found state with "Về Lịch sử")
android back: default pop; log confirms discard when dirty; limits dismisses without applying
max taps to any core screen: 1 (Ghi chi tiêu from Tuần này)
```

Three tabs because the app has three questions: what is left, what did I spend, which jar has room. No Settings tab: the only setting is the limits, which belong to Hũ. No sign-in, no profile.

## Screen inventory

| Screen | Purpose | Archetype | Focal point | Hierarchy | Primary action | Signature | Motion | Content strategy | Surface strategy | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tuần này (tabs)/week | see what is left this week and log a spend | Hero | the remaining amount at display size, top third | numeral with "còn lại đến Chủ nhật" (size, position) > the jar with today's tick (position, accent fill) > today's rows: place 600, jar muted, amount tabular right > Ghi chi tiêu in the footer | Ghi chi tiêu | the jar with weekly ticks under the display numeral | enter: platform only; change: the coin level settles (300 ms) and the numeral rolls (200 ms) after any spend change; success: lands here after Lưu (snackbar with Hoàn tác) | number-first | open canvas; hairline rows; sticky footer above the tab bar | L skeleton numeral and an empty jar outline / E "Chưa có khoản chi nào tuần này." with a full jar / Err "Không đọc được dữ liệu tuần này." + Thử lại / P | n/a | none |
| Ghi chi tiêu log (modal) | log one spend in a few seconds, one-handed | Focused Task | the typed amount at display size under the close bar | amount (size) > jar chips (position) > consequence "Hũ cà phê: 196.000 → 141.000 ₫, còn 6 ngày" (weight) > recent-place chips and the note field > Lưu | Lưu | quiet; the consequence names the jar | enter: platform only, the amount field is focused on open; change: the consequence line swaps its figures in place; success: Lưu (haptic, dismiss, then the jar settles on Tuần này) | object-first (the jar being spent from) | open canvas; one bordered field; keyboard-sticky footer | L n/a, the store is already loaded by the tab root / E no amount or no jar yet: the consequence reads the chosen jar's remaining, or "Chọn hũ" when none; Lưu disabled / Err save failed: draft kept, inline message + Thử lại / P | amount: number pad, accessory bar with 000 and Xong on iOS [R-KB7], a 000 chip beside the field on Android; note: default keyboard, autocorrect off, return done; CTA in KeyboardStickyView [R-KB2] | none |
| Lịch sử (tabs)/history | find or correct a past spend | List | this week's section header with its total | week header 600 with the total right (weight) > day captions (muted) > rows: place 600, jar and time muted, amount tabular right | open a spend; + in the header logs one | quiet; the tabular amount column | pressed only; a deleted or undone row leaves in place while siblings close the gap (250 ms) | list-first | grouped list by week, hairlines, no cards | L 6 skeleton rows / E "Chưa có khoản chi nào. Khoản đầu tiên sẽ hiện ở đây." + Ghi chi tiêu / Err cached rows + "Không đọc được dữ liệu" + Thử lại / P | n/a | none |
| Chi tiết chi tiêu spend/[id] | correct or remove one spend | Focused Task | the amount at display size | amount (size, editable in place) > jar chips > consequence "Hũ cà phê: 196.000 → 206.000 ₫ sau khi sửa" > note field > "Lúc" row > Lưu thay đổi; Xóa last, in danger | Lưu thay đổi (enabled when dirty) | quiet | pressed only; the consequence line swaps in place; Xóa is confirmed by an alert with Giữ lại, then Hoàn tác in the snackbar | object-first | open canvas; grouped meta row; actions inline, no sticky footer | L n/a / E not found: "Không tìm thấy khoản chi này." + Về Lịch sử / Err save failed inline, draft kept / P | amount: number pad with the accessory bar; note: default, autocorrect off, done; KeyboardAwareScrollView [R-KB1] | none |
| Hũ (tabs)/jars | see which jar has room and how the week compares | Dashboard | the comparison figure at display size | comparison figure with "ít hơn tuần trước, tính đến thứ Ba" (size) > four jar rows: glyph with level, name 600, remaining tabular right, "đã chi 104.000 / 300.000" muted (position) > "Tổng hạn mức 1.500.000 ₫" line > Hạn mức in the header | Hạn mức (header action) | four small jar glyphs with their levels | pressed only; the small levels settle (300 ms) and the figure rolls after a limit or spend change | number-first | open canvas; hairline rows; no cards | L skeleton figure and four outline glyphs / E no spends this week: "Chưa chi gì tuần này." with four full jars and the figure comparing to last week's full total / Err cached + Thử lại / P | n/a | none |
| Đặt hạn mức limits (form sheet) | set each jar's weekly amount | Focused Task | the first stepper row | four stepper rows: jar name, −, amount tabular, + (position) > consequence "Tổng tuần: 1.500.000 ₫" (weight) > Lưu hạn mức | Lưu hạn mức | quiet | change: each stepper numeral rolls (200 ms) and the total swaps in place; no success moment here (dismiss and snackbar, no haptic) | object-first (the four jars) | the platform form sheet; open canvas inside; no cards | L n/a / E all limits at 0: "Tổng tuần: 0 ₫, chưa đặt hạn mức." and Lưu disabled / Err save failed inline / P | none (steppers only) | none |

**Sameness check.** Six rows, four archetypes: Hero 1, Focused Task 3, List 1, Dashboard 1. Focused Task covers three of six, not more than half. The three Focused Task screens differ in hero input (a free amount typed on a page sheet, an amount edited in place with a meta row and inline actions, four steppers in a sheet), in consequence line and in surface (sticky footer, inline actions, form sheet). Passes `screen-archetypes.md` §3. The Phase 4 `allowed` and `prohibited` lists are confirmed unchanged.

**Forms (patterns §4b).** Ghi chi tiêu shows the jar being spent from (the chips and the consequence line name it with its remaining), makes the amount the hero with the number pad plus a 000 key, shows the consequence live, and reaches the CTA through recent-place chips and the note field. Chi tiết shows the spend as the object, the amount as the hero, the consequence after the edit, and the "Lúc" row before the actions. Đặt hạn mức shows the four jars, the stepper as the control for round amounts, and the total as the consequence.

## Flow decisions

- Onboarding: zero slides. The first screen is Tuần này with the seeded week; a fresh install would show the full jar and the empty state with Ghi chi tiêu.
- Sign-in timing: none. There is no account in v1; the data is local to the device.
- Permissions: none requested.
- Success moment: Lưu on Ghi chi tiêu, the same event as `motion_system.moments.success`: one success haptic, the modal dismisses, the jar settles and the numeral rolls on Tuần này, the snackbar "Đã ghi 55.000 ₫, hũ Cà phê · Hoàn tác" stays 5 s. Nowhere else: Lưu thay đổi and Lưu hạn mức get a snackbar without a haptic; Xóa gets an alert, then a snackbar with Hoàn tác.
- Undo: from the snackbar within 5 s after a save, an edit or a delete. Delete also asks first ("Xóa khoản chi này?" with Giữ lại and Xóa) because the brief asks for an explicit confirm on money-related removal.
- Over limit: a jar may go negative; the consequence line and the jar row say "vượt hạn mức" in danger, the level shows empty, and nothing blocks the save, because the spend already happened at the counter.

## Visual QA contract

Phase 7 compares the build against these commitments; none may change without updating this file first.

- Archetype, focal point, signature and motion per screen: as in the inventory. Signature screens are Tuần này (the large jar) and Hũ (four small glyphs). No other screen draws a jar beyond the tab icon.
- Repetition limits: 0 cards on every screen; 1 filled button per screen; 1 display-size numeral per screen; 1 section grammar beside the row list; the large jar once.
- Identity element per tab root: Tuần này the jar with today's tick under the numeral; Lịch sử the tabular amount column with jar names; Hũ the four jar glyphs with their levels.
- First viewport per tab root: Tuần này anchor = the remaining numeral, task = see what is left and log, identity = the jar, next = Ghi chi tiêu in the footer. Lịch sử anchor = this week's header and total, task = find a spend, identity = the amount column, next = tap a row or +. Hũ anchor = the comparison figure, task = see which jar has room, identity = the jar glyphs, next = Hạn mức.
- Domain grounding per screen: the jar with its level on Tuần này and Hũ; real Saigon places and VND amounts on every row; the → consequence in VND on every form; the weekday tick marks.
- Posture proof (unified-brand): native tab bar and header on both platforms, the platform page sheet and form sheet, the system number pad; content tokens identical on both.
- Motion: character settle; the signature motion is the coin level settling and the numeral rolling on Tuần này after a spend change, and nowhere else at that size; the success moment plays once, after Lưu on Ghi chi tiêu; nothing enters, loops or bounces on any screen; pressed feedback never springs; the Motion field per screen as in the inventory.

## Demo

```
DEMO: Hũ · ghi một ly cà phê ở quầy · 12s
beat 1  0–3 s    identity   Tuần này at its first viewport: "1.121.000 ₫" over "còn lại đến Chủ nhật, 6 ngày", the jar at 75% with the T3 tick, today's two rows (Highlands 59.000, Cơm tấm Phúc Lộc Thọ 60.000), the Ghi chi tiêu footer; no touch
beat 2  3–10 s   the task   tap Ghi chi tiêu → the page sheet with the number pad open and 0 ₫ at display size → type 55, tap 000 → "55.000 ₫" → tap chip Cà phê → the consequence reads "Hũ cà phê: 196.000 → 141.000 ₫, còn 6 ngày" → tap recent chip "Phúc Long"
beat 3  last 3 s success    tap Lưu: haptic, the sheet dismisses, the coin level settles from 75% to 71% and the numeral rolls 1.121.000 → 1.066.000 ₫, the snackbar "Đã ghi 55.000 ₫, hũ Cà phê · Hoàn tác" appears; hold on Tuần này with the new row at the top of Hôm nay
signature visible at: beat 3, Tuần này, in the 300 ms after the sheet lands
nothing else moves: the caption, the tick marks, today's rows (the new row appears in place at the top), the footer button, the tab bar
data: this week's seed in data/seed.ts as of Tuesday 2026-10-13 (six spends, 379.000 ₫ spent of 1.500.000 ₫; cà phê 104.000 of 300.000)
recorded: pending (no simulator in this session; the device pass is the controller's)
```

The figures above hold when the device date is Tuesday 2026-10-13; the seed is built relative to the device's current week, so on another weekday the amounts differ and the beat sheet's numbers are re-read from the screen before recording.

## Rule exceptions

None.

## Change log

- 2026-10-13: created by taste-mobile-app-skill 0.3.0 in --autonomous mode (schema 3). Direction "Hũ thủy tinh" chosen over "Phong bì giấy" and "Bảng đen quán" because the jar carries the identity in space and gives the signature motion a physical home, and because a light surface serves a counter at noon. Phases 0 to 5 written before any code; Phase 6 built all six screens; Phase 7 ran the mechanical pass (typecheck, both grep blocks, layout-mechanics checklist) and the visual pass from code. The device pass on a simulator (screenshots, keyboard, the form sheet on Android, the deferred commit timing) and the Phase 8 recording are pending; the beat sheet is marked pending.
- 2026-10-13: Phase 6 build decision recorded under Motion system: the spend is committed to the store 350 ms after Lưu dismisses the modal so the coin level settles on Tuần này after the sheet lands rather than behind it; the modal never touches state after it unmounts. Android gets a 000 chip beside the amount because its number pad carries no accessory view.
- 2026-10-13: Phase 7 mechanical pass: `npx tsc --noEmit` clean after two type fixes (the tabular style token typed as TextStyle, the jar's color props typed as ColorValue for the tab bar tint); both grep blocks clean (five font sizes 12/14/16/20/40, hex only in theme/tokens.ts, no magic insets, no dashes, no emoji, no @react-navigation imports, three Alert.alert calls all with Cancel, .map only over the four jars). Layout-mechanics checklist evidence: R-SA1 week.tsx:44 `insets.top` on the hero column only, TopBar.tsx:16 inset skipped on iOS inside the page sheet; R-TZ3 log.tsx:156 and limits.tsx:43 `Math.max(insets.bottom, 16)`; R-KB1/R-KB2 log.tsx:110 KeyboardAwareScrollView with `bottomOffset` equal to the real footer height (log.tsx:37), log.tsx:155 KeyboardStickyView; R-KB7 AmountField.tsx:32 number pad with KeypadAccessory.tsx:15 accessory bar; R-KB9/R-KB10 log.tsx:116 autoFocus and autoCorrect off on the note; R-TT1 48 pt targets on the close button, header actions, chips (hitSlop) and stepper buttons; R-NV1/R-NV2 three tabs, actions in headers and the footer; R-BS2/R-BS3 _layout.tsx:36 form sheet with grabber and the platform's pull-down; R-DL1/R-DL3 the only alerts are two discard confirms and one destructive delete with Giữ lại; R-DL6 Snackbar.tsx:36 absolute above the footer (week.tsx:91) or the tab bar, never in the layout; R-SA3 app.json `softwareKeyboardLayoutMode: resize`.
- 2026-10-13: Phase 7 visual pass from code (no simulator in this session), fixed in one round: chip labels changed weight on selection and would have shifted the chip row under the thumb (M-AI-08), now one weight; the limits stepper numeral had a minimum width too small for large values and could move the − button, now wide enough for 50.000.000 ₫; the sheet title on Đặt hạn mức was set at heading size and competed with the first stepper for the anchor (VQ1), now a body-lg label; and `router.back()` was called in the same tick as `setSaving(true)` so `usePreventRemove` would have shown the discard alert on every save, replaced on Ghi chi tiêu and Chi tiết by a close effect that runs after the commit (the deferred-commit timer is deliberately not cleared on unmount because the sheet unmounts as it lands). Noted for the device audit, not fixed: on Lịch sử the week header and the row titles share weight 600 and are separated by size, space and the total; the identity of Ghi chi tiêu, Chi tiết and Đặt hạn mức rests on the consequence line and the jar chips rather than on a drawn element, by design (signature screens are Tuần này and Hũ only).
