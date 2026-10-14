# Motion system

Motion is the dimension where an AI-built app gives itself away twice. The first failure is the tidy app: correct tokens, native transitions, pressed states, and nothing that moves on purpose, so the product feels like a form. The second is motion theatre: every element slides up with a stagger on mount, every button bounces, every save throws confetti, and the app feels like a template demo. Both come from the same cause: motion was never designed, only added or omitted.

This file decides **what moves, why, and what never moves**. `dials.md` §3 sets how much motion the app may have (the MOTION band). The stack files §9 say how to implement it on the UI thread. This file sits between them: the design of motion, written once in `MOBILE-DESIGN.md` under `motion_system`, then built screen by screen from the inventory's Motion field.

## 1. The three sources of motion

Every animation in the app belongs to exactly one of these. If it belongs to none, it does not exist.

| Source | Purpose | Examples | Band |
|---|---|---|---|
| **Platform** | Keeps the user oriented in space | Push, pop, modal present, tab switch, sheet detents, predictive back, keyboard avoidance | Every band; never re-implemented |
| **Explanation** | Shows that something changed and how | A number rolling to its new value, a row leaving a list, a toggle sliding, a skeleton becoming content, a stepper's consequence line updating | 3 and up |
| **Signature** | Carries the identity in time, the way the signature element carries it in space | The one gesture or choreography a user would recognise this app by: the photo that expands from a row, the jar that fills, the lane that slides when a run ends | 4 and up, on named screens only |

Decorative motion (entrance cascades, idle loops, parallax for its own sake, a pulsing CTA) has no row in this table. It is not a fourth source; it is the absence of design.

## 2. Motion DNA: deriving the signature motion

The signature motion is the dominant idea of the app expressed in time. It comes from the same inputs as the visual territory (`visual-dna.md` §1): the domain's physical world, the moment of use, the extracted reference principles. It is not chosen from a list of effects.

Derive it in this order:

1. **Name the core moment.** The one instant the product exists for: the transfer confirmed, the run finished, the plant watered, the count committed. The signature motion lives there or on the way there, nowhere else.
2. **Ask what physically happens in the domain at that moment.** Coins drop into a jar, a stopwatch stops, a label is printed, a card is turned, the sun moves behind the house. The motion borrows that behaviour, not its picture.
3. **Pick one thing that moves and name everything that stays still.** "Only the number moves; the layout never does" (Apple Weather). "The photo grows out of its row; the chrome does not move." The stillness is half of the signature.
4. **Set the character from the territory.** A thermal label does not bounce; a running track does. Character is one of: `settle` (decelerate, no overshoot), `snap` (fast, slight overshoot), `spring` (physical, interruptible), `glide` (long, gesture-tied). One character app-wide, plus `spring` for anything the finger drives.
5. **Write the non-copy line.** Which reference motion this is derived from and what is not reproduced (`reference-extraction.md` type `motion`).

Examples, written the way they go into `motion_system.signature`:

- Running app, territory `track × stopwatch`: "On finish, the distance numeral stops rolling and the lane line under it draws to its end in 400 ms; nothing else on the screen moves. Character: snap."
- Budgeting app, territory `glass jar × kitchen table`: "When a transaction is saved, the jar's coin level settles to the new amount in 300 ms, decelerating; the list below does not move. Character: settle."
- Warehouse app, territory `shipping label × kanban board`: "The quantity numeral rolls on every stepper change in 180 ms and nowhere else; ink bars, rows and chips never move. Character: snap."
- Sleep app, territory `night street × bedside table`: "The sky behind the list darkens over the evening in real time and never animates on demand; rows fade in place. Character: glide."

A signature motion that could belong to any app ("cards fade in", "the button scales on press") is not a signature; it is a default. Write `none` and let the signature live in space only (EXPRESSION carries the identity, MOTION stays at 3).

## 3. The four moments

`motion_system.moments` names what the app does at each of these. Each has an allowed range per MOTION band; the band is a ceiling, not a target.

| Moment | What it is | Band 1 to 3 | Band 4 to 6 | Band 7 to 10 |
|---|---|---|---|---|
| **enter** | A screen, sheet or object appears | Platform transition only; content is already laid out when it arrives | Platform transition; one element may settle into place (the hero, the headline number), never a cascade | Shared element from the source row or card; gesture-driven present and dismiss |
| **change** | A value or state changes while the screen is open | Toggle and selection feedback; content swaps by cross-fade | Numbers roll; rows enter and leave in place while siblings close the gap; skeleton becomes content without a layout jump | Direct manipulation with physics (drag to reorder, rubber-band limits) |
| **success** | The one success moment (`patterns.md` §9) | Checkmark and haptic | One choreographed moment under 600 ms on the core task: the signature motion usually lives here | Same, may be gesture-completed (pull to confirm) |
| **gesture** | What the finger drives directly | Platform gestures only (back swipe, sheet drag, pull to refresh) | Above, plus swipe actions on rows with Undo | Cards, sheets and canvases follow the finger with spring release |

Rules that hold at every band:

- **Nothing moves under the thumb.** Layout never changes height, position or hit area while the user is tapping or dragging in that region. A stepper that jiggles, a list that reflows while a row is being swiped, a button that moves on press-in: all hard fails.
- **Change motion is proportional to the change.** A one-unit stepper tap moves a digit; it does not flash the screen. A committed count moves the headline number; it does not fly a card across the screen.
- **High-frequency actions get feedback, not animation.** Typing, scrolling, tapping list rows, stepper taps: pressed state and at most a 100 to 150 ms change, never an entrance or a bounce.
- **Entrance is not an event.** Opening a screen is not an achievement; nothing celebrates it. A screen may have at most one settling element on enter, and only at band 4 and above.

## 4. Choreography by screen archetype

The archetype (`composition.md` §2) decides what may move on a screen. The inventory's Motion field names the moment this screen owns, in these terms.

| Archetype | On enter | On change | Owns | Never |
|---|---|---|---|---|
| Hero | the hero element arrives from its source (shared element) or settles once; nothing else | hero state changes in place | the signature motion, if any | staggered secondary content |
| Editorial | platform only; the image is already laid out | nothing beyond pressed states and save feedback | nothing | parallax on the headline image, text fade-ins |
| Canvas | platform only | the object the finger moves, with physics | gesture | toolbars that slide in and out on every tap |
| Feed | platform only; the first viewport is laid out before paint | rows enter and leave in place; media plays only in view | nothing | entering animations in cells, pull-to-refresh theatrics |
| Dashboard | numbers settle to their value once, under 300 ms, if MOTION is 4 or more | numbers roll; a chart draws only on first paint | the change moment | cards sliding in, counters that count up from zero every time |
| Focused Task | platform only; the hero input is ready and focused where the plan says | the consequence line and numeral change with the input; validation appears in place | the change moment, and the success moment at the end of the flow | fields that shift while typing, a CTA that animates while disabled |
| List | platform only | rows enter and leave in place; swipe actions reveal with the finger | gesture (swipe to undo) | fade-in per row, skeleton shimmer longer than 1.5 s |
| Immersive | the media or camera is the first thing visible; controls fade in after 300 ms | controls fade in and out on tap | gesture | HUD elements that bounce, decorative overlays |

Two or more archetypes claiming the same choreography is fine; an archetype moving in a way this table forbids needs a `Breaking` line.

## 5. Timing and easing vocabulary

Four durations, by purpose, inside the 150 to 300 ms floor from `dials.md` §3 (feedback may be shorter, the success moment may total 600 ms):

| Purpose | Duration | Easing |
|---|---|---|
| Feedback (press, selection, toggle) | 100 to 150 ms | standard, or a spring on release |
| Change in place (number, text, color, opacity) | 150 to 200 ms | decelerate |
| Spatial move (row enter/exit, expand, sheet, shared element) | 250 to 300 ms | emphasized decelerate in, accelerate out |
| Success choreography | up to 600 ms total, in at most two steps | decelerate, then hold |

- **Enter decelerates, exit accelerates.** Things arriving slow down into place; things leaving get out of the way quickly (exit about two thirds of the enter duration).
- **Stagger is a sequence, not a cascade.** At most 6 items, at most 30 ms apart, only on first mount of a screen that owns its enter moment, never in lists.
- **Springs** only where the finger just let go, and only interruptible ones. A spring on a tap is a bounce, and a bounce is a tell (J4).
- **Linear** only for progress tied to real time (a timer, a recording).
- **One character** app-wide (`motion_system.character`). Mixing `settle` headlines with `spring` buttons reads as assembled.
- **Reduced motion** collapses every move, scale and bounce to an opacity change or an instant swap; gestures keep working; numbers swap instead of rolling.

## 6. Motion anti-patterns (M-AI)

Cited by Visual QA (VQ11, VQ12) and by tells group J. V means seen on the simulator or recording, S means found in source.

| Code | Anti-pattern | Why it reads as generated | Check |
|---|---|---|---|
| M-AI-01 | Entrance cascade: every element on a screen fades or slides in, staggered | Celebrates arrival; the layout is not stable at paint | S entering animations on more than one element per screen, V |
| M-AI-02 | Entering animations in list or grid cells, replaying on recycle | Noise and a frame-rate bug | S (tell F4) |
| M-AI-03 | Bounce or overshoot on every tap | Toy feel; contradicts every territory except games | S springs on press handlers, V |
| M-AI-04 | Celebration on routine completions (confetti, bloom, checkmark animation on every save) | Dilutes the one success moment | S more than one celebration site; V |
| M-AI-05 | Pulsing, breathing or glowing CTA | Begs for the tap | S loops on a button, V |
| M-AI-06 | Shimmer or pulse loops not tied to loading, or a skeleton that shimmers longer than 1.5 s before content | Implies activity that is not happening | V, S (tell F6) |
| M-AI-07 | Parallax or scale on a header image for its own sake | Ornament; costs scroll performance | S scroll-driven transforms on non-signature screens |
| M-AI-08 | Layout moving under the thumb (height animating while the user taps, a stepper that jiggles, a reflow during a swipe) | Missed taps | V, S layout animation on interactive regions |
| M-AI-09 | A page transition re-implemented inside the screen (whole-screen fade or slide on mount) | Double transition with the navigator's | S opacity or translate on the screen root tied to mount |
| M-AI-10 | Counters that count up from zero on every visit | The number is data, not a reveal | S counter from 0 on focus or mount |
| M-AI-11 | Motion character contradicts the territory (springy bounces in a quiet or utility app; stiff instant swaps in a playful one) | The direction was not read | C compare `motion_system.character` with the build |
| M-AI-12 | Declared signature motion absent from the build, or present on screens the inventory did not name | The direction was written and not built, or became wallpaper | C (tells J2, I4, I5) |
| M-AI-13 | A splash or launch fade longer than the platform's own launch screen | Delays the first viewport | V, S custom splash timers |
| M-AI-14 | Animated mascots or Lottie files unrelated to the domain | Stock personality | C name the domain source of every animated illustration |

## 7. Writing the motion system

Front matter (`templates/MOBILE-DESIGN.md`, schema 3):

```yaml
motion_system:
  character: settle | snap | spring | glide
  signature: "<what moves, where, how long, and what stays still; or none>"
  moments:
    enter: "<platform only | one settling element: which, on which screens>"
    change: "<what rolls, swaps, enters or leaves in place>"
    success: "<the one success moment: screen, trigger, steps, total duration, haptic>"
    gesture: "<platform gestures | plus swipe actions on …| plus what the finger drives>"
  never: "<what this app never animates, in one line>"
```

Prose, under `## Motion system`: each line expanded with its reason and the reference it came from, so a later session can tell a decision from an omission.

Inventory: every screen carries a Motion field after Signature, in these terms: `enter: …; change: …` or `pressed only`. `pressed only` is the expected value for most List, Editorial and settings screens. A screen that owns the success moment says so.

Example, the warehouse app:

```yaml
motion_system:
  character: snap
  signature: "the quantity numeral rolls on every stepper change (180 ms) and nowhere else; ink bars, rows and chips never move"
  moments:
    enter: platform only; the modal arrives with its label block and stepper already laid out
    change: the numeral rolls; the consequence line swaps its figures in place; rows leave the list in place on undo
    success: on Lưu phiếu, Xác nhận xuất, Chốt kiểm kê; one success haptic, the numeral rolls to the new stock, the modal dismisses, a snackbar with Hoàn tác stays 5 s; under 600 ms before the dismiss
    gesture: platform gestures; swipe a history row to undo
  never: entrance of any element, loops, bounces, moving chrome, the scanner reticle beyond a snap on a hit
```

## 8. Motion QA

Motion is checked in Phase 7's visual pass with VQ11 and VQ12 (`visual-qa.md` §2), against the recording made in Phase 8 when a simulator is available, otherwise from source. The evidence is a timestamp in the recording or a file:line. Tells group J (`tells-mobile.md`) lists the signatures of undesigned motion; the stack file's grep block catches the mechanical ones (JS-thread animation, missing reduced-motion branch).

The demo recording (`demo-video.md`) is the proof that the motion system was built: the app doing its job for 10 to 15 seconds, with the signature visible where the inventory says and nothing else moving.
