# UX Discovery Report: GooseWorks website (landing + booking flow, v2)

Skill: `/ux-superpowers` · Site version analysed: v2 (after `/design:design-critique` fixes and `/design-elevation` polish)

**Evidence tags:** **[E]** comes from something observable: the live gooseworks.ai copy, its public case study, or measurements on our build. **[A]** is an inference. No user research, analytics or interviews were available, so **all personas are proto-personas** and every claim about user behaviour is [A].

## Summary

The site is for owner-operators and growth leads at Shopify brands making under $10M a year. They come with one job: *"find out, fast and without risk, whether this will find real money in **my** store, and what it costs."* The biggest risk is **trust, not clarity**. The page explains Goose well, but there's a mismatch:
- it promises Goose "does the work", while the FAQ says it shows instructions and will auto-fix "in the future";
- it gives no reassurance about connecting ad and store accounts;
- it offers one case study and no real price.

**Top recommendation:** make the promise match the product today, then test a self-serve "free leak scan" as the low-commitment path, because the job is to see *my* leaks, not someone else's.

---

## 1. Discover

- **Subject:** the GooseWorks marketing site. That means the landing page (`index.html`) plus the path to a booked call (`/book`), with the case study as the main supporting page. Stage: **built** (v2 recreation).
- **Goal:**
  - *Business:* more **qualified** calls booked, meaning brands in the target revenue range that show up to the call [A].
  - *Users:* decide quickly and confidently whether Goose is worth 15 minutes of their time [A].
- **Users:** owner-operators of small Shopify brands, growth or marketing leads at $1–10M brands, and indirectly the founder or CEO who signs [A]. The revenue bands are taken from the real pricing tiers [E].
- **Constraints:**
  - Static site, no backend in this recreation [E].
  - Pricing is "Custom" on the real site [E]. Our prices are placeholders [E].
  - Only one public case study exists [E].
  - A self-serve scan would need product and engineering work [A].
- **Key questions:**
  1. Who actually arrives, from where, and on which device?
  2. What must a visitor believe before booking a call?
  3. What stops a qualified visitor from booking: price, trust, effort, or fit?
  4. Is "book a call" the right first step for a <$1M brand, or is something lighter needed?
  5. Which content can be cut on mobile without losing conversions?

## 2. Research intake

| Source | What it tells us | Type |
|---|---|---|
| gooseworks.ai landing copy | Positioning: a "proactive revenue agent" that "reads your ads, store and email, finds what to fix… **and does the work**". The audience is e-commerce brands. | [E] |
| gooseworks.ai FAQ | "Goose will identify issues and show you instructions on how to fix them. **In the future**, Goose will fix some issues automatically." This contradicts "does the work". | [E] |
| Pricing tiers | Segmentation by revenue: under $1M / $1–10M / Business with a dedicated growth manager. All tiers are "Custom". Claim: finds "multiples of what you pay". | [E] |
| Braxley case study | One owner-run brand (Austin) selling on Shopify and Amazon with Meta and Klaviyo. 16 leaks in 2 weeks, ~$15.4K/mo estimated. Fixes are delivered **in Slack**. Leaks span ads, site, checkout and email. | [E] (company-reported, n=1) |
| Integrations list (FAQ) | Shopify, Meta, Google Ads and Analytics, Klaviyo, TikTok, Pinterest, Amazon, Triple Whale. Custom connectors are available. | [E] |
| Booking page | It asks for site, revenue and ad spend, then a time slot. It claims "15% more revenue found in the first 2 weeks". | [E] |
| Our critique and measurements (docs 01–03) | Mobile length went from 14.5 to 11.5 screens. Contrast and tap targets are fixed. The booking form is now above the fold on mobile. | [E] (on our build) |
| Second product (creative agent) | GooseWorks also sells an AI-app-based creative agent with 181 skills. The banner sends visitors there from the landing page. | [E] |
| Traffic, devices, conversion, call show-up rate | Not available. | ❌ gap |
| Users' own words (interviews, reviews, sales calls) | Not available. | ❌ gap |

**Gaps and the cheapest way to fill them:**
- **Who comes and on which device:** run 1 analytics query (source × device × conversion), if the real team has analytics. That costs a day.
- **Why qualified visitors don't book:** a 1-question exit survey on `/book` ("What stopped you today?"), plus 5 short interviews with recent bookers and no-shows.
- **Is price the blocker:** listen to 10 sales-call recordings or read the CRM notes for the first objection raised.
- **Would people use a self-serve scan:** a fake-door test, i.e. a "Free leak scan" button that measures clicks and then offers a call.

## 3. Personas

> Proto-personas, built from the company's own segmentation and its one case study. Validate with 5 interviews before treating them as fact.

### P1 · Dana: owner-operator, Shopify brand around $300k–$1M/yr
- **Context:** runs the brand with 0–3 people. Does the ads, email and store herself, or with a freelancer. The Braxley profile is the closest real reference [E].
- **Goals:** grow revenue without raising ad spend, and catch problems before they cost a week of sales [A].
- **Frustrations:**
  - No time to check Ads Manager, Shopify and Klaviyo every day.
  - Learns about broken flows or sold-out products after the money is gone.
  - Agencies are expensive and opaque [A].
- **Behaviors:** checks the store app on her phone several times a day and does deeper work on a laptop at night. Discovers tools via founder communities, X/LinkedIn and podcasts. Price-sensitive [A].
- **Needs from Goose's site:**
  - Proof that it works for a brand **her size**.
  - A price she can check without a call.
  - Confidence that connecting her accounts is safe.
- **Confidence:** proto-persona (low–medium). Partly anchored in the Braxley case [E].

### P2 · Marcus: head of growth, DTC brand at $1–10M/yr
- **Context:** leads a small growth team plus one or two agencies, and reports to a founder or CEO [A].
- **Goals:**
  - Find incremental revenue to hit targets.
  - Spot what agencies miss.
  - Show the founder he has the whole funnel under control [A].
- **Frustrations:**
  - Dashboards (Triple Whale and the like) show numbers but not *what to do*.
  - Leaks hide between tools, e.g. an ad pointing to a sold-out size.
  - Building a business case for each new tool takes time [A].
- **Behaviors:** compares 2–3 tools, reads case studies in depth, books demos on a laptop during work hours, and has to get the founder's sign-off [A].
- **Needs from Goose's site:**
  - Concrete examples across his stack.
  - A return-on-investment story he can forward.
  - Clarity on what Goose does on its own versus what his team still has to do.
- **Confidence:** proto-persona (low–medium).

*Secondary, not mapped:* the founder or CEO who approves the spend. They are likely to see only a forwarded case study or report [A].

## 4. Jobs to be done

### J1 · Stop the bleeding (core product job)
> "When **sales dip or ad costs rise and I don't know why**, I want to **find the exact cause across my ads, store and email**, so I can **fix it before it costs me the month**."
- **Functional:** diagnose across tools and get a fix. **Emotional:** relief, control, fewer nasty surprises. **Social:** look on top of things to a co-founder or the CEO.
- **Current alternatives:** manual checks in each tool, agency reports, attribution dashboards, month-end reviews, gut feel [A].
- **Pains:** slow, after the fact, siloed per tool, and no one connects "ad → page → stock → email" [A]. The Braxley leaks are exactly this kind of cross-tool problem [E].

### J2 · Have someone watching (ongoing job)
> "When **I'm stretched across every channel**, I want **something to watch everything daily and only flag what matters**, so I can **spend my time growing, not monitoring**."
- **Functional:** monitoring with priorities. **Emotional:** peace of mind. **Social:** a team that looks bigger than it is.
- **Current alternatives:** alerts in each tool, a VA or freelancer, an agency retainer [A].
- **Pains:** alert fatigue, missed problems that fall between tools, cost [A].

### J3 · Decide without wasting time (the job the *website* serves)
> "When **I hear about a new AI growth tool**, I want to **judge in minutes whether it would find real money in *my* store and what it costs**, so I can **decide without sitting through a sales pitch**."
- **Functional:** evaluate fit, proof, price and risk. **Emotional:** avoid being sold to, and avoid the risk of handing over account access. **Social:** be able to justify the choice to a partner, CEO or team.
- **Current alternatives:** skim the site, look for reviews, ask peers, book a demo as a last resort [A].
- **Pains:** "Custom pricing" forces a call. Case studies are about other brands. It's unclear what access the tool needs [A], and [E] for the pricing.

## 5. User journey: P1 Dana, job J3 → J1 (first visit on mobile, from a social link) [A]

| Stage | User action | Thinking / feeling | Touchpoint | Pain point | Opportunity |
|---|---|---|---|---|---|
| 1. Arrive | Taps a link in a founder thread | "Another AI tool… what's this one?" Skeptical. | Hero | Banner pushes a *different* product (creative agent) first [E] | Hide the banner for paid/social traffic, or put it after the fold |
| 2. Understand | Reads the headline, scrolls to the dashboard | "Oh, it finds problems and puts a $ on them." Curious. | Hero + dashboard | "Does the work" sets up an expectation the product doesn't meet yet [E] | Describe what it does today: "finds and prices the leaks, and tells you exactly how to fix them" |
| 3. Believe | Reads the Braxley block, maybe opens the case study | "Real numbers… but is that my kind of store?" | Customer block, case study | One case study, and nothing about her size or category [E] | Add 2–3 short proof points by segment, or the median $ found per tier |
| 4. Check fit | Looks for her tools | "Does it work with my Shopify + Klaviyo setup?" | "Reads" section, FAQ | Full integrations list only in the FAQ, section 8 of 9 [E] | A row of integration logos right under the hero |
| 5. Check risk | Thinks about access | "It wants my Meta and Shopify logins?" Worried. | (nothing) | No statement on access scope or data handling on the landing page [E] | A 3-line "Your data" block: what Goose can access, what it never does, how to disconnect |
| 6. Evaluate cost | Scrolls to pricing | "$499 for under $1M… OK, or still a call?" | Pricing | Real site: "Custom" everywhere [E]. Ours: placeholder prices. Every tier still requires a call. | A real price anchor, plus a no-call path for Starter |
| 7. Decide | Chooses between "Book a call" and "See a real report" | "I'd rather see *my* leaks than Braxley's." | CTAs | The secondary CTA shows someone else's report [E] | A "Free leak scan" from her store URL (test it as a fake door first) |
| 8. Book | Fills the form, picks a slot | "Why do they need my revenue?" | `/book` | Revenue and ad-spend questions aren't explained [E]. The calendar is a separate step. | One line explaining why ("so we come prepared with your numbers"), and an option to skip the revenue question |
| 9. Wait for the call | Gets a confirmation | "What do I need to prepare? Will they push me?" | Confirmation (demo only) | Nothing shown about what happens next or what to prepare [E] | A confirmation page with the agenda, what to have ready, and a sample report link |

**Moments that matter:**
1. **Believe** (stage 3): she has to see herself in the proof.
2. **Check risk** (stage 5): connecting accounts is a hidden deal-breaker, and today nothing addresses it.
3. **Decide** (stage 7): the lower-commitment path has to serve *her* job.

## 6. Insights

1. **We see** the hero says Goose "does the work", while the FAQ says it gives instructions and will auto-fix "in the future" [E]. **Which means** the promise visitors buy on the page isn't the product they get on the call, so trust breaks at the worst moment [A]. **So we should** rewrite the hero promise to match today's product and keep "auto-fix" as a roadmap note.
2. **We see** a single case study, from an owner-run brand [E]. **We assume** $1–10M growth leads (P2) don't see themselves in it [A], **so we should** add segment-specific proof: a second case, or "median $ found in 2 weeks" per tier.
3. **We assume** the real job on arrival is "will it find money in *my* store" (J3) [A]. "See a real report" shows another brand's results [E], **so we should** test a self-serve "Free leak scan (store URL)" as the low-commitment path. Start with a fake door before building anything.
4. **We see** no reassurance about access or data on the landing page [E]. **We assume** account access is a silent objection for both personas [A], **so we should** add a short "Your data" block near the CTAs. Its content has to come from the real team; don't invent compliance claims.
5. **We see** pricing is "Custom" on every tier [E]. **We assume** small brands (P1) drop out when there's no price [A], **so we should** run an A/B test with a real starting price against "Custom" for Starter and Growth.
6. **We see** integrations listed in full only in the FAQ [E]. **We assume** "does it work with my stack" is a gating question [A], **so we should** show the integration logos right under the hero.
7. **We see** the mobile page is 11.5 screens, and pricing starts around screen 8 [E]. **We assume** most first visits come from social or referral links on a phone [A], **so we should** add a sticky mobile CTA bar and shorten the "how it works" section on mobile.
8. **We see** the booking form asks for revenue and ad spend with no explanation [E]. **We assume** this adds friction for small brands [A], **so we should** explain why and make revenue optional or a band.
9. **We see** the creative-agent banner is the first thing on the page [E]. **We assume** it pulls first-time visitors away before they understand Goose [A], **so we should** show it only to returning visitors or move it into the footer and nav.

| Insight | Opportunity | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 Promise mismatch | Honest hero copy | High | Low | **P1** |
| 4 No data reassurance | "Your data" block | High | Low (once the content exists) | **P1** |
| 6 Stack fit hidden | Integration logos under the hero | Med | Low | **P1** |
| 3 Wrong low-commitment path | Free leak scan (fake door → real) | High | Med → High | **P2** (fake door now) |
| 5 No price | Price-anchor A/B test | High | Low (needs a business decision) | **P2** |
| 2 Proof for one segment | Segment proof points | Med | Med (needs data) | **P2** |
| 7 Mobile length | Sticky CTA + shorter mobile sections | Med | Low | **P2** |
| 8 Form friction | Explain the questions, revenue optional | Med | Low | **P3** |
| 9 Banner distraction | Banner for returning visitors only | Low | Low | **P3** |

## 7. Telemetry

- **North star (site):** **qualified calls held per week**, meaning calls booked by brands in the target revenue bands where the call actually happened. That reflects visitors finding enough value to show up, not just clicking.
- **Guardrails:**
  - Call show-up rate.
  - Share of bookings outside the target revenue range.
  - Form abandonment on `/book`.
  - Mobile page speed (LCP).
  - Clicks to the creative agent (we don't want to destroy that funnel).
- **Events:**

| Event (snake_case) | Trigger | Properties | Question it answers |
|---|---|---|---|
| `page_viewed` | Any page load | `route_id`, `referrer_type` (social/search/direct/referral), `device` | Who arrives, from where, on which device? |
| `section_viewed` | A landing section is 50% visible | `section_id`, `order_index` | Where do people stop scrolling? Which sections can go? |
| `cta_clicked` | Any CTA | `cta` (primary/secondary/scan), `location` (hero/pricing/final/sticky/case_study) | Which CTA and placement drive bookings? |
| `signal_goal_selected` | Goal tab or accordion opened | `goal` | Which goal resonates (customers / convert / AOV / loss)? |
| `faq_opened` | FAQ item opened | `question_id` | Which objections are most common? |
| `plan_cta_clicked` | Pricing button | `plan` | Which tier draws interest? Does a price anchor change this? |
| `case_study_progress` | Finding *n* scrolled into view | `finding_index` | How far do people read the proof? |
| `leak_scan_clicked` | Fake-door "Free leak scan" | `location` | Is there demand for a self-serve path? |
| `book_form_started` | First field focused | — | Do people who reach `/book` start the form? |
| `book_step_completed` | Step 1 or 2 submitted | `step`, `revenue_band`, `spend_band` (categories only) | Where does the form lose people? Are bookers qualified? |
| `booking_confirmed` | Step 3 reached | `revenue_band`, `slot_lead_time_days` | Bookings by segment, and how far out people book |
| `banner_dismissed` | Banner closed | — | Is the banner a distraction? |

- **Privacy:**
  - Never send the email or store URL in events.
  - Revenue and spend go only as predefined bands.
  - No session recordings on `/book` form fields.
  - Respect cookie consent before any non-essential tracking (the real site already shows a consent banner [E]).

## 8. Validate: v2 build against the criteria above

| Criterion (steps 3–5) | Status | Evidence in the design | Fix |
|---|---|---|---|
| Understand what Goose does within 5 seconds | ✅ | Hero headline and the dashboard preview with $ findings | — |
| The promise matches today's product | ❌ | Hero: "and does the work". FAQ: instructions, auto-fix "in the future". | Rewrite the hero line (insight 1) |
| Proof for my size and segment | ⚠️ | One case study (Braxley), moved up to section 3 in v1 | Add segment proof points (insight 2) |
| "Works with my stack" visible early | ⚠️ | 4 tools + 3 chips in "Reads" (section 4). The full list is only in the FAQ. | Logo row under the hero (insight 6) |
| Data and access reassurance | ❌ | None on the landing page. Only legal links in the footer. | "Your data" block (insight 4) |
| Price visible without a call | ⚠️ | v1 added prices, but they're placeholders and every tier still requires a call | Real anchor + A/B test (insight 5) |
| Low-commitment path serves J3 ("my leaks") | ⚠️ | "See a real report" opens another brand's case study | Fake-door "Free leak scan" (insight 3) |
| CTA reachable at any point on mobile | ✅ | Sticky header keeps "Book a call" visible | Optional sticky bottom bar (insight 7) |
| Reasonable mobile length | ⚠️ | 11.5 screens (was 14.5) | Shorten "how it works" on mobile (insight 7) |
| Booking form easy to reach | ✅ | Form at 466px on mobile, above the fold | — |
| Booking questions feel justified | ❌ | Revenue and spend asked with no explanation | One-line reason, revenue optional (insight 8) |
| Clear next steps after booking | ⚠️ | "What happens next" section exists. The confirmation step is bare (demo). | Confirmation with agenda and what to prepare |

**Cheapest real test for the riskiest assumptions (insights 1, 3, 4, 5):**
- **Who:** 5 remote moderated sessions (~30 min each) with Shopify operators. Recruit 3 like P1 (<$1M) and 2 like P2 ($1–10M), on their **phone**.
- **Task:** "You got this link from a friend. Decide whether you'd book a call, and tell me what Goose would cost you and what it would do for you."
- **Success signals:**
  - ≥4 of 5 can state correctly what Goose does today (finds, prices and explains; doesn't auto-fix yet).
  - ≥4 of 5 can state the price or say where to find it.
  - Count how many raise account access as a concern without being asked. If ≥2, insight 4 is confirmed.
  - Count how many would pick "Free leak scan" over "Book a call".
- **In parallel:** ship the fake-door "Free leak scan" button for 2 weeks and compare `leak_scan_clicked` with `cta_clicked{cta:primary}`.

---

## Assumptions log

| # | Assumption | Risk if wrong | How to test it |
|---|---|---|---|
| A1 | The two core segments are owner-operators (<$1M) and growth leads ($1–10M) | Med | CRM: revenue band of the last 50 bookings |
| A2 | Most first visits are on mobile, from social or referral links | Med | Analytics: device × source |
| A3 | "Does the work" vs. the reality is hurting trust | High | Usability test: ask "what will Goose do for you?" and compare with the real product |
| A4 | Account access is a silent objection | High | Usability test (unprompted mentions) + sales-call notes |
| A5 | Having no price makes small brands drop off | High | A/B test: price anchor vs. "Custom" on Starter |
| A6 | Visitors would rather see their own leaks than a case study | High | Fake-door "Free leak scan" click rate |
| A7 | Integrations are a gating question | Med | `faq_opened` rate for the integrations question + interviews |
| A8 | Revenue and spend questions add friction to the booking form | Low | Step 1 drop-off with vs. without an explanation |
| A9 | The creative-agent banner distracts first-time visitors | Low | `banner_dismissed` + clicks away before scroll depth 25% |

## Open questions

- What does Goose actually do on its own today, beyond diagnosing and giving instructions? (This decides insight 1's copy.)
- What access does connecting Meta, Shopify and Klaviyo require (read-only?), and what can the company truthfully say about data handling?
- Will the business publish real prices, even "from $X"?
- Is a self-serve scan technically possible from public data alone (store URL, public ads) before any account is connected?
- What are the real numbers for call show-up rate and visit-to-booking conversion?
- Is there a second customer willing to be a case study, ideally in the $1–10M band?

---

**Next step:** run the 5-person mobile test plus the fake-door "Free leak scan" to validate A3–A6. Meanwhile, the three P1 insights (honest hero copy, a "Your data" block, integration logos) can be designed now with `/frontend-design`.
