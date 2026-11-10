# Practo for Animals — Design System

**Version:** 1.0
**Direction:** Warm editorial animal healthcare
**References:** independent literary magazines, modern veterinary clinics, premium field guides — not generic SaaS dashboards.

---

## 1. Design intent

The system should feel **calm, human, and credible** at the exact moment someone is worried about an animal. It should look designed by a small, opinionated studio: generous ivory space, expressive serif headlines, natural photography, precise rules, and a single warm coral accent used with restraint.

Three adjectives: **grounded, editorial, caring**.
Three anti-goals: **clinical coldness, startup gradient clichés, cutesy pet-shop kitsch**.

### Guiding principles

1. **Calm before clever.** Reduce cognitive load; one clear next action per section.
2. **Human proof, not manufactured proof.** Show the work, the process, and the limitations. Never invent trust signals.
3. **Editorial rhythm.** Alternate dense functional areas with quiet breathing room. Use scale and whitespace, not decoration, for hierarchy.
4. **Photography with dignity.** Animals are subjects, not props. Crops should feel intimate and unhurried.
5. **Every state designed.** Hover, focus, loading, empty, error, success, and simulated modes all have intentional treatment.

---

## 2. Colour system

All core text/background pairings target WCAG 2.2 AA. Coral is not used for small body text on ivory unless the darker `coral-ink` token is used.

### Core palette

| Token | Hex | Use |
| --- | --- | --- |
| `forest-950` | `#0E2A22` | Deepest panels, footer, dark hero |
| `forest-900` | `#163B31` | Primary text, primary buttons |
| `forest-800` | `#1D4A3C` | Hover, dark cards |
| `forest-700` | `#2A604E` | Secondary text on mint, links |
| `forest-600` | `#3A7662` | Muted forest detail |
| `ivory-50` | `#FCF8EF` | Page background |
| `ivory-100` | `#F6F0E3` | Alternate section background |
| `ivory-200` | `#EDE3D2` | Cards, dividers on dark? |
| `ivory-300` | `#DFD2BC` | Borders, disabled |
| `mint-100` | `#E7F0E7` | Soft highlight |
| `mint-200` | `#D6E7D8` | Badges, category tint |
| `mint-300` | `#B9D5BF` | Decorative, accents |
| `coral-400` | `#E58B73` | Decorative shape, icon on dark |
| `coral-500` | `#D96C54` | Accent fills, focus glow, stamps |
| `coral-600` | `#B9523C` | Hover fill |
| `coral-ink` | `#943A27` | Accessible coral text/link on light |
| `charcoal` | `#202521` | Base body text (near-black warm) |
| `ink-muted` | `#5B655D` | Secondary text |
| `line` | `#DDD4C4` | Hairline borders |
| `white-warm` | `#FFFDF8` | Elevated cards on ivory |
| `amber-ink` | `#7D4E13` | Pending / sample notices |
| `amber-bg` | `#F7E9CE` | Pending badge background |
| `danger-ink` | `#8F2D26` | Errors / destructive |
| `danger-bg` | `#FAE5E2` | Error surface |

### Usage ratio

- 55% warm ivory / white-warm surfaces.
- 25% forest (text, buttons, dark sections, footer).
- 12% photography and its natural tones.
- 6% mint highlights.
- 2% coral accents and stamps.

Never place coral 500 text on ivory as the only contrast carrier. Use `coral-ink` or pair coral with forest text.

### Section recipes

- **Light editorial:** `ivory-50` background, forest text, hairline rule.
- **Deep forest:** `forest-950` background, ivory text, mint secondary, coral stamp.
- **Mint quiet:** `mint-100` background, forest text; used for guidance and verification callouts.
- **Coral moment:** `coral-500` fill with forest-950 text; used sparingly for one stamp or provider CTA band.

---

## 3. Typography

### Families

| Role | Family | Fallback |
| --- | --- | --- |
| Display / editorial headings | **Fraunces** (variable serif) | Georgia, serif |
| UI / body | **Manrope** (variable sans) | system-ui, sans-serif |
| Reference / labels | Manrope uppercase letterspaced | — |

Both are loaded with `next/font/google`, self-hosted at build time.

### Scale (fluid)

| Style | Desktop | Mobile | Weight / tracking |
| --- | --- | --- | --- |
| Display XL | 76–96 px / 0.95 | 48–56 px | Fraunces 400, -0.035em |
| Display L | 60–72 px / 1.0 | 42–48 px | Fraunces 400, -0.03em |
| Heading 1 | 48–56 px / 1.06 | 36–42 px | Fraunces 400, -0.025em |
| Heading 2 | 38–44 px / 1.08 | 32–36 px | Fraunces 400, -0.02em |
| Heading 3 | 26–30 px / 1.15 | 24 px | Fraunces 500 |
| Heading 4 / card title | 20–22 px / 1.3 | 19 px | Manrope 650 |
| Body L | 19 px / 1.65 | 18 px / 1.6 | Manrope 400 |
| Body | 16 px / 1.65 | 16 px / 1.65 | Manrope 400 |
| Body S | 14 px / 1.55 | 14 px | Manrope 450 |
| Label | 11 px / 1.2, uppercase, 0.18em | same | Manrope 700 |
| Data / reference | 13 px / 1.4 | same | Manrope 600, tabular numbers |

**Rules**
- Display headlines may use an italic emphasis word for editorial texture.
- Avoid all-caps headlines. Uppercase is reserved for labels and short stamps.
- Body copy max width: 68ch; editorial intros 52ch; card body 42ch.
- Do not center-align long body copy.
- Headings use `text-balance`; short descriptions use `text-pretty`.

---

## 4. Spacing and layout

### Spacing scale (4 px base)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160`

### Container
- Max content width: **1280 px**.
- Horizontal gutters: **20 px** mobile, **32 px** tablet, **48 px** desktop.
- Wide media sections can bleed to the viewport edge with internal max-width.
- Marketing sections: 80–128 px vertical padding desktop; 56–80 px mobile.
- Functional workspace sections: 32–48 px.

### Grid
- 12-column desktop grid, 24 px gutters.
- Hero split: 6/6 or 7/5; asymmetric rather than perfectly centered.
- Card grids: 3-up desktop, 2-up tablet, 1-up mobile.
- Dashboard: 248 px sidebar + fluid content; collapsible to top bar under 1024 px.
- Studio: 240 px stepper + fluid editor + 340 px preview at ≥1280 px.

### Radii

| Token | Value | Use |
| --- | --- | --- |
| `sm` | 8 px | Inputs, small controls |
| `md` | 12 px | Buttons, badges |
| `lg` | 18 px | Cards |
| `xl` | 28 px | Feature panels |
| `arch` | `999px 999px 28px 28px` | Hero/editorial images |
| `pill` | 999 px | Chips, stamps |

Avoid applying large radii to every element. Tables and editorial rules stay square/soft.

### Borders and shadows
- Hairline border: 1 px `line`; on dark: `rgba(252,248,239,0.14)`.
- Shadow: `0 18px 50px -30px rgba(14,42,34,0.33)` for floating cards only.
- No neon glows, heavy gradients, or multiple competing shadows.
- Paper texture: very subtle SVG noise at 1.5–2.5% opacity on select light sections.

---

## 5. Photography and illustration

### Art direction
- Natural light, shallow depth of field, warm neutrals, forest greens.
- Intimate animal portraits; human–animal interaction where available.
- Avoid sterile stock handshakes, fake clinic teams, fake testimonials.
- Photos are illustrative of animals and care, never captioned as a named provider or real team.
- Prefer arched portrait crops for heroes; editorial 4:3 crops for cards.

### Treatment
- Slight warm overlay on dark image text overlays for contrast.
- Hover: scale image 1.02 over 500 ms, never bounce.
- Provide descriptive alt text related to the actual image.
- Credit stock photography in the footer / README.

### Decorative language
- Hand-drawn-looking paw mark (SVG), thin botanical rule, circular rubber-stamp badge.
- Dotted grid and radial washes used at low contrast.
- No cartoon mascots, no emoji as primary iconography.
- Icons: Lucide, 1.5 px stroke, 18–24 px. Never mix icon families.

---

## 6. Components

### 6.1 Buttons
- Height: 44 px default, 52 px large, 36 px small.
- Primary: forest-900 fill, ivory-50 text; hover forest-800 + arrow shifts 2 px.
- Secondary: transparent/white-warm, 1 px forest border, forest text.
- Coral: coral-500 fill, forest-950 text; reserved for studio/provider conversion moments.
- Ghost: transparent, forest text, hover mint-100.
- Inverse: ivory fill on forest.
- Radius: 999 px for marketing CTAs; 10 px inside dense dashboard forms for a more operational feel.
- Focus: 2 px coral-500 outline with 2 px offset.
- Loading: inline spinner + label; disable and mark `aria-busy`.
- Never place two equally strong primary buttons side by side.

### 6.2 Inputs
- 48 px height, white-warm background, 1 px line, 10 px radius.
- Label above, 13 px Manrope 650; optional helper below.
- Focus: 2 px forest ring + subtle coral offset.
- Error: danger border + message with icon; `aria-invalid` and `aria-describedby`.
- Selects use native controls styled consistently for reliability.
- Textareas min 120 px, resize-y.
- Checkboxes 18 px with 44 px hit area label.

### 6.3 Cards
- Provider card: radius 18 px, white-warm, 1 px line, image 4:3, content 20–24 px padding.
- Top-left badge for sample/category; bottom CTA row with arrow.
- Hover: border forest-300 + lift 2 px + image scale; no giant shadow.
- Editorial cards can use mint/forest backgrounds without images.

### 6.4 Badges / status
- **Sample listing:** amber background + amber ink, uppercase 10 px.
- **Demo programme:** amber outline on light / amber fill on dark.
- **Published:** mint fill + forest text.
- **In review:** amber fill + amber ink.
- **Paused / closed:** neutral ivory-200 + muted ink.
- **Error / rejected:** danger background + danger ink.
- Status always includes text, never colour alone.

### 6.5 Navigation
- Header: 76 px desktop, 64 px mobile; ivory/95 backdrop blur; 1 px bottom line on scroll.
- Wordmark + 4 primary links + utility + CTA.
- Active link: 2 px coral underline offset 6 px.
- Mobile: full-height sheet, large serif links, clear close, sign-in and CTA at bottom.
- Dashboard sidebar: forest-950, ivory text, mint active pill; role/user block at bottom.
- Studio header: compact, utility-focused; logo links back to the site.

### 6.6 Forms
- One column; related fields may pair on desktop.
- Section labels uppercase; explanatory intro above.
- Inline validation on submit; server errors in a summary at top with focus.
- Success replaces form with a confirmation panel (reference + next steps), not a toast alone.
- Honeypot field hidden from users and assistive tech.

### 6.7 Dashboard tables
- Light cream surface, header uppercase label, 1 px row rules.
- Row actions visible on hover/focus but always accessible via keyboard.
- Filters/search above table; count on the left, sort/filter on the right.
- On mobile, tables become stacked records rather than horizontal scroll where practical.
- No fabricated charts. Small CSS bars only for real current counts.

### 6.8 Studio slides
- 4:5 canvas; 1080×1350 export mental model.
- Inner safe margin 8–10%.
- Cover slide uses large Fraunces headline; content slides use Manrope body with strong label hierarchy; CTA slide uses forest/coral block.
- Design directions:
  - **Field Notes:** ivory, forest type, fine rules, coral stamp.
  - **Clinic Calm:** mint, forest type, rounded editorial blocks.
  - **Night Vet:** forest-950, ivory type, coral accent.
- Slide preview must remain legible at card size and in print.

---

## 7. Interaction and motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`; fast 160 ms, standard 280 ms, slow 500 ms.
- Hover lifts ≤ 2 px; image scales ≤ 1.03.
- Page/section entrances: subtle opacity/translate 12 px, once, not on every scroll.
- Accordion: 200–250 ms height/opacity.
- Respect `prefers-reduced-motion`: remove transforms and non-essential transitions.
- Loading states for AI steps: skeleton/thinking panel with named stages and cancel/back options.
- Do not block navigation without saving; autosave studio draft locally.

---

## 8. Accessibility standard

Target **WCAG 2.2 AA**.

- Semantic landmarks: header, nav, main, aside, footer.
- One `<h1>` per page; no skipped heading levels.
- Visible `:focus-visible` ring on every interactive element.
- Skip-to-content link.
- Keyboard-operable dialogs and menus (Radix primitives where appropriate).
- Minimum target 44×44 px for primary mobile interactions.
- Contrast:
  - forest-900 on ivory-50 ≈ 10:1.
  - ivory-50 on forest-950 ≈ 13:1.
  - coral-ink on ivory-50 ≥ 5.5:1.
  - muted ink on ivory-50 ≥ 6:1.
- Never rely on colour alone for status.
- Form errors announced and associated.
- Images have meaningful alt text; decorative imagery alt="".
- `lang="en-IN"`.
- Reduced motion and forced-colors friendly outlines.
- Studio checklist includes accessibility review before approval.

---

## 9. Content style

### Voice
Warm, precise, grounded. A knowledgeable friend who happens to be a great editor. Never clinical-cold, never overly cute.

### Rules
- Short sentences. Concrete nouns. Active verbs.
- Say what happens next.
- No fear-based selling. Emergency content should be calm and direct.
- Avoid "revolutionary", "seamless", "unlock", "supercharge", "game-changing".
- No invented proof, statistics, testimonials, awards, or partnerships.
- Use "sample listing" and "demo programme" plainly.
- AI content is always labelled as a draft requiring review.
- Medical guidance is general and non-diagnostic; always point to a veterinarian.
- CTA verbs: Find care, View profile, List your practice, Explore the academy, Try the studio, Save for review, Export handoff pack.

### Capitalisation
- Sentence case everywhere, including buttons and headings.
- Product names: Practo for Animals, AI Academy, Content Studio.
- Programme names are title case.

### Numbers and units
- Indian context: ₹, `+91`, Bengaluru/Mumbai/Delhi NCR. Use en dashes for ranges.
- No fake data counts unless clearly labelled as sample.

---

## 10. Responsive breakpoints

| Name | Width | Behaviour |
| --- | --- | --- |
| `sm` | ≥ 640 px | 2-up cards, paired form fields |
| `md` | ≥ 768 px | Tablet nav summary, hero image larger |
| `lg` | ≥ 1024 px | Full desktop nav, sidebar layouts |
| `xl` | ≥ 1280 px | Studio three-pane, wider editorial gutters |
| `2xl` | ≥ 1536 px | Max container stays 1280–1360 px |

Mobile-first CSS. At 360 px: no horizontal overflow, no clipped CTAs, filters in a dialog, stepper becomes horizontal summary, tables become cards.

---

## 11. Quality checklist per screen

- [ ] One clear primary action.
- [ ] Headline hierarchy holds at 360 px and 1440 px.
- [ ] All sample/demo/simulated data labelled.
- [ ] No invented ratings, verification, testimonials, or partnerships.
- [ ] Focus states and keyboard order verified.
- [ ] Form labels, errors, and success states present.
- [ ] Loading, empty, and error states designed.
- [ ] Images have appropriate alt text and attribution.
- [ ] Text contrast ≥ AA; tap targets ≥ 44 px.
- [ ] Motion respects reduced-motion preference.
- [ ] No horizontal scroll at 360 px.
- [ ] Links and CTAs go to a real destination.
