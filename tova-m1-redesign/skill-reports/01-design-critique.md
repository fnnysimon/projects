## Design Critique: Tova M1 landing page

Reviewed at http://localhost:4322 at 1440×900 (desktop) and 375×812 (mobile). Stage: built, pre-launch. Goal of the page: get a visitor to reserve a $1,690 home robot.

### Overall Impression
The hero is confident: a friendly robot, a huge product name and the price in the first screen, which is the right instinct for a launch page. The biggest problem is trust, not looks. The page asks for a $1,690 commitment while contradicting itself on the price, the ship date and the deposit, and it never shows the robot doing a real task.

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| Price, ship date and deposit contradict each other: $1,690 / $1690 / $1.690 / $1,749; "fall 2026" / "Q1 2027" / "this summer"; "no deposit" next to "$99 refundable deposit required*" | 🔴 Critical | Pick one source of truth for each fact and repeat it identically in the hero, order band and FAQ. Explain the deposit in one plain sentence next to the button. |
| On a phone the page renders 1,181px wide (no viewport meta + `min-width: 1180px`). The hero shows an empty olive field, "TOVA" is cut off and the robot is off-screen | 🔴 Critical | Add the viewport meta, remove the min-width and stack every grid into one column below ~768px. |
| Three labels for the same action ("Order →", "Buy now", "Submit"), and "Buy now" links to the section it's already in | 🔴 Critical | One verb everywhere ("Reserve for $99", for example). The big button should focus the email field or submit the form. |
| The order form gives no feedback for 1.8 s, stays clickable, and each click opens another "Success!" modal. Errors say "VALIDATION_FAILED (400)" | 🟡 Moderate | Disable the button with a "Reserving…" state. Write field-level errors in plain words ("Enter a 5-digit US ZIP code"). Make the confirmation say what happens next. |
| The task carousel advances every 3 s and can't be paused. Clicking a task doesn't reset the timer, so it jumps away mid-read | 🟡 Moderate | Advance only on click, or add a pause control and stop on hover/focus. |
| The fixed header covers section titles after nav jumps, and it stays transparent over cream sections until you pass the hero | 🟡 Moderate | Add `scroll-margin-top` to sections and give the header a solid background from the start. |
| The cookie banner covers the bottom of every screen, and "reject" is a 10px grey word next to a big black "Accept all" | 🟡 Moderate | Make "Reject" a button as visible as "Accept", and use a smaller corner card. |
| "click here to see all skills", "Contact us", "terms" and the footer links go nowhere | 🟢 Minor | Link them to real pages or remove them for launch. |
| The cart icon opens "Your cart is empty" with no next step | 🟢 Minor | Remove the cart until there's a store, or link it to the order band. |

### Visual Hierarchy
- **What draws the eye first**: the robot, then "TOVA M1". That's right for a product launch. The price line under it is the third thing you see, but at weight 300 on olive it reads as a caption, not a selling point.
- **Reading flow**: hero → tasks → dark marketplace → specs → press → table → FAQ → orange order band. The order is logical. But there's no call to action between the hero and the very bottom, about 6 screens of scrolling, and the nav "Order" pill is the only shortcut.
- **Emphasis**: section titles (56px Unbounded) shout louder than the content they introduce, and the supporting text is pale grey everywhere, so every section reads "big headline, faint body". The orange order band is the strongest block on the page, which is right, but its secondary text is too faint to read.

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| Colour | Four oranges: `#FF6B2C` (token), `#FF6A2B` (logo), `#f97316` (button), `#FF5A1F` (brand.md). Most greys are hardcoded hex values, not tokens | Keep one orange token and replace every hardcoded value with a token. |
| Buttons | Five styles: dark pill, light pill, orange pill that rotates on hover, an uppercase Inter button with a 6px radius and hard shadow, and a black "Submit" | One primary and one secondary style, both pills, sentence case, as brand.md asks. |
| Typography | Four families (Unbounded, Nunito, Space Mono, Inter). Mono uppercase labels are used for eyebrows, badges, tasks, spec titles, citations and the footer, so they stop meaning anything | Drop Inter. Keep mono for one role only, such as spec values. |
| Radius | About ten radii (4, 6, 8, 12, 14, 20, 24, 28, 30, 32px) | Pills and 24px, as the brand says. |
| Cards | The featured skill card is square-cornered and scaled up so it overlaps its neighbours. The spec cards mix shadowed white, flat sand and inline-styled black | One card recipe, and highlight the featured card with a badge or border, not scale. |
| Casing | ALL CAPS labels, a lowercase eyebrow, "FREE" vs "free" | Sentence case everywhere except the logo. |

### Accessibility
- **Colour contrast** (WCAG AA needs 4.5:1 for body text, 3:1 for large text), measured:
  - Fails badly: nav links 2.3:1, section labels 1.9:1, inactive tasks 1.8:1, footer 1.7:1, cookie "reject" 1.6:1, form placeholders 1.6:1, hero eyebrow 2.0:1, "scroll" hint 1.6:1.
  - Fails: section subtitles 3.3:1, hero subtitle 2.9:1, white on the orange band 2.8:1, order note 2.1:1, skill metadata 2.4:1, press quotes 2.5:1.
- **Touch targets**: the cart button is 22×22px (minimum 24, recommended 44). The spec "i" icons are 16px and only work on hover, so they don't work at all on touch screens.
- **Text readability**: the body text is 15px, and important details (deposit note 11px, footer 11px, badges 10px) are tiny. The 22px light-weight hero subtitle is thin on a mid-tone background.
- **Alternative text**: the robot image and the task image have no `alt`. "Folding clothes" shows a broken image.
- **Also**: focus outlines are removed site-wide, tasks and FAQ questions are clickable `<div>`s (not keyboard-reachable), and the floating robot animation ignores reduced-motion settings. Run `/accessibility-review` for the full audit.

### What Works Well
- **A clear hero:** product, name and price in the first screen, with an approachable, toy-like robot that makes a $1,690 machine feel friendly rather than industrial.
- **A good page structure:** "what it does → how it learns → what's inside → proof → compare → FAQ → buy" is the right sequence for a considered purchase.
- **A distinctive palette:** olive, cream, ink and orange stand out from the usual blue-tech look, and the dark marketplace section gives the page rhythm.
- **The right FAQ questions:** shipping, safety around kids and pets, internet dependency, price changes and cancellation are exactly what a buyer worries about.

### Priority Recommendations
1. **Make every fact agree.** One price ($1,690), one ship window, one clear deposit sentence next to the button. Contradictions at the moment of paying kill trust faster than any visual flaw.
2. **Make it work on a phone.** Viewport meta, no min-width, stacked layouts. Most launch traffic comes from social links opened on mobile, and today the first screen there is an empty olive field.
3. **One call to action, repeated.** "Reserve for $99" in the nav, after the tasks section and in the order band, all doing the same thing, with a loading state and a confirmation that says what happens next.
4. **Show, then reassure.** Replace the static illustration in the task stage with real footage (or clearly labelled renders), and put warranty, returns, safety certification and delivery regions right next to the price.
5. **Raise the floor on contrast and the system.** Darken the greys to at least 4.5:1, bring back focus rings, and collapse the colours, buttons, fonts and radii back to what tokens.css and brand.md already define.
