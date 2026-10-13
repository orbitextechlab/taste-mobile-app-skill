# Demo video

Phase 8. A 10 to 15 second vertical recording of the real build doing its one job, from a simulator or emulator, in one take. It is two things at once: the evidence for the motion pass in Phase 7 (VQ11, VQ12 cite its timestamps), and the clip the product can post on launch day without a mockup tool.

It is not a showreel. No After Effects, no Lottie montage, no device frame flying through space, no music cue in the script. The app, doing its job, at real speed.

## 1. When it runs

After the fix-once round in Phase 7, when a simulator or emulator is available. If none is, the phase is skipped and the delivery note says so; the beat sheet is still written so the next session with a device can record it in a minute. `--direction-only` never reaches this phase.

## 2. The beat sheet

Three beats, one flow, written before recording and kept in `MOBILE-DESIGN.md` under `## Demo`:

```
DEMO: <app> · <flow> · <target length>s
beat 1  0–3 s    identity   <tab root at its first viewport; what is on screen; no touch yet>
beat 2  3–11 s   the task   <taps in order; which screen each lands on; the one input the user makes>
beat 3  last 3 s success    <the success moment from motion_system; the result state the clip ends on>
signature visible at: <beat and screen>
nothing else moves: <what is on screen and stays still>
data: <the seeded records the flow uses, by name>
```

Rules for the script:

- **One flow, the core task.** The flow from `patterns.md` §9's success moment, start to finish. Not a tour of every tab.
- **Start on a tab root at its first viewport**, already loaded, no splash, no sign-in. The first second answers "what is this app" without a tap.
- **End on the result state**, held for at least one second: the new stock figure, the finished run, the saved entry. Never end on the success animation itself and never on a dialog.
- **Real data from the seed**, the same records the screenshots use. No `Test item`, no `John Doe`, no empty lists.
- **Every tap is deliberate**: at most eight, with a beat between them, no scrolling for its own sake, no opening a screen and backing out.
- **The signature motion appears exactly where the inventory says** and the script names the second it will be visible, so the QA pass can find it.

## 3. Prepare the device

iOS Simulator:

```bash
UDID=$(xcrun simctl list devices booted -j | python3 -c 'import json,sys; d=json.load(sys.stdin)["devices"]; print([x["udid"] for v in d.values() for x in v][0])')
# clean status bar, the way store screenshots have it
xcrun simctl status_bar "$UDID" override --time 9:41 --dataNetwork wifi --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100
```

Android emulator:

```bash
adb shell settings put global sysui_demo_allowed 1
adb shell am broadcast -a com.android.systemui.demo -e command enter
adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941
adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false
adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4
adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false
```

Both:

- Reduced motion off, light or dark as the direction's default, system text size at default.
- No development overlays: in Expo Go, drag the dev-menu bubble off the screen or use a development build; in Flutter, no debug banner (`debugShowCheckedModeBanner: false`) and no performance overlay; in Xcode, a Release scheme or at least no view-debugging overlays.
- Seed the data the beat sheet names and open the app on the tab root before recording starts. Metro or the Flutter tool must have finished its first bundle so nothing reloads mid-take.

## 4. Record

iOS:

```bash
xcrun simctl io "$UDID" recordVideo --codec=h264 --mask=ignored --force demo-raw.mp4 &
REC=$!
# wait for "Recording started" on stderr, then perform the beat sheet by hand or with the simulator tool
kill -INT $REC; wait $REC
```

`simctl` finalizes the file after SIGINT; do not kill it harder or the file is truncated. The recording is the simulator's full framebuffer at the device's native resolution (for example 1206×2622 on an iPhone 17 Pro), so it is larger than the clip you will post.

Android:

```bash
adb shell screenrecord --time-limit 20 --bit-rate 8000000 /sdcard/demo-raw.mp4 &
# perform the beat sheet; screenrecord stops at the time limit, or send Ctrl-C to the shell
adb pull /sdcard/demo-raw.mp4 .
```

Driving the taps: by hand on the simulator window, or with the harness's simulator tool when the session has one (tap and text actions in device points). Scripted drivers such as Maestro are fine but not required; a take that needs a script to be repeatable is usually too long.

Take it twice if the first has a hesitation. Do not edit hesitations out: cuts inside a 12 second clip of an app are visible, and the clip is also QA evidence.

## 5. Export

```bash
# trim to the beats, scale to 1080 wide, even height, 30 fps, h264 for posting
ffmpeg -y -ss 0.5 -to 13.5 -i demo-raw.mp4 -vf "scale=1080:-2,fps=30" -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart demo.mp4
# a still from the result state for the README or the store listing
ffmpeg -y -sseof -1 -i demo.mp4 -frames:v 1 demo-end.png
# an animated preview for the README (target under 2 MB; lower fps or width if it is over)
ffmpeg -y -i demo.mp4 -vf "fps=15,scale=540:-2" -loop 0 -q:v 70 -compression_level 6 demo.webp
```

Sizes: the posted clip is 1080 wide and whatever height the device gives (1080×2340 class); the store feature clip, if one is wanted later, is a separate deliverable with its own sizes. The `.mp4` stays out of the repository (add `*.mp4` to `.gitignore`); the `.webp` preview goes under `examples/<name>/screens/` in the skill's own repo and wherever the project keeps its screenshots otherwise.

## 6. Checklist before the clip is called done

Quoted in the delivery note, one line each, with the timestamp where it applies:

- [ ] Starts on a tab root at its first viewport; the app's identity is visible before the first tap (`FIRST VIEWPORT` from `visual-qa.md` §3 passes on frame 1).
- [ ] The flow is the core task and ends on the result state, held for one second or more.
- [ ] The signature motion is visible at the second the beat sheet names, and nothing else moves there (VQ11).
- [ ] The success moment plays once, where `motion_system.success` says (VQ12).
- [ ] No frame drops visible on the recording at normal speed; if there are, the delivery note names the screen and the suspected cause (JS-thread work, a heavy list) rather than hiding it.
- [ ] Clean status bar, no development overlays, no cursor, no keyboard left open at the end.
- [ ] Real seeded data; no placeholder names or empty lists.
- [ ] Reduced motion was off for the take, and the delivery note states whether the reduced-motion path was checked separately.
- [ ] Under 15 seconds, 1080 wide, h264, and the preview under 2 MB.

## 7. What the recording is for

- **Phase 7 evidence.** VQ11 and VQ12 cite `demo.mp4 @ 0:07` the way other questions cite `file:line`. A motion claim without a timestamp or a file:line is not a verified check.
- **The launch post.** A real clip of a real build is the single most convincing artifact a small team can publish, and it cannot be faked by a design tool.
- **The next session.** `mobile-app-studio` watches it before touching the device: it shows what the previous session considered finished.
