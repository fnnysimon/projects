# UX Discovery Report: Tova M1 landing page

> **Read this first.** Tova is a fictional product, and no user research, analytics or sales data exists. The only evidence **[E]** is the page itself (`site/`) and the three earlier reports (critique, design-system audit, accessibility audit). Everything about real buyers is an assumption **[A]**. The personas are **proto-personas**, and nothing here is a quote, a count or a metric from real people.

## Summary
The most likely buyer of a $1,690 home robot is a time-poor household that already pays for convenience, such as a parent who owns a robot vacuum. Their main job is to hand off repetitive chores without risking the family's safety or privacy [A].

The biggest risk is that the page asks for a $99 commitment without proving the core promise. The task showcase uses the same illustration for all six chores [E]. And for a device with four cameras and a microphone that needs an account, the page says nothing about privacy [E].

Top recommendation: before more visual polish, add **proof and reassurance next to the price**:
- real task footage;
- a privacy and safety block;
- total cost of ownership (skills subscriptions, warranty, returns, delivery).

Then run five short sessions with robot-vacuum owners to check that this is what they need.

---

## 1. Discover

- **Subject:** the Tova M1 pre-order landing page (`site/index.html`), at the **built** stage. It's a single page that goes hero → tasks → skills marketplace → specs → press → comparison → FAQ → reservation form. Three rounds of fixes are already applied (facts, mobile, the call to action, tokens, accessibility) [E].
- **Goal:**
  - *For users:* decide with confidence whether a $1,690 robot will really take chores off their plate, and reserve without anxiety [A].
  - *For the business:* reservations ($99 refundable deposits) that **stay** reserved until shipping in Q1 2027. A deposit that's refunded later is a cost, not a win [A].
- **Users:** consumer households in the US (the form accepts US ZIP codes only [E]), plus a smaller group of tinkerers drawn by "open ROS 2" and the skills marketplace [E for the messaging, A for the audience].
- **Constraints:**
  - one static page;
  - the product won't ship for months, so there's no real footage of customer homes yet [A];
  - US only [E];
  - a $1,690 price with a $99 deposit [E];
  - the robot needs an account and internet for skills [E].
- **Key questions:**
  1. Who buys a $1,690 home robot, and what triggers the search?
  2. What do they need to see before putting down $99?
  3. Which fears (safety, privacy, "will it actually work", hidden costs) stop them?
  4. Does one page serve both households and tinkerers, or does one group dilute the other?
  5. What keeps someone reserved during a wait of several months?

## 2. Research intake

| Source | What it tells us | Type |
|---|---|---|
| The page: hero and tasks | It promises "the most capable home robot for $1,690" and 6 chores. **Every task shows the same robot illustration**, with a caption only | [E] |
| The page: FAQ | It covers shipping, safety ("torque-limited, stops on contact, 0.6 m/s"), internet dependency, price lock and cancellation. No certification is named | [E] |
| The page: specs | 4× 720p cameras, a far-field mic, lidar, 6–8 h battery. Jargon ("7+1 DOF") is explained only in hover tooltips | [E] |
| The page: skills marketplace | Third-party skills at $4.99 or **$1.99/month**. It doesn't say whether the core chores are included or need paid skills | [E] |
| The page: comparison table | "Works offline: ✗" for Tova, against "Competitor A / B" with no names | [E] |
| The page: order band | $99 refundable deposit, $1,591 due at shipping, "8,400 people have already reserved". No warranty, returns, financing, delivery or support info | [E] |
| The page: press and badges | Three short quotes from outlets without links, "Backed by Halden Ventures", "Built on open ROS 2" | [E] |
| 01-design-critique.md | The main weakness is trust, not looks: no real footage, contradictions (now fixed), and no reassurance near the price | [E] (about the design) |
| 03-accessibility-audit.md | The conversion area was the least accessible part of the page (now fixed) | [E] (about the design) |
| Category knowledge | Buyers of consumer robots usually already own a robot vacuum or smart speaker. Privacy and "does it really work" are recurring objections in this category | [A] |

**Gaps, and the cheapest way to fill each one:**

| Gap | Cheapest way to find out |
|---|---|
| Who actually reserves (household type, income, existing devices) | 1-question survey on the confirmation screen: "What made you reserve today?" + an optional household checkbox |
| What proof people need before reserving | 5 moderated remote sessions with robot-vacuum owners who are parents (think-aloud on the live page) |
| How strong the privacy concern is | Same 5 sessions, plus a 3-question survey to the existing reservation list |
| Whether "Works offline ✗" or the skills subscription puts people off | Fake-door test: a "What's included?" link next to the price, tracking clicks and time spent |
| Why people cancel | A 1-question exit survey on the cancellation flow (none exists yet) |

## 3. Personas

All three are **proto-personas** (assumption-based). No quotes.

### Maya, the time-poor parent (primary)
Two working parents, two kids under 10, a suburban house. They already pay for convenience: a robot vacuum, grocery delivery, a cleaner twice a month [A].
- **Goals:** win back evenings, reduce the daily "tidy-up loop" (toys, dishes, laundry), stop arguing about chores.
- **Frustrations:** gadgets that over-promise (the vacuum gets stuck), subscriptions that creep up, setup that eats a weekend.
- **Behaviors:** discovers products through short social videos and friends, researches on the phone in the evening, reads reviews and FAQs, decides with their partner.
- **Needs from Tova:**
  - proof it really does *their* chores (laundry, dishes, toys), at real speed;
  - safety around kids and pets, backed by a certification, not just a sentence;
  - a clear total cost and an easy way out (refund, return, warranty).
- **Confidence:** proto-persona.

### Daniel, the tinkerer (secondary)
A software engineer in their late twenties who runs ROS at home and follows robotics launches [A].
- **Goals:** a capable, affordable two-armed platform to experiment with, and to publish skills others use.
- **Frustrations:** closed platforms, research robots at $20k+, vague specs.
- **Behaviors:** goes straight to the specs, the docs and GitHub, and reads forums. A desktop user who buys early and tolerates rough edges.
- **Needs from Tova:**
  - real specs and an SDK or docs link;
  - clear openness: ROS 2 version, local control, what works offline;
  - creator terms for the skills marketplace.
- **Confidence:** proto-persona. The audience is suggested by the "open ROS 2" badge [E], but its size is unknown.

### Sam, the remote caregiver (exploratory)
An adult in their mid-forties, considering Tova for a parent who lives alone [A].
- **Goals:** help a parent stay independent longer (fetching, tidying, reminders).
- **Frustrations:** tech the parent won't use, unreliable support, no way to check in remotely.
- **Behaviors:** researches carefully, compares with home-care costs, asks about support and reliability.
- **Needs from Tova:**
  - an easy, voice-driven experience for a non-technical person;
  - support, warranty and what happens if it breaks;
  - how fall and safety situations are handled (or a clear statement that they aren't).
- **Confidence:** a weak proto-persona. Keep it only if research shows this segment exists.

## 4. Jobs to be done

### Job 1: offload the daily chores (Maya)
- **Statement:** When **the house is a mess again after a long workday**, I want to **hand the repetitive tidying, dishes and laundry to something reliable**, so I can **spend the evening with my family instead of cleaning**.
- **Functional:** completes the chores well enough, without supervision, around kids and pets.
- **Emotional:** feel in control of the house, less guilty and less tired.
- **Social:** look organized, not "lazy". The household agrees it was worth the money.
- **Current alternatives:** doing it themselves, splitting chores with the partner and kids, a cleaner (paid per visit), a robot vacuum (floors only).
- **Pains with those alternatives:** a daily time sink, conflict, a cleaner who is infrequent and expensive over a year, a vacuum that only does one job.

### Job 2: build on an affordable robot platform (Daniel)
- **Statement:** When **I want to experiment with manipulation at home**, I want to **get a capable, open two-armed robot at a hobbyist price**, so I can **build and share skills without a lab budget**.
- **Functional:** documented hardware, an SDK, local control, ROS 2 compatibility.
- **Emotional:** the excitement of being early, and of mastering it.
- **Social:** reputation from publishing popular skills.
- **Current alternatives:** simulation, DIY arm kits, used research robots.
- **Pains with those alternatives:** a gap between simulation and reality, single-arm kits, prohibitive prices.

### Job 3: help a parent stay independent (Sam)
- **Statement:** When **my parent struggles with daily tasks and I can't be there**, I want to **give them help they'll actually accept**, so I can **worry less and delay more costly care**.
- **Functional:** simple to use, reliable, supported.
- **Emotional:** less worry and guilt.
- **Social:** being a "good" child, and the parent keeps their dignity.
- **Current alternatives:** visits, paid home help, smart speakers, medical alert pendants.
- **Pains with those alternatives:** cost, coverage gaps, devices that are rejected or forgotten.

## 5. User journey

Main persona **Maya**, Job 1, starting from a social video on a phone [A].

| Stage | User action | Thinking / feeling | Touchpoint | Pain point | Opportunity |
|---|---|---|---|---|---|
| 1. Trigger | Sees a short clip of a robot folding laundry, taps the link | Curious and a bit sceptical: "Is this real?" | Social video → hero (mobile) | The hero shows an illustration, not the robot from the video [E] | Open with a real photo or video loop that matches the ad |
| 2. Orient | Reads the hero, sees "$1,690" and "Reserve for $99" | "Cheaper than I expected. What does it actually do?" | Hero | Clear, but the price is shown without context (vs. a cleaner, vs. a vacuum) [A] | Add a one-line value anchor ("about the cost of 12 cleaner visits") [A] |
| 3. Evaluate the promise | Taps through the tasks | "Can it really fold *my* laundry? How fast?" | Task tabs | **The same illustration for every task.** The captions mention speed ("0.8x") but show nothing [E] | Real footage per task, with speed and a "what it can't do yet" note |
| 4. Trust check | Scrolls to the FAQ, specs and press | "Is it safe with the kids? Is it watching us?" | FAQ, specs (4 cameras, mic), press | Safety in one sentence with no certification. **No privacy section at all** [E] | A "Safe and private by design" block: certification, camera shutter or LED, on-device processing, data policy |
| 5. Cost check | Looks for the total cost | "Are there subscriptions? What if it breaks?" | Skills marketplace ($1.99/mo), order band | Unclear whether chores need paid skills. No warranty, returns or financing [E] | A "What's included" list next to the price, plus warranty, returns and financing |
| 6. Decide and reserve | Fills in email + ZIP and reserves | "OK, it's refundable. Let's try." | Order form | Now clear and accessible [E]. Partner approval may happen later, with no "share with partner" option [A] | A "Send this to someone" link, and save the reservation for later |
| 7. Wait (months) | Gets a confirmation email, waits for Q1 2027 | "Did I make a mistake? Is it still coming?" | Email, account | No update plan is visible on the page [E] | Promise monthly build updates and a delivery-window tracker in the confirmation |

**Moments that matter:**
- **Stage 3 (evaluate the promise):** if the chores aren't shown, nothing else matters.
- **Stage 4 (trust check):** safety and privacy decide whether a parent even considers a camera robot in the house.
- **Stage 7 (wait):** this decides whether a reservation becomes a sale or a refund.

## 6. Insights

1. **We see** every task tab shows the same robot illustration, with only the caption changing [E], **which means** visitors can't check the page's main promise, **so we should** show real footage (or clearly labelled renders) for each task, with real speed. **[E] observation / [A] impact**
2. **We see** a device with 4 cameras and a far-field mic that needs an account, and **no privacy information anywhere on the page** [E]. **We assume** this is a top objection for families [A], **which means** some parents may leave at the trust stage, **so we should** add a privacy and safety block near the price (processing, storage, camera indicator or shutter, certification).
3. **We see** paid skills ($4.99, $1.99/month) and no statement of what's included [E], **which means** the real cost of ownership is unknown and may feel like a hidden subscription [A], **so we should** list the included chores and say clearly which skills cost extra.
4. **We see** no warranty, returns, delivery or financing information near the price [E], **which means** risk-averse buyers have no safety net beyond the deposit refund [A], **so we should** add a "Peace of mind" row: warranty, a home trial or returns, delivery regions and times, financing.
5. **We see** the tinkerer appeal reduced to one badge ("Built on open ROS 2") [E], **which means** Daniel finds nothing to act on and Maya may not care [A], **so we should** move the developer story to a "For developers" link (SDK, docs, local control) instead of mixing it into the household pitch.
6. **We see** the page ends at "Reserve", with nothing about the months of waiting [E], **which means** reservations may cool down and be cancelled [A], **so we should** say in the confirmation what updates people will get, and how often.
7. **We see** "Works offline: ✗" shown as a weakness, with no explanation next to it [E], **which means** it reads as a red flag rather than a trade-off [A], **so we should** explain what works offline (navigation) and what doesn't (skills), and why.

| Insight | Opportunity | Impact | Effort | Priority |
|---|---|---|---|---|
| 1. No proof of tasks | Real footage per task | High | High (needs filming) | **P1** |
| 2. No privacy story | Safe and private block | High | Low (copy + 1 section) | **P1** |
| 3. Unclear total cost | "What's included" list | High | Low | **P1** |
| 4. No safety net near the price | Warranty / returns / delivery / financing row | Medium–High | Low–Medium | **P2** |
| 6. Nothing about the wait | Update promise in the confirmation | Medium | Low | **P2** |
| 7. Offline shown as a flaw | Explain the trade-off | Medium | Low | **P2** |
| 5. Tinkerer story diluted | "For developers" page or link | Medium (for that segment) | Medium | **P3** |

## 7. Telemetry

- **North star metric:** **reservations still active 30 days after booking**, per 1,000 visitors. This captures both conversion and confidence, which a raw reservation count doesn't.
- **Guardrail metrics:**
  - the cancellation rate within 30 days must not rise;
  - the form error rate per submit;
  - mobile bounce rate on the hero;
  - page load (LCP) on mobile.

| Event (snake_case) | Trigger | Properties | Question it answers |
|---|---|---|---|
| `page_viewed` | Page load | `referrer_type` (social/search/direct/press), `device_type` | Where do visitors come from? Is mobile dominant? |
| `section_viewed` | A section is 50% visible | `section_id` | Where do people drop off? |
| `task_tab_selected` | A task tab is activated | `task_id`, `method` (click/keyboard/auto) | Which chores do people care about most? |
| `task_carousel_paused` | Pause pressed | `task_id` | Is auto-advance getting in the way? |
| `faq_opened` | An FAQ item is expanded | `question_id` | Which worries are most common (safety, internet, cancel)? |
| `spec_tooltip_opened` | A spec "i" is opened | `spec_id` | Which specs confuse people? |
| `included_link_clicked` | "What's included" clicked (fake door) | — | How strong is the hidden-cost concern? |
| `privacy_link_clicked` | Privacy block link clicked (once added) | — | How strong is the privacy concern? |
| `reserve_cta_clicked` | Any "Reserve" CTA | `cta_location` (header/hero/mid/form) | Which entry point drives reservations? |
| `reserve_form_error` | Validation fails | `field` (email/zip), `error_type` (format/empty/non_us) | Where does the form block people? How many non-US visitors? |
| `reserve_submitted` | A valid submit | `cta_location_first` | Funnel step |
| `reserve_completed` | A successful response | `days_since_first_visit` (bucketed) | Conversion, and decision time |
| `reservation_cancelled` | Cancellation (account/email flow) | `days_after_reserve` (bucketed), `reason_code` | Why are reservations lost? |

**Privacy:**
- Never send the email address, the ZIP code or free-text answers in events.
- `error_type: non_us` is derived on the device. The ZIP itself isn't sent.
- No session replay on the form.
- Bucket the time-based properties.
- Respect the cookie choice: with "reject", only strictly necessary, aggregate counts.

## 8. Validate

A build exists, so here is the current page checked against the personas, jobs and journey.

| Criterion (from steps 3–5) | Status | Evidence in the design | Fix |
|---|---|---|---|
| Shows proof that it does Maya's chores (Job 1, stage 3) | ❌ | One illustration for all 6 tasks, caption only | Real footage or labelled renders per task |
| Answers "is it safe with kids?" with evidence (stage 4) | ⚠️ | One FAQ sentence (torque-limited, 0.6 m/s), no certification | Name the safety standard, add a short safety video |
| Answers "is it watching us?" (stage 4) | ❌ | Nothing about cameras, mic, data or processing | Privacy block with plain-language commitments |
| Makes the total cost clear (stage 5) | ❌ | Paid skills are shown, the included chores aren't stated | "What's included" list next to the price |
| Offers a safety net beyond the refund (stage 5) | ❌ | No warranty, returns, delivery or financing | "Peace of mind" row in the order band |
| One consistent price, date and deposit (stage 2) | ✅ | $1,690 · Q1 2027 · $99 refundable everywhere (fixed earlier) | — |
| An easy, accessible reservation on mobile (stage 6) | ✅ | Labels, per-field errors, loading state, 375px layout (fixed earlier) | — |
| Supports the partner decision (stage 6) | ❌ | No share or save option | "Send to someone" link |
| Sets expectations for the wait (stage 7) | ⚠️ | The confirmation explains payment and refund, not updates | Add an update cadence to the confirmation |
| Gives Daniel a path (Job 2) | ⚠️ | A "ROS 2" badge, specs without docs | "For developers" link (SDK, docs, local control) |
| Serves Sam (Job 3) | ❌ | No mention of support, ease of use or remote check-in | Validate the segment first, then decide |

**Cheapest real test for the riskiest assumptions (privacy, proof, cost):**
- **Who:** 5 parents who own a robot vacuum and have bought a smart-home device in the past year. Recruit through a panel or your own network. 30-minute remote sessions.
- **Task:** "You've just seen an ad for this robot. Look at the page on your phone and decide whether you'd reserve. Think aloud. What would you need to know?"
- **Then ask:** 3 follow-ups: what convinced you, what worried you, and what's missing before you'd pay $99.
- **Success signal:** at least 3 of 5 spontaneously raise **privacy**, **proof of tasks** or **hidden costs** → those are confirmed, so build the P1 items. If fewer than 2 of 5 raise privacy, deprioritize it and look at what they did raise.
- **Alongside it:** run the `included_link_clicked` fake door for one week to size the cost concern with real visitors.

## Assumptions log

| # | Assumption | Risk if wrong | How to test it |
|---|---|---|---|
| 1 | The main buyers are time-poor parents who already own a robot vacuum | High | Confirmation-screen survey + panel screener incidence |
| 2 | Privacy (cameras, mic, account) is a top objection | High | 5 sessions + survey to the reservation list |
| 3 | Visitors need real footage to believe the task claims | High | 5 sessions: watch reactions to the task tabs. A/B test footage vs. illustration once footage exists |
| 4 | Unclear skills pricing reads as a hidden subscription | Medium | Fake-door "What's included" click rate |
| 5 | Most traffic is mobile, from social video | Medium | `page_viewed` → `referrer_type`, `device_type` |
| 6 | Tinkerers are a distinct, smaller segment worth a separate path | Medium | Clicks on a "For developers" link, and forum referrals |
| 7 | The long wait drives cancellations | Medium | `reservation_cancelled` by `days_after_reserve`, plus an exit reason |
| 8 | Partner approval is part of the decision | Low–Medium | Session question: "Who else decides?" |
| 9 | A caregiver segment exists | Low | Survey option "for a family member", watch the share |

## Open questions
- Which chores work **out of the box**, and which need paid skills?
- What does Tova do with camera and microphone data (on-device vs. cloud, retention, who can access it)?
- Which safety certification does or will the M1 have?
- What are the warranty, return window, delivery regions and support model?
- Is real footage available, even prototype footage, and are the captions' speeds ("0.8x") real?
- Is the developer audience a goal, or a side effect of the ROS 2 badge?
- What does the business count as success: reservations, or deposits converted at shipping?

---

**Next step:** run the 5-session test above to confirm the privacy, proof and cost assumptions. Meanwhile, `/ux-copy` can draft the privacy block, the "What's included" list and the peace-of-mind row, which are low-effort P1/P2 items. Real footage is the one P1 item that can't be solved with design alone.
