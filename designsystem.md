# Design System Specification

The design system below is the single source of truth. It overrides any assumptions about what a 'A image generation tool for furniture and fabric stores that allows the user to upload an image and then skin their furniture with new fabric


' typically looks like. Apply these tokens exactly — colors, spacing, radius, elevation, motion — even if they contradict conventional patterns for this project type.

Use only the tokens defined below within each category. Do not introduce new values. If a token cannot be applied under stack constraints, skip it rather than approximating.

## Design DNA (read this first)

- Layout: Contained layout — max-width 1280px, 12-column grid. Gutter 15px, margin 20px.
- Spacing: Balanced spacing — standard density. Base unit 20px.
- Surfaces: Sharp corners everywhere — geometric, brutalist. Bordered (1px at 12% opacity) — explicit structure. Flat design — no decorative box-shadow.
- Motion: Snappy motion — fast feedback, minimal wait.
- Color: Primary #D94030 + Accent #206cdf — vibrant, saturated palette.
- Type: Inter (single font system).

This combination defines the visual personality. Every token below serves this DNA. Prioritize tokens that reinforce these characteristics.

## 1. Color Tokens

### Primary: #D94030 — hsl(6, 69%, 52%)
Shades (darker): primary-100: #310804, primary-200: #60120a, primary-300: #8d1e12, primary-400: #b82c1c
Base: primary-500: #D94030
Tints (lighter): primary-600: #d76f63, primary-700: #da9891, primary-800: #e2beba, primary-900: #eee1df
Text on primary: #110504 (primary), #551913 (secondary)

### Secondary: #1a1a1a — hsl(0, 0%, 10%)
Shades (darker): secondary-100: #0f0f0f, secondary-200: #0f0f0f, secondary-300: #0f0f0f, secondary-400: #141414
Base: secondary-500: #1a1a1a
Tints (lighter): secondary-600: #4b4444, secondary-700: #7b6f6f, secondary-800: #a89f9f, secondary-900: #d3cfcf
Text on secondary: #cdcdcd (primary), #818181 (secondary)

### Accent: #206cdf — hsl(216, 75%, 50%)
Shades (darker): accent-100: #021531, accent-200: #062a60, accent-300: #0c408d, accent-400: #1556b7
Base: accent-500: #206cdf
Tints (lighter): accent-600: #578cdb, accent-700: #89aadc, accent-800: #b6c8e2, accent-900: #dde4ee
Text on accent: #f2f6fd (primary), #b5cef4 (secondary)

### Color Mode
- Dark mode only. Background: #111110 or #0A0A09. Surfaces: progressively lighter shades (#1a1a19, #222221, #2a2a28). Text: light (#eeeee8, #b0b0a8, #88887e).

### Semantic Colors
- Success: #22C55E | Warning: #F59E0B | Error: #EF4444 | Info: #3B82F6

### Surfaces (Dark theme)
- bg: #111110 | surface-1: #1a1a19 | surface-2: #222221 | surface-3: #2a2a28
- Border: rgba(255,255,255,0.12) — defined in Borders section below
- Text primary: #eeeee8, secondary: #bbbbb4, tertiary: #88887e, disabled: #55554e

### Interactive State Colors (derived from primary)
- Primary hover: #be3223
- Primary active: #9f2a1d
- Ghost hover bg: rgba(217, 64, 48, 0.08)
- Disabled opacity: 0.4 (applied to all disabled interactive elements — buttons, inputs, selects)

### Focus Indicator Strategy
- Buttons/links/cards: outline: 2px solid #206cdf, offset 2px. No transition.
- Inputs: border 1px solid #D94030 + box-shadow: 0 0 0 2px rgba(217, 64, 48, 0.2). Transition: 60ms.
- Never remove focus without replacement. Never combine outline + box-shadow on same element.

### Overlay & Effects
- Backdrop overlay: rgba(0,0,0, 0.6)
- Uniform overlay (cover cards): rgba(0,0,0, 0.35)
- Backdrop blur: DISABLED — use solid backdrop overlay instead (raw aesthetic, no visual embellishment)
- Scrim gradient: DISABLED — use uniform overlay rgba(0,0,0, 0.35) for cover cards instead of gradient

## 2. Typography

### Heading Font: Inter
- Family: 'Inter', 'Helvetica Neue', Arial, sans-serif
- Load: Google Fonts — fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
- Weights available: 400, 500, 600, 700
- Use for: page titles, section headers, hero text, display numbers, card headings

### Body Font: Inter
- Family: 'Inter', 'Helvetica Neue', Arial, sans-serif
- Load: Google Fonts — fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
- Weights available: 400, 500, 600, 700
- Use for: paragraphs, UI labels, buttons, inputs, captions, navigation, metadata

### Pairing Strategy
Inter + Inter (both sans) — cohesion through same category. Differentiate via weight: heading at 600-700 for titles, body at 400 for text.

### Type Scale — Editorial (ratio custom)
Apply these exact values. Define as CSS custom properties or design tokens:

**Overline** → font-family: Inter | font-size: 10px | font-weight: 500 | line-height: 1.2 | letter-spacing: 0.1em | text-transform: uppercase
**Caption** → font-family: Inter | font-size: 12px | font-weight: 400 | line-height: 1.4 | letter-spacing: 0.02em
**Body** → font-family: Inter | font-size: 18px | font-weight: 400 | line-height: 1.7 | letter-spacing: 0em
**Lead** → font-family: Inter | font-size: 22px | font-weight: 400 | line-height: 1.5 | letter-spacing: 0em
**Title** → font-family: Inter | font-size: 36px | font-weight: 600 | line-height: 1.1 | letter-spacing: -0.01em
**Headline** → font-family: Inter | font-size: 52px | font-weight: 700 | line-height: 1 | letter-spacing: -0.02em
**Display** → font-family: Inter | font-size: 80px | font-weight: 700 | line-height: 0.95 | letter-spacing: -0.03em

### Iconography — Lucide
- Library: Lucide (1,500+ icons) by Community (Feather fork)
- Styles: Outline · adjustable stroke
- Grid: 24px · 2px rounded strokes — clean, modern, widely adopted
- Style: Outlined, stroke-width 2px, linecap round
- License: ISC · lucide.dev
- Install: npm install lucide-react. Import by PascalCase name and render as JSX component with size prop.

## 3. Surfaces & Depth

### Border Radius
- Global: 0px (sharp). No border-radius on any element. Hard geometric edges throughout.

### Elevation (Box Shadow)
- Flat design: no decorative elevation box-shadow for depth/separation. Use 1px borders or background contrast (#1a1a19 vs #222221) for card separation.
- Focus indicators use outline or box-shadow as defined in Focus Indicator Strategy (§1). These are accessibility markers, NOT decorative elevation — always permitted regardless of flat/shadow setting.

### Borders
- Width: 1px | Style: solid
- Color (dark): rgba(255,255,255,0.12) | Color (light): rgba(255,255,255,0.12)
- Component mapping:
  - Cards / Panels: 1px solid, 12% opacity
  - Inputs (default): 1px solid, 12% opacity
  - Inputs (focus): border color changes to primary + focus ring as defined in Focus Indicator Strategy (§1)
  - Outlined / secondary buttons: 1px solid, 12% opacity
- Dividers (section breaks): 1px solid, 6% opacity — lighter than component borders
- Separators (within components): 1px solid, 12% opacity
- Border opacity scale (all formally defined tokens):
  - Base: 0.12 (12%) — default state
  - Divider: 0.06 (6%) — section breaks, lighter than components
  - Hover: 0.18 (18%) — interactive hover state
  - Focus: 0.24 (24%) — interactive focus state
- Pre-computed border color tokens (dark theme — use these directly in code):
  - border-base: rgba(255,255,255,0.12)
  - border-divider: rgba(255,255,255,0.06)
  - border-hover: rgba(255,255,255,0.18)
  - border-focus: rgba(255,255,255,0.24)
- Interactive: on hover use border-hover, on focus use border-focus from the tokens above.

### Card Anatomy
- All radii: 0px — sharp geometric edges on all card elements
- Card padding: 15px
- Content gap: 10px between elements
- Image aspect-ratio: 16/9 — use CSS aspect-ratio property directly, not padding hacks
- Image fit: object-fit: cover (crop to fill, no empty space)
- Content alignment: text-align left, flex items align-items flex-start
- Vertical content alignment: center (vertically centered)
- Actions: aligned left
- CTA button radius: 0px (matches global button radius)

#### Card Layouts (all available in this design system):
- Cover: image fills entire card. Content overlay at bottom with uniform overlay rgba(0,0,0,0.35). White text for contrast. overflow:hidden. Use for hero cards, featured content, media galleries.
- Top image: image flush to top/side edges, no padding. overflow:hidden clips to outer radius. Content padded below. Standard blog/product card.
- Inset: 15px padding throughout. Image inside gets border-radius 0px. Consistent negative space between image and card corners. Refined, contained look.
- Horizontal: 15px padding. Image left at ~38% width, aspect-ratio 3/4. Content right. Inner radius 0px. Best for lists, search results, compact layouts.

## 4. Layout & Spacing

### Grid: 12 columns, 15px gutter, 20px margin
- CSS: display: grid; grid-template-columns: repeat(12, 1fr); gap: 15px
- Container: max-width 1280px, margin 0 auto, padding 0 20px
- Responsive breakpoints:
  - xs (base): 1 columns, 8px gutter, 15px margin
  - sm (≥640px): 2 columns, 10px gutter, 20px margin
  - md (≥768px): 6 columns, 15px gutter, 20px margin
  - lg (≥1024px): 8 columns, 15px gutter, 20px margin
  - xl (≥1280px): 12 columns, 15px gutter, 20px margin
  - 2xl (≥1536px): 12 columns, 15px gutter, 20px margin
- Content area: 1240px max
- Sidebar pattern: content occupies ~8/12 cols, sidebar ~4/12 cols on lg+

### Spacing (density: default, base: 20px)
Scale: 4xs:3px | 3xs:5px | 2xs:8px | xs:10px | sm:15px | md:20px | lg:30px | xl:40px | 2xl:60px | 3xl:80px | 4xl:120px
Use only these values for layout margin, padding, and gap. Values in Component Sizing (heights, internal padding) and Focus Dimension Tokens are declared independently in their respective sections.

### Component Sizing
- Button height: 40px (sm: 30px, lg: 50px)
- Input height: 40px, horizontal padding 12px
- Icon: 16px sm, 20px default, 24px lg
- Avatar: 32px sm, 40px md, 48px lg
- Touch target minimum: 44×44px
- Modal max-width: 480px

## 5. Motion

### Timing Tokens
| Role | Duration | Easing |
|------|----------|--------|
| Micro (hover, focus, press) | 60ms | cubic-bezier(0,.9,.1,1) |
| Base (dropdown, tooltip, toggle) | 120ms | cubic-bezier(0,.9,.1,1) |
| Medium (modal, drawer, panel) | 180ms | cubic-bezier(0,.9,.1,1) |
| Large (page, hero, onboarding) | 300ms | cubic-bezier(0,.9,.1,1) |

### Easing by Intent
- Enter: cubic-bezier(0,.9,.1,1) | Exit: cubic-bezier(.4,0,1,1) | Move: cubic-bezier(.4,0,.2,1) | Micro: cubic-bezier(0,.9,.1,1)

### Exit Durations (pre-computed: enter × 0.6)
- Press: 36ms | Dropdown exit: 72ms | Modal exit: 108ms | Toast exit: 60ms

### Transitions (apply these exactly)
- Hover: all 60ms cubic-bezier(0,.9,.1,1)
- Press: scale(0.97) 36ms cubic-bezier(0,.9,.1,1)
- Dropdown: translateY(-4px→0) + opacity 120ms enter / 72ms exit
- Modal: scale(0.92→1) + translateY(8px→0) 180ms enter / 108ms exit
- Page enter: translateY(12px→0) + opacity 300ms, children stagger 15ms
- Scroll reveal: IntersectionObserver, translateY(20px→0) + opacity, once
- Card hover: translateY(-1px) + shadow lift. Card active: scale(0.99)

### Stagger: 15ms per child, pattern: cascade
- @media (prefers-reduced-motion: reduce): disable all animation

## 6. Visual Direction

**Swiss**: Strict mathematical grid. Generous whitespace. Flat color fields. Asymmetric layouts with scale contrast. Typography does all visual work — no decorative elements.

## 7. Component Specifications

### Buttons
- Primary: bg #D94030, text #110504, radius 0px, h 40px, px 20px, weight 500
- Secondary: bg transparent, border 1px solid #D94030, text #D94030
- Ghost: bg transparent, no border, text #D94030, hover bg rgba(217, 64, 48,0.08)
- States: hover bg #be3223 + transition 60ms cubic-bezier(0,.9,.1,1), active bg #9f2a1d + scale(0.98), disabled opacity 0.4 + pointer-events none, focus outline 2px solid #206cdf offset 2px

### Cards
- bg #1a1a19, radius 0px, padding 15px, border 1px solid rgba(255,255,255,0.12)
- Hover: border color rgba(255,255,255,0.18) + translateY(-1px). Active: scale(0.99)

### Inputs
- h 40px, radius 0px, border 1px solid rgba(255,255,255,0.12), px 12px
- Focus: border 1px solid #D94030 + box-shadow 0 0 0 2px rgba(217, 64, 48,0.2). Error: border 1px solid #EF4444. Disabled: bg #222221 opacity 0.4

### Modals
- Backdrop: rgba(0,0,0,0.6). Panel: bg #1a1a19, radius 0px, border 1px solid rgba(255,255,255,0.12), max-w 480px, p 30px

### Dropdowns / Popovers / Tooltips
- bg #222221, radius 0px, border 1px solid rgba(255,255,255,0.12)
- Position: offset 8px from trigger. Animation: scale(0.95) → scale(1) + fade, 120ms cubic-bezier(0,.9,.1,1)

### Toast / Snackbar
- Bottom-right, 20px from edges. bg #222221, radius 0px, border 1px solid rgba(255,255,255,0.12), auto-dismiss 5s.
- Enter: slide-up + fade 120ms cubic-bezier(0,.9,.1,1). Exit: fade 60ms cubic-bezier(.4,0,1,1). Stack up to 3, gap 10px.

## 8. Accessibility

- WCAG AA contrast (4.5:1 body, 3:1 large). Focus: outline #206cdf 2px for buttons/links, box-shadow ring for inputs. Keyboard: Tab + Enter/Space. ARIA labels on icon buttons, aria-expanded on toggles, aria-live on dynamic content. Color never sole indicator.

## 9. Implementation: Cursor

- Proper file structure: components/, styles/, utils/, types/. CSS custom properties in tokens.css. TypeScript types for all components.

# Output Requirements

1. The design system above is law. Apply every token exactly as specified — do not default to conventional patterns for this project type.
2. Implement all interactive states (hover, focus, active, disabled) on every interactive element
3. Responsive: test at 375px, 768px, 1024px, 1440px
4. Smooth transitions on all state changes using the specified easing
5. Use realistic placeholder data — no 'lorem ipsum'
6. The result must look like a polished production app, not a prototype
