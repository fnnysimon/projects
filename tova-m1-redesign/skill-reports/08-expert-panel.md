# 🗣️ Expert Panel: the interactive hero robot ("Look inside Tova")

**Idea on trial (V1):** the hero robot just built from `07-interaction-design.md`. It turns toward the pointer and its eyes follow you. It blinks and floats. Clicking it opens a battery hatch, raises the antenna, waves, and shows the chip "Battery · 6–8 hours per charge".
**Assumption:** the page's job is waitlist sign-ups from sceptical parents. That's the "Maya" persona in `04-ux-discovery.md`, whose top worries are safety, privacy and price, in that order.

## Step 1: Frontal critique

### 📉 Business Strategist: The Pragmatist
> "It's charming. It's also a dead end. Delight that doesn't lead anywhere is a cost centre with good animation."

- **Flaw 1: the reveal answers a question nobody asked.** Discovery ranked the purchase worries as safety, privacy, then price. Battery life isn't on that list. The most expensive interaction on the page delivers its least important fact.
- **Flaw 2: no path to the goal.** Once the hatch is open, the visitor is stuck admiring it. The chip doesn't link anywhere, the CTA isn't repeated, and nothing is measured. There's no `robot_open` event, so in a month nobody will know if this helped or hurt sign-ups.
- **Flaw 3: it competes with the CTA.** A 560 × 760 px clickable area with a dark chip saying "Click Tova…" is the biggest and most inviting target in the hero. The intended action is a 48 px button on the left.

### ⚙️ Tech/Ops Expert: The Realist
> "Hand-placed SVG coordinates and CSS variables updated every frame. Lovely on the designer's MacBook. Let's talk about the 4-year-old Windows laptop."

- **Flaw 1: cost of every frame.** Each `pointermove` sets `--tx`/`--ty` on the SVG root, which recalculates transforms on about 15 SVG groups. SVG transforms usually aren't composited on the GPU, so this means repaints over the largest element on the page. Tracking also keeps running when the hero is off-screen, as long as the pointer is still over it.
- **Flaw 2: two drawing styles on one page.** The tasks section still uses the old gradient `img/tova-m1.svg`. The hero is now outlined and flat. A visitor scrolling sees two different robots, which hurts a hardware brand that needs to look precise.
- **Flaw 3: an invented product detail.** "Two battery cells behind a chest hatch" doesn't exist in any spec. If engineering ships a sealed battery, the page has illustrated a feature that isn't there, and that's a support ticket waiting to happen.

### 🌪️ Devil's Advocate: The Destroyer
> "You built a robot with cameras for its eyes, and your hero's party trick is… it watches you."

- **Flaw 1: gaze tracking on a camera product.** For a parent worried that "it's always watching", eyes that follow their cursor say exactly the wrong thing. The trust section then spends 4 cards explaining that it doesn't watch you. The hero undercuts the reassurance before people even reach it.
- **Flaw 2: opening the chest makes it feel like a machine.** A friendly companion becomes a device with guts. The reveal says "machine", while the brand is trying to say "gentle".
- **Flaw 3: most visitors never see it.** On phones, which are likely most of the traffic (an estimate, not measured), there's no tracking, so the robot is static with a "Tap Tova" label. If nobody taps, the only thing the work achieved is changing the art style.

## Step 2: The debate

> **📉 Pragmatist:** "Destroyer, you're overstating the creep factor. Eyes that follow the cursor are a classic delight pattern. Mascots do it everywhere and nobody calls the police."

> **🌪️ Destroyer:** "Mascots don't have four HD cameras and a microphone. On this product, the metaphor is the literal feature. The parents who worry about privacy are the ones you most need to convert, and you're greeting them with surveillance as a joke."

> **⚙️ Realist:** "Then fix both at once. You already have the hardware story: a camera light and a shutter, which the trust section says are real 🔶. Make the reveal show those. Same parts, same toggle, no new illustration debt."

> **📉 Pragmatist:** "Now that I can sell. The reveal turns into proof of the number-one objection, and the chip links to `#safety`. That's a path. But don't kill the head turn: it's what makes people want to click in the first place."

> **🌪️ Destroyer:** "Keep the head turn and freeze the eyes, then. A head that turns says 'attentive'. Pupils that track your pointer say 'tracking'. That's the difference between a dog and a CCTV camera."

> **⚙️ Realist:** "And on phones? Please don't add device-motion tracking. It needs a permission prompt on iOS, and it drains attention."

> **🌪️ Destroyer:** "Then play the reveal once by itself the first time the robot scrolls into view: shutter closes, light turns off, it reopens, done. One time, 2 seconds, skipped with reduced motion. Otherwise mobile users never learn that it does anything."

> **📉 Pragmatist:** "An autoplay in the hero, right next to the CTA? That's exactly the attention steal I complained about. Make it smaller, or play it on the robot's first tap only."

> **⚙️ Realist:** "On performance: pause tracking with an IntersectionObserver when the hero leaves the viewport, and move the per-frame work onto three or four HTML-level layers instead of fifteen SVG groups. Then measure on a low-end machine before arguing about anything else."

**Unresolved:** the Pragmatist and the Destroyer still disagree about **autoplaying once on mobile**. The Destroyer says it's the only way mobile users discover the robot. The Pragmatist says it competes with the CTA. → Settle it with an A/B test, not an opinion (see the action plan).

## Step 3: V2 of the idea

**In one sentence:** the hero robot turns toward you but never stares, and its one interaction shows the privacy hardware parents worry about, then hands off to the safety section and the waitlist.

| | V1 | V2 | Why |
|---|---|---|---|
| Gaze | Head **and pupils** follow the pointer | The head turns toward the pointer; **the eyes stay still** and keep blinking | Attentive, not surveillance (the Destroyer's flaw 1) |
| Reveal | Battery hatch and cells | **Privacy mode:** a shutter slides over the screen, the eyes switch off, and the camera light goes dark. Chip: "Camera off · Slide the shutter anytime" | Proves the top purchase worry instead of a minor spec (the Pragmatist's flaw 1); no machine guts (the Destroyer's flaw 2) |
| Antenna and wave | Antenna rises and pings, hand waves | Kept, but they play when the robot **reopens**: "I'm back, hello" | Keeps the charm and gives the toggle a clear ending |
| Path onward | Dead end | The chip becomes a link: "How Tova protects your privacy →" (to `#safety`) | A route to the goal (the Pragmatist's flaw 2) |
| Hint | A large dark chip under the torso | A smaller, lighter hint that appears only after 3 s of hovering the hero, or on the first scroll on mobile | Doesn't compete with the CTA (the Pragmatist's flaw 3) |
| Mobile | Static plus "Tap Tova" | **A/B test:** (A) a single 2 s autoplay of privacy mode on first view vs (B) no autoplay. Both versions skip motion when reduced motion is on. | Settles the unresolved disagreement with data |
| Performance | 15 SVG groups updated every frame, always on | 3–4 depth layers; paused off-screen with an IntersectionObserver; profiled on a low-end laptop at 60 fps | The Realist's flaw 1 |
| Consistency | Two robot styles on the page | The tasks image is redrawn in the same outline style | The Realist's flaw 2 |
| Truthfulness | An invented battery hatch | Only the parts listed in the trust section's claims (light, shutter), still 🔶 for product and legal sign-off | The Realist's flaw 3 |
| Measurement | None | Events `robot_privacy_toggle` and `robot_chip_click`, plus waitlist conversion with vs without interaction | It can now be judged |

**Action plan:**
1. **Freeze the pupils.** Remove the `.r-eyes` translate and keep the head turn and blinking. (15 min)
2. **Build privacy mode.** Add a shutter that slides over the screen, an eyes-off state and a camera light. Retire the battery hatch and move the battery fact back to the specs only. (half a day, estimate)
3. **Turn the chip into a link** to `#safety`. Restyle it as a lighter hint with delayed appearance. (1 h)
4. **Performance pass.** Flatten to 3–4 depth layers, add an IntersectionObserver pause, and profile on a low-end machine. Target: no long frames while tracking. (half a day, estimate)
5. **Redraw the tasks image** in the same outline style. (half a day, estimate)
6. **Instrument** the two events, and set up the mobile autoplay A/B test with a simple 50/50 split. Read the results after a statistically useful sample; don't stop early.
7. **Get sign-off:** product and legal confirm the camera light and shutter (trust claim 🔶 3 in `05-ux-copy.md`) before launch.
8. **Five-user test (cheap):** show the hero to 5 parents and ask "What do you think this robot does when you're not there?" If anyone says "watches", rework the gaze again.

## Risks identified | Mitigation

| Risks identified | Mitigation solutions |
|---|---|
| Gaze tracking reads as surveillance to privacy-anxious parents | Freeze the pupils and only turn the head; validate with a 5-parent test before launch |
| The reveal promises hardware that doesn't exist (battery hatch, or a shutter if it gets cut) | Only illustrate claims on the sign-off list; block launch on product/legal approval of claim 🔶 3 |
| The robot steals attention from the waitlist CTA | Smaller, delayed hint; the chip routes to `#safety` and then the form; measure the conversion difference |
| Mobile visitors never discover the interaction | A/B test one 2 s autoplay on first view vs none; always skipped with reduced motion |
| Janky tracking on low-end laptops | 3–4 layers, pause off-screen, profile at 60 fps; drop tracking if a device can't keep up |
| Two inconsistent robot illustrations on one page | Redraw the tasks image in the hero's outline style; add an "Illustration" section to `brand.md` |
| Nobody can tell whether it worked | `robot_privacy_toggle` and `robot_chip_click` events plus a waitlist conversion comparison |
| Reduced-motion users lose information | The state still changes instantly and the chip text carries the fact; nothing important is conveyed by motion alone |

---

### Update: V2 built (2026-11-12)

- **Done:**
  - **Step 1:** the pupils are frozen. Only the head turns, and it stops following you in privacy mode ("it can't see you").
  - **Step 2:** privacy mode replaces the battery hatch. A shutter with ridges and a handle slides over the screen, the eyes switch off, and the lime camera light on the head goes dark. A lens is drawn on the screen. The battery fact now lives only in the specs.
  - **Step 3:** the hint is a light card that appears after 3 s hovering the hero, at once on keyboard focus, or after 1.5 s in view on touch. In privacy mode it reads "Camera off · Slide the shutter anytime" with the link "How Tova protects your privacy →" (to `#safety`). The live region announces "Camera off." / "Camera on.".
  - **Antenna and wave:** they now play when the camera comes back on.
  - **Step 4:** 4 layers instead of 7. Tracking and blinking pause when the hero is off-screen (IntersectionObserver).
  - **Step 5:** `img/tova-m1.svg` (the tasks panel) is redrawn in the same outline style.
  - **Step 6:** a `track()` stub sends events to `window.dataLayer`: `robot_privacy_toggle {state}`, `robot_chip_click`, `robot_autoplay_shown`, and `waitlist_join {robot_used, robot_variant}`. On touch devices, the mobile A/B variant (`autoplay` / `control`) is stored in `localStorage` under `tova_robot_ab`. The autoplay plays privacy mode once (2 s) on first view. It doesn't touch `aria-pressed`, and a tap cancels it.
- **Not done (needs people, not code):**
  - **Step 7:** product/legal sign-off on the camera light and shutter.
  - **Step 8:** the 5-parent test.
  - No analytics tool is connected yet. Events are queued in `dataLayer` only.
  - The low-end laptop profiling hasn't been run.
