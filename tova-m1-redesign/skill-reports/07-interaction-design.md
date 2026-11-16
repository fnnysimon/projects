# Interaction Spec: hero robot ("Look inside Tova")

> **V2 (2026-11-12):** after the expert panel (`08-expert-panel.md`), the battery hatch was replaced by **privacy mode** (shutter, eyes off, camera light off), the pupils no longer follow the pointer, and the antenna and wave play when the camera comes back on. The timing and accessibility principles below still apply; see the update at the end of report 08 for what changed.

**Today:** the hero robot is a flat `<img>` (`img/tova-m1.svg`) with one infinite `float` animation: 22 px up and down and ±1.5° every 3 s. Nothing responds to the visitor. The motion carries no meaning and is quite large for a loop that never stops.

**Inspiration (provided by the user):** a product drawn with simple grey outlines and flat fills. Its thickness shows as an offset back face. It turns toward the cursor, then opens a battery hatch on its hinge to show the cells inside, and an antenna pops out. The motion explains the product instead of decorating it.

**Direction:** keep Tova's colours and silhouette (cream shell, dark joints, orange eyes and antenna, olive hero), and switch to the inspiration's drawing style: one ink outline weight, flat fills, an offset "thickness" layer. Then give the robot three behaviours that show something true about the product: it **notices you**, it **opens up**, and it **says hello**.

## Goal and context
- **User:** a first-time visitor on the landing page, browsing on a laptop (pointer) or a phone (touch). They're curious but haven't decided yet, and they spend a few seconds on the hero.
- **Most important outcome:** the robot feels alive and approachable, so "a robot in my home" feels friendly rather than creepy. A secondary outcome is learning one real fact (battery life) through play.
- **Constraint:** the robot must never compete with the hero CTA or block reading. Everything is optional; the page works fully without touching the robot.

## Microinteraction map

| Part | Behaviour |
|---|---|
| **Trigger 1: presence** (system + pointer) | The pointer moves over the hero (fine pointers only). |
| **Rules 1** | The robot turns toward the pointer. The head moves most (up to 14 px and ±4°), the face and eyes a little more (a parallax "turn"), the torso less (6 px), and the base not at all. The thickness layers shift the opposite way, so the edges show as it turns. When the pointer leaves the hero, it eases back to centre. |
| **Trigger 2: activation** (user) | Click or tap the robot, or press Enter/Space when it has focus. It's a real `<button>`. |
| **Rules 2** | Opening runs in order: (1) the chest hatch swings open on its right hinge, showing two battery cells; (2) the antenna telescopes up and pings; (3) the right hand waves twice. Pressing again reverses it (antenna down, hatch closed). The state is a toggle with `aria-pressed`. |
| **Trigger 3: idle** (system) | Time passes. |
| **Rules 3** | The robot blinks at a random interval of 3.5–6.5 s and floats gently (8 px over 4 s). |
| **Feedback** | Pointer: the gaze follows, so it's immediately clear the robot is responsive. Hover or focus: the robot lifts 6 px and the orange core glows, so it reads as clickable. Open: a visible chip changes from "Click Tova to look inside" to "Battery · 6–8 hours per charge" (the chip is an `aria-live` region). |
| **Loops and modes** | There are two modes, closed and open. Nothing times out or auto-closes: the visitor stays in control. Blink and float loop forever but are small. All loops stop with reduced motion. |

## States

| State | What the user sees | What they can do |
|---|---|---|
| Idle (closed) | Robot facing forward, floating gently, blinking. Chip: "Click Tova to look inside" ("Tap" on touch). | Move the pointer, click, or Tab to it |
| Tracking | Head, eyes and body turn toward the pointer, and the thickness edges show | Keep moving or click |
| Hover / focus | Robot lifts 6 px, orange core glows. Focus adds the white 3 px focus ring (hero focus colour). | Click / Enter / Space |
| Pressed (active) | Robot dips 2 px for 100 ms | Release to toggle |
| Opening → open | Hatch swings open, cells visible, antenna up with a ping ring, hand waves. Chip: "Battery · 6–8 hours per charge". | Click again to close; keeps tracking |
| Closing | Antenna retracts first, then the hatch shuts | Click again mid-way: it reverses smoothly (CSS transitions can be interrupted) |
| Reduced motion | No float, tracking, blink or wave. Toggling still works and changes state instantly. | Same actions, no movement |
| Touch device | No tracking (no hover). Tap toggles. | Tap |
| No JavaScript | Static, closed robot. The button does nothing, but the page is unaffected. | Nothing lost |

## Timing

| Event | Delay / duration | Reason |
|---|---|---|
| Tracking response | Eased each frame (12% of the remaining distance), settles in ~250 ms | Under the 400 ms Doherty threshold, so it feels alive. Smoothing stops the jitter that raw 1:1 tracking would cause. |
| Return to centre on leave | Same easing, ~400 ms | Calm, no snap |
| Hover lift | 200 ms | Noticeable but instant-feeling (0.1–1 s band) |
| Press dip | 100 ms | Under 0.1 s, so it reads as direct manipulation |
| Hatch open | 600 ms, starts at 0 ms | Long enough to read the hinge movement, short enough to stay in flow |
| Antenna up | 450 ms, starts at 250 ms | Staggered so each part is seen; finishes before 1 s |
| Wave | 2 × 700 ms, starts at 500 ms | Two waves read as "hello"; one reads as a glitch |
| Close | Antenna 300 ms, hatch 400 ms (starts at 150 ms) | Closing is faster than opening because the visitor already knows what happens |
| Blink | 140 ms, every 3.5–6.5 s (random) | Natural blink length; randomness stops it feeling mechanical |
| Float | 4 s loop, 8 px | Was 3 s and 22 px: too busy for a loop that never stops |

## Motion

| Element | Trigger | Change | Duration | Easing | Purpose |
|---|---|---|---|---|---|
| Head, face, eyes, torso | Pointer move | translate / rotate by depth layer | eased per frame | exponential smoothing | Feedback: "it notices you"; fakes 3D like the inspiration |
| Thickness layers | Pointer move | Opposite offset | eased per frame | same | Shows volume (the inspiration's back face) |
| Chest hatch | Toggle | scaleX 1 → −0.82 around the right hinge, plus a slight skew | 600 / 400 ms | `cubic-bezier(.34,1.35,.64,1)` (small mechanical overshoot) / ease-in-out | Shows a relationship: what's inside, and where the battery lives |
| Battery cells | Open | Charge bars fill left to right | 500 ms, starts at 400 ms | ease-out | Directs attention to the fact in the chip |
| Antenna | Toggle | Inner mast slides up 46 px; a ping ring expands and fades | 450 ms | `cubic-bezier(.34,1.35,.64,1)` | Feedback: "I'm on" |
| Right forearm | Open | rotate ±18° around the elbow, twice | 1400 ms | ease-in-out | Emotional: a friendly hello |
| Eyes | Idle timer | scaleY 1 → 0.1 → 1 | 140 ms | ease-in-out | Signals it's alive |
| Robot wrapper | Idle | translateY 0 ↔ −8 px | 4 s loop | ease-in-out | Signals it's alive (reduced from today) |

**Reduced motion (`prefers-reduced-motion: reduce`):** no float, tracking, blink, wave or antenna ping. The hatch and antenna jump straight to their final state, because the state change carries information and the movement doesn't. The chip text still updates.

## Errors and recovery
- No destructive action and no data, so there's nothing to confirm or undo. The toggle itself is the undo.
- **Spam-clicking:** CSS transitions reverse from their current position, so there's no queue of animations and nothing breaks.
- **Pointer outside the hero, or the page scrolled away:** tracking pauses (no work done off-screen) and the robot recentres.
- **Tab hidden:** the blink timer and animation frames stop on their own (`requestAnimationFrame` pauses, and the timer checks `document.hidden`).

## Principles check

| Principle | Status | Note |
|---|---|---|
| Visibility of system status | ✅ | `aria-pressed`, a visible chip, and an obvious open state |
| Match with the real world | ✅ | A hinged hatch and a telescoping antenna behave like physical parts |
| User control and freedom | ✅ | Nothing auto-plays its reveal; toggle back anytime; motion can be turned off by the OS setting |
| Consistency and standards | ✅ | A real `<button>`, the same focus ring as the rest of the hero |
| Error prevention and recovery | ✅ | Interruptible transitions |
| Fitts's law | ✅ | The whole robot is the target (≈ 560 × 760 px desktop, ≈ 270 × 370 px mobile) |
| Hick's law | ✅ | One action only (toggle). The CTA stays the only other choice in the hero. |
| Doherty threshold | ✅ | Every response starts in under 100 ms; tracking settles in about 250 ms |

## Accessibility
- **Name:** `<button aria-pressed="false">`, labelled "Look inside Tova" (a visually hidden span). The SVG is `aria-hidden`.
- **Keyboard:** it's in the tab order after the hero CTA (it sits after the content in the DOM). Enter and Space toggle it. Focus is visible with the white ring on olive.
- **Announcement:** the chip is `aria-live="polite"`, so opening announces "Battery · 6–8 hours per charge" once and doesn't steal focus.
- **Target size:** far above 44 × 44 px.
- **No information carried by motion alone:** the battery fact is in the chip text and in the specs section.

## Open questions
- **To decide:** should opening the hatch also scroll to or highlight the Battery spec? (Not done; it could feel hijacking.)
- **To decide:** should touch devices get a gentle automatic "look around" instead of pointer tracking? (Not done; it's battery- and attention-hungry on phones.)
- 🔶 **Product to confirm:** the drawing shows **two battery cells** behind a hatch in the chest. Confirm the real battery layout before launch, or keep it as a clearly illustrative drawing.
