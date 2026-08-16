# CheckoutFitt — Web Design System Specification
Adapted for Next.js + Tailwind CSS + Framer Motion. Single source of truth for the web app.

---

## 1. Color Palette

### Primary (Burnt Orange / Terracotta)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-50` | `#FFF5F0` | Selected chip bg, row hover bg, faint highlights, tooltip bg |
| `--color-primary-100` | `#FBEEE6` | Callout card bg, Pro banner bg, suggestion blocks, hover tint on secondary buttons |
| `--color-primary-200` | `#F6DBC7` | Progress bar track, light accent fills, sidebar active item bg |
| `--color-primary-300` | `#E8A878` | Score circle track (unfilled portion), decorative accents |
| `--color-primary-400` | `#D4783C` | Hover state for primary buttons, active link underline |
| `--color-primary-500` | `#C1622D` | **Primary brand** — CTA buttons, active nav icon, selected chip border, score numbers, links, wordmark, accent text, focus rings |
| `--color-primary-600` | `#A64F21` | Active/pressed state for primary buttons |
| `--color-primary-700` | `#8A4119` | Deep accent — visited links, ultra-dark brand moments |

### Neutrals (Warm Sand/Cream)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#FAF8F5` | **Page background** — warm off-white on every page, never pure white or cold gray |
| `--color-surface` | `#FFFFFF` | Cards, inputs, modals, dropdowns, sidebar bg, popovers |
| `--color-surface-secondary` | `#F5F1EA` | Secondary surface — weather strip, calendar cells, grouped sections, table header bg, code blocks |
| `--color-surface-tertiary` | `#EDE7DD` | Skeleton loading blocks, disabled surfaces, divider-heavy areas |
| `--color-border` | `#E7E2D9` | Card borders, input borders, dividers, table borders, sidebar border |
| `--color-border-strong` | `#D5CFC5` | Focused input border (before primary takes over), active table row border |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#1A1917` | Headlines, body text, primary labels — warm charcoal, never pure #000 |
| `--color-text-secondary` | `#3A3835` | Descriptions, metadata, secondary labels, table cell text |
| `--color-text-muted` | `#8A8580` | Placeholders, timestamps, inactive nav labels, helper text, disabled text |
| `--color-text-on-primary` | `#FFFFFF` | Text on primary-colored buttons, badges, and surfaces |
| `--color-text-accent` | `#C1622D` | Links (with underline on hover), verdicts, archetype names, brand wordmark |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#4A9E6B` | Check icons, "Best Colors", feature checks, positive verdicts, online indicators |
| `--color-success-light` | `#EDF7F0` | Success toast bg, positive badge bg |
| `--color-danger` | `#C1432D` | Delete buttons, error borders, "Colors to Avoid", destructive actions |
| `--color-danger-light` | `#FDEDEA` | Error toast bg, danger badge bg |
| `--color-warning` | `#D4A03C` | Warning states, "Maybe" verdict |
| `--color-warning-light` | `#FFF8E6` | Warning toast bg |
| `--color-info` | `#5B8FC7` | Info badges, tooltip accents |
| `--color-info-light` | `#EBF3FA` | Info toast bg |

### Overlay
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-overlay` | `rgba(26, 25, 23, 0.5)` | Modal backdrops, lightbox overlays |
| `--color-overlay-light` | `rgba(26, 25, 23, 0.04)` | Subtle hover tint on rows, table row hover |

---

## 2. Typography Scale

Font stack: `'Inter', system-ui, -apple-system, sans-serif`. Install Inter from Google Fonts.
Web gets Inter rather than system font because cross-browser consistency matters more than
native feel on desktop — and Inter was designed for screens at small sizes.

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display` | 36px | 700 | 1.15 | -0.75px | Hero headlines — "Your Closet, Reimagined", "$4,280" |
| `--text-h1` | 30px | 700 | 1.2 | -0.5px | Page titles — "You're an Old Money Minimalist" |
| `--text-h2` | 24px | 700 | 1.25 | -0.3px | Section headers — "Missing Essentials", "Good morning" |
| `--text-h3` | 20px | 600 | 1.3 | -0.2px | Card titles, subsection headers |
| `--text-body-lg` | 17px | 400 | 1.6 | 0 | Lead paragraphs, hero subtitles (web-only, larger reading size) |
| `--text-body` | 15px | 400 | 1.6 | 0 | Default body copy, descriptions, explanations |
| `--text-body-medium` | 15px | 500 | 1.6 | 0 | Emphasized body — nav labels, list item names, table cells |
| `--text-body-semibold` | 15px | 600 | 1.6 | 0 | Button labels, column headers, active states |
| `--text-sm` | 14px | 400 | 1.5 | 0 | Compact body — sidebar labels, helper text, metadata |
| `--text-caption` | 13px | 500 | 1.4 | 0 | Secondary metadata — tags, timestamps, breadcrumbs |
| `--text-eyebrow` | 11px | 600 | 1.3 | 1.2px | Section eyebrows — always UPPERCASE, always tracking-wide |
| `--text-tag` | 12px | 500 | 1.3 | 0.2px | Chip labels, badge text, tag text |
| `--text-score` | 28px | 700 | 1.1 | -0.3px | Score numbers — "8.5", "87%" (slightly larger than mobile) |
| `--text-stat` | 32px | 700 | 1.1 | -0.3px | Stat displays — "8 Total Items", "$4,280" |

---

## 3. Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Icon-to-text inline gaps, tag vertical padding |
| `--space-sm` | 8px | Between chips, metadata items, tight list gaps |
| `--space-md` | 12px | Card internal padding minimum, compact list items |
| `--space-lg` | 16px | Grid gaps, intra-card section spacing |
| `--space-xl` | 20px | Card padding standard, sidebar item padding |
| `--space-2xl` | 24px | Between content sections, grid gap on desktop |
| `--space-3xl` | 32px | Major section breaks, page section vertical rhythm |
| `--space-4xl` | 40px | Hero to content gap, page top padding |
| `--space-5xl` | 48px | Section separators on spacious layouts (web-only) |
| `--space-6xl` | 64px | Hero sections vertical padding (web-only) |

---

## 4. Layout & Responsive Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `--breakpoint-sm` | 640px | Mobile web — single column, stacked layouts |
| `--breakpoint-md` | 768px | Tablet — 2-column grids, sidebar collapses |
| `--breakpoint-lg` | 1024px | Desktop — sidebar visible, 3-4 column grids |
| `--breakpoint-xl` | 1280px | Wide desktop — max content width reached |
| `--content-max-width` | 1200px | Max width for main content area |
| `--sidebar-width` | 260px | Sidebar expanded width |
| `--sidebar-collapsed-width` | 72px | Sidebar icons-only width (tablet) |
| `--page-padding-x` | 32px | Horizontal padding inside main content area |
| `--page-padding-x-mobile` | 16px | Horizontal padding on mobile web |

### Layout structure
```
┌──────────────────────────────────────────────────┐
│ Sidebar (260px)  │  Main Content (flex, max 1200px)    │
│                  │  ┌──────────────────────────┐ │
│  Logo            │  │ Top Bar (sticky)         │ │
│  ──────          │  │ Page title + search +    │ │
│  Nav Group 1     │  │ notifications + avatar   │ │
│  Nav Group 2     │  ├──────────────────────────┤ │
│  ──────          │  │                          │ │
│  User / Logout   │  │ Page Content             │ │
│                  │  │ (scrollable)             │ │
│                  │  │                          │ │
│                  │  └──────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- Below `lg` (1024px): sidebar collapses to icons-only (72px)
- Below `md` (768px): sidebar becomes a slide-over drawer triggered by hamburger in top bar
- Content area is always centered with max-width, never stretches full-screen on ultrawide

---

## 5. Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Tags, chips, small badges, tooltips |
| `--radius-md` | 12px | Inputs, thumbnails, inner cards, table cells, dropdown items |
| `--radius-lg` | 16px | Buttons, standard cards, popovers, sidebar active item |
| `--radius-xl` | 20px | Hero cards, modals, feature cards, dialog containers |
| `--radius-2xl` | 24px | Page-level panels, slide-over sheets |
| `--radius-full` | 9999px | Avatars, score circles, pill toggles, search input |

---

## 6. Shadow / Elevation Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-none` | none | Flat elements — chips, tags, inline items |
| `--shadow-xs` | `0 1px 2px rgba(26, 25, 23, 0.04)` | Subtle — table rows, list items (web-only, finer grain) |
| `--shadow-sm` | `0 1px 3px rgba(26, 25, 23, 0.06), 0 1px 2px rgba(26, 25, 23, 0.04)` | Input focus, sidebar, top bar |
| `--shadow-md` | `0 2px 8px rgba(26, 25, 23, 0.08), 0 1px 3px rgba(26, 25, 23, 0.04)` | Standard card elevation, dropdowns |
| `--shadow-lg` | `0 4px 16px rgba(26, 25, 23, 0.10), 0 2px 4px rgba(26, 25, 23, 0.04)` | Hero cards, hover-lifted cards, popovers |
| `--shadow-xl` | `0 8px 24px rgba(26, 25, 23, 0.12), 0 4px 8px rgba(26, 25, 23, 0.04)` | Modals, command palette, slide-overs |
| `--shadow-primary` | `0 4px 14px rgba(193, 98, 45, 0.25)` | Primary CTA buttons — warm terracotta glow, not gray |

Shadows use double-layer (ambient + direct) for photorealistic depth on web. Mobile used
single-layer because RN only supports one shadow — web doesn't have that limitation.

---

## 7. Interaction & Animation Tokens

### Transitions (CSS)
| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Button hover/active, chip toggle, icon color change |
| `--transition-normal` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Card hover lift, shadow transitions, nav active state |
| `--transition-slow` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions, sidebar expand/collapse, modal open |
| `--transition-spring` | `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces — score count-up, badge appear, toast slide-in |

### Framer Motion presets (define in src/lib/motion.ts)
```ts
export const motion = {
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
  fadeInUp: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" } },
  fadeInScale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.25 } },
  staggerChildren: { transition: { staggerChildren: 0.06 } },
  cardHover: { whileHover: { y: -3, boxShadow: "var(--shadow-lg)" }, transition: { duration: 0.2 } },
  buttonPress: { whileTap: { scale: 0.97 }, transition: { duration: 0.1 } },
  scoreCountUp: { transition: { duration: 1.2, ease: "easeOut" } },
  slideInRight: { initial: { x: 20, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.3 } },
  pageTransition: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 } },
};
```

### Hover states (web-only — mobile has none of these)
| Element | Hover behavior |
|---------|---------------|
| Primary button | bg shifts to `--color-primary-400`, shadow lifts to `--shadow-primary` |
| Secondary button | bg fills `--color-primary-50` |
| Ghost button | text underline appears |
| Card (interactive) | translateY -3px, shadow from `--shadow-md` → `--shadow-lg`, border-color from `--color-border` → `--color-border-strong` |
| Card (non-interactive) | no change |
| List row / table row | bg `--color-overlay-light` |
| Sidebar nav item | bg `--color-primary-50`, text `--color-primary-500` |
| Link text | underline appears, color stays `--color-text-accent` |
| Chip (selectable) | border-color `--color-border-strong`, bg `--color-surface-secondary` |
| Image thumbnail | subtle scale 1.03 with overflow hidden on container (zoom without overflow) |
| Icon button | bg `--color-surface-secondary` circle appears behind icon |

### Focus states (accessibility — required on every interactive element)
| Element | Focus-visible behavior |
|---------|----------------------|
| All buttons | 2px ring in `--color-primary-500`, 2px offset, rounded to match element |
| All inputs | border `--color-primary-500`, shadow `--shadow-sm` |
| All links | 2px ring in `--color-primary-500`, 2px offset |
| Cards (if clickable) | 2px ring in `--color-primary-500`, 2px offset |
| Chips | ring same as buttons |
| Sidebar items | same as buttons |

`focus-visible` only (not `focus`) — keyboard users get rings, mouse clicks don't.

### Cursor
| Element | Cursor |
|---------|--------|
| All buttons, links, clickable cards | `cursor-pointer` |
| Disabled elements | `cursor-not-allowed` |
| Drag handles | `cursor-grab` / `cursor-grabbing` |
| Text inputs | `cursor-text` |
| Default | `cursor-default` |

---

## 8. Component Specifications (Web-Adapted)

### 8.1 Button

**Primary (filled):**
- Background: `--color-primary-500`
- Text: `--color-text-on-primary`, `--text-body-semibold`
- Height: 44px (web slightly shorter than mobile's 52px for density)
- Large variant: 52px height (for hero CTAs, auth pages, paywall)
- Border radius: `--radius-lg` (16px)
- Padding: 0 24px
- Shadow: `--shadow-primary` (terracotta glow)
- Hover: bg `--color-primary-400`, shadow intensifies, translateY -1px
- Active: bg `--color-primary-600`, translateY 0, shadow `--shadow-sm`
- Focus-visible: 2px ring `--color-primary-500`, 2px offset
- Disabled: opacity 0.4, cursor not-allowed, no shadow
- Transition: `--transition-fast`
- Full-width only when explicitly set, not by default (web buttons are auto-width)

**Secondary (outlined):**
- Border: 1.5px solid `--color-primary-500`
- Hover: bg `--color-primary-50`
- Active: bg `--color-primary-100`
- Same height/radius as primary

**Ghost:**
- No bg, no border
- Hover: text underline
- Active: opacity 0.7

**Destructive:**
- Border: 1.5px solid `--color-danger`
- Text/icon: `--color-danger`
- Hover: bg `--color-danger-light`

**Icon button (circular):**
- Size: 36px × 36px (sm), 40px × 40px (md)
- Hover: bg `--color-surface-secondary`
- Border radius: `--radius-full`

### 8.2 Card

**Standard:**
- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Border radius: `--radius-xl` (20px)
- Padding: 20px (slightly more than mobile for web density)
- Shadow: `--shadow-md`
- Hover (if clickable): translateY -3px, shadow `--shadow-lg`, border `--color-border-strong`, `--transition-normal`
- Cursor: pointer if clickable

**Hero card:**
- Shadow: `--shadow-lg`
- Images inside: radius `--radius-lg`, object-fit cover
- Larger padding: 24px

**Flat card (embedded within another card or section):**
- Background: `--color-surface-secondary`
- No border, no shadow
- Border radius: `--radius-md` (12px)

### 8.3 Chip / Tag

**Selectable chip:**
- Unselected: bg transparent, border 1px `--color-border`, text `--color-text-primary`, radius `--radius-full`
- Hover: border `--color-border-strong`, bg `--color-surface-secondary`
- Selected: bg `--color-primary-50`, border 1.5px `--color-primary-500`, text `--color-primary-500`
- Height: 36px, padding: 0 16px
- Cursor: pointer
- Transition: `--transition-fast`

**Static tag:**
- bg `--color-surface-secondary`, no border, radius `--radius-sm`, height 28px, padding 0 10px
- Text: `--text-tag`, `--color-text-secondary`
- Not interactive — no hover/cursor change

### 8.4 Input

- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Border radius: `--radius-md` (12px)
- Height: 44px (web), 52px for large variant (auth pages)
- Padding: 0 16px
- Hover: border `--color-border-strong`
- Focus: border `--color-primary-500`, shadow `--shadow-sm`, outline none
- Error: border `--color-danger`, error text `--color-danger` below
- Placeholder: `--color-text-muted`
- Label: `--text-sm`, `--color-text-secondary`, margin-bottom 6px, font-weight 500
- Transition: border-color `--transition-fast`

### 8.5 Sidebar Navigation

- Width: 260px, bg `--color-surface`, border-right 1px `--color-border`
- Position: fixed left, full height
- Logo area: top, 64px height, centered "CheckoutFitt" wordmark in `--color-primary-500`, `--text-body-semibold`
- Nav items: height 42px, padding 0 16px, radius `--radius-md`, margin 2px 12px
- Nav item text: `--text-sm`, `--color-text-secondary`, with 20px icon left in `--color-text-muted`
- Active item: bg `--color-primary-50`, text `--color-primary-500`, icon `--color-primary-500`, font-weight 600
- Hover item: bg `--color-surface-secondary`
- Groups: separated by 1px `--color-border` with `--space-md` vertical padding
- Group labels: `--text-eyebrow`, `--color-text-muted`, uppercase, padding 0 16px, margin-bottom 4px
- Bottom section: user avatar (32px) + name + settings gear icon, separated by border-top
- Collapse behavior:
  - Below `lg`: icons only (72px width), labels hidden, tooltips on hover
  - Below `md`: off-screen, triggered by hamburger button in top bar, slides in with overlay

**Sidebar nav groups:**
```
MAIN
  Home (House icon)
  My Closet (Shirt icon)
  Generate (Sparkles icon)

STYLE
  AI Chat (MessageCircle icon)
  Style Coach (Palette icon)
  Color Analysis (Palette icon variant / Droplet)
  Outfit Calendar (Calendar icon)

TOOLS
  Shopping Assistant (ShoppingBag icon)
  Outfit Rating (Star icon)
  Wardrobe Gaps (BarChart icon)
  Capsule Builder (Layers icon)
  Travel Packing (Luggage icon)
  Inspiration Match (Image icon)
  Closet Value (DollarSign icon)

(bottom)
  Profile / Settings
```

### 8.6 Top Bar

- Height: 64px
- Position: sticky top, bg `--color-bg` with subtle backdrop-blur when scrolled
- Left: page title `--text-h2` (or breadcrumb trail on nested pages)
- Right: search input (pill-shaped, `--radius-full`, 240px wide, expandable on focus), notification bell (icon button with optional red dot), user avatar (32px, clickable → dropdown)
- Border-bottom: 1px `--color-border` (appears only after scroll, via JS scroll listener)
- On mobile web: hamburger icon replaces page title on left

### 8.7 Score Circle

- Size: 80px diameter (slightly larger than mobile)
- SVG-based: track ring `--color-primary-200` (3px stroke), filled ring `--color-primary-500` (3px stroke), animated dashoffset on mount
- Number centered: `--text-score`, `--color-primary-500`
- Label below: `--text-caption`, `--color-text-muted`
- Animate: ring fills + number counts up from 0 on first render (Framer Motion)

### 8.8 Calendar Grid

- Container: bg `--color-surface`, border 1px `--color-border`, radius `--radius-xl`, padding 24px
- Month header: `--text-h2`, left/right arrows as icon buttons
- Day-of-week: `--text-eyebrow`, `--color-text-muted`
- Day cells: 48px min-height, `--text-body-medium`
- Today: circular bg `--color-primary-500`, text white
- Day with outfit: small thumbnail (28px) or dot indicator `--color-primary-500`
- Hover on day: bg `--color-surface-secondary`, cursor pointer
- Click: opens side panel (on desktop, not modal — panel slides in from right) or modal on mobile
- Selected day: ring 2px `--color-primary-500`

### 8.9 Chat Interface

- Full height within main content area (calc 100vh - top bar)
- Messages area: scrollable, max-width 800px centered
- User bubble: bg `--color-primary-500`, text white, radius 16px/16px/4px/16px, max-width 65%
- AI bubble: bg `--color-surface`, border 1px `--color-border`, radius 16px/16px/16px/4px, max-width 75%
- AI bubble with outfit card: Card component embedded, full-width within bubble
- AI avatar: 32px, left of AI bubbles
- Input bar: sticky bottom, bg `--color-surface`, border-top 1px `--color-border`, padding 16px 24px
- Input: pill-shaped (`--radius-full`), flexible width, 44px height
- Attach button: icon button left of input
- Send button: 40px circle, bg `--color-primary-500`, white arrow icon, right of input
- Suggestion chips: row above input bar, horizontally scrollable, `--space-sm` gap
- Typing indicator: 3 dots pulsing in AI-bubble shape

### 8.10 Modal / Dialog

- Overlay: `--color-overlay`, fade in 200ms
- Container: bg `--color-surface`, radius `--radius-xl`, shadow `--shadow-xl`, max-width 480px (sm) / 640px (md) / 800px (lg)
- Padding: 24px
- Header: `--text-h3`, close X button top-right (icon button)
- Animate: scale 0.95 + opacity 0 → scale 1 + opacity 1 (Framer Motion)
- Focus trap: first focusable element gets focus, tab cycles within modal
- Close on Escape key, close on overlay click

### 8.11 Toast / Notification

- Position: top-right, 20px from edges
- Container: bg `--color-surface`, border 1px `--color-border`, radius `--radius-lg`, shadow `--shadow-lg`, max-width 380px
- Left stripe: 3px wide, color per type (success/danger/warning/info)
- Animate: slide in from right + fade (Framer Motion), auto-dismiss after 5s
- Close button: small X icon button

### 8.12 Dropdown / Select

- Trigger: same as Input styling, with chevron-down icon right
- Dropdown panel: bg `--color-surface`, border 1px `--color-border`, radius `--radius-md`, shadow `--shadow-lg`, max-height 280px with scroll
- Items: height 40px, padding 0 16px, `--text-body`
- Hover: bg `--color-surface-secondary`
- Selected: bg `--color-primary-50`, text `--color-primary-500`, check icon right
- Animate: scale from top (Framer Motion, origin top)

### 8.13 Table (for lists that need columns — closet value, rating history)

- Container: bg `--color-surface`, border 1px `--color-border`, radius `--radius-xl`, overflow hidden
- Header row: bg `--color-surface-secondary`, `--text-caption`, `--color-text-muted`, uppercase, height 44px
- Body rows: height 56px, border-bottom 1px `--color-border` (last row no border)
- Row hover: bg `--color-overlay-light`
- Cell padding: 0 16px
- Responsive: below `md`, switch to card-based layout instead of table

### 8.14 Drag-and-drop Checklist Row (Travel Packing)

- Row: bg `--color-surface`, border 1px `--color-border`, radius `--radius-md`, height 52px, padding 0 16px
- Drag handle: left edge, 6 dots grid icon, `--color-text-muted`, cursor grab
- Thumbnail: 40px square, radius `--radius-sm`
- Text: `--text-body-medium`
- Checkbox: 22px, border 1.5px `--color-border`, radius 6px; checked: bg `--color-primary-500`, white check, scale-in animation
- While dragging: shadow `--shadow-lg`, slight scale 1.02, opacity 0.9 on original position

### 8.15 Image Treatment

**Garment thumbnails:**
- Aspect: 1:1 (square)
- Radius: `--radius-md` (12px)
- bg: `--color-surface-secondary` (loading/removed-bg)
- Border: 1px `--color-border`
- Hover (in grid): scale 1.03 with overflow hidden, `--transition-normal`
- Object-fit: cover

**Hero images:**
- Aspect: 3:4 or 4:5
- Radius: `--radius-lg` inside card, `--radius-xl` standalone
- Shadow: `--shadow-md`

**Avatar:**
- Circular, sizes: 28px (inline), 32px (nav/chat), 40px (comments), 64px (profile header), 96px (profile page)
- Border: 2px solid `--color-border`
- Fallback: initials on `--color-primary-100` bg, text `--color-primary-500`

**Color swatches:**
- Circular, 36px
- Shadow: `--shadow-xs`
- Gap: `--space-sm`
- Hover: scale 1.15, shadow `--shadow-sm`, tooltip with color name

### 8.16 Upload Zone (web-specific — replaces mobile camera capture)

- Border: 2px dashed `--color-border`, radius `--radius-xl`
- Background: `--color-surface`
- Hover: border `--color-primary-300`, bg `--color-primary-50`
- Active drag-over: border `--color-primary-500`, bg `--color-primary-100`, scale 1.01
- Content: centered icon (Upload cloud, 48px, `--color-text-muted`), "Drag & drop or click to browse", `--text-body`, `--color-text-muted`
- Accepted formats note: `--text-caption`, `--color-text-muted`
- File preview after selection: thumbnail grid below zone, each with X-remove button
- Transition: border-color + bg `--transition-normal`

### 8.17 Skeleton Loading

- Color: `--color-surface-tertiary` base, pulse to `--color-surface-secondary`
- Radius: matches the element it replaces
- Animation: CSS `@keyframes pulse` — opacity 0.5 → 1 → 0.5, 1.5s infinite ease-in-out
- Compose skeletons to match layout: text lines (different widths), image blocks (aspect ratio preserved), card shells
- Never use a spinner except inside a button's loading state

### 8.18 Breadcrumbs (web-specific)

- Text: `--text-sm`, `--color-text-muted`
- Active (current page): `--color-text-primary`, font-weight 500
- Separator: "/" or chevron, `--color-text-muted`
- Links: hover underline
- Shown in top bar on nested pages (e.g. Closet > Item Detail)

### 8.19 Empty State

- Centered vertically and horizontally within the content area
- Icon: 64px, `--color-text-muted` (relevant lucide icon)
- Headline: `--text-h3`, `--color-text-primary`
- Description: `--text-body`, `--color-text-muted`, max-width 400px, text-center
- CTA button: primary, below description, `--space-2xl` gap

### 8.20 Callout Card

- Background: `--color-primary-50` (or `--color-primary-100` for stronger emphasis)
- Radius: `--radius-md`
- Padding: 16px 20px
- Icon: left, 20px, `--color-primary-500` (lightbulb for tips, sparkle for AI, info for general)
- Title: `--text-body-semibold`
- Body: `--text-body`, `--color-text-secondary`
- No border, no shadow

---

## 9. Page Layout Patterns

### Auth pages (no sidebar, standalone layout)
- Split layout: left 50% = form, right 50% = brand hero (large fashion photo with warm gradient overlay + tagline text)
- Form side: centered vertically, max-width 420px
- Mobile: hero collapses, form takes full width with brand wordmark at top

### Dashboard / Home
- Single column, max-width 900px centered
- Sections: greeting → weather strip → today's outfit hero → quick actions row → recent activity

### Grid pages (Closet, Saved Outfits, Rating History)
- Top bar: title left, action buttons right (Add, Filter, View toggle)
- Filter row: horizontal chip bar
- Grid: 4 columns on xl, 3 on lg, 2 on md, 1 on sm
- Gap: `--space-2xl`

### Detail pages (Item Detail, Outfit Detail)
- Two-column on desktop: image left (sticky, 45% width), content right (scrollable, 55%)
- Single column on mobile: image top, content below

### Analysis/Results pages (Style Coach, Color Analysis, Gap Analysis, Value Calculator)
- Single column, max-width 800px centered
- Hero section at top (image/stat), detail sections below
- Generous vertical spacing (`--space-3xl` between sections)

### Input → Result pages (Shopping, Capsule, Travel, Pinterest)
- Start state: centered input zone (upload + fields), max-width 600px
- Result state: full-width results layout (specific per feature)
- Transition between states: Framer Motion crossfade

---

## 10. Accessibility Requirements

- All interactive elements must have visible focus-visible rings
- Color contrast: text on bg must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- All images need alt text (garment: "[type] in [color]", outfit: "Outfit for [occasion]")
- Modals trap focus and close on Escape
- Form inputs have associated labels (not just placeholders)
- Buttons have descriptive text or aria-label
- Page titles update per route (Next.js metadata)
- Reduced motion: wrap Framer Motion in `useReducedMotion()` check, fall back to instant transitions
- Keyboard navigation: all features reachable without a mouse
- Screen reader: live regions for toast notifications, loading state announcements