# Dawn Theme — Design System Analysis

> **Theme:** Dawn v15.4.1 by Shopify  
> **Base:** `auto-parts-theme` (PetExpress MVP overlay)  
> **Architecture:** Shopify Online Store 2.0 — template-driven rendering

---

## 1. Color System

### 1.1 Architecture

Colors are defined as **CSS custom properties** using RGB channel values, dynamically generated from Shopify's 5 color schemes (`config/settings_data.json`). Each scheme is rendered into a `.color-{id}` class in `layout/theme.liquid` via Liquid loops.

### 1.2 Color Schemes

| Scheme | Background | Text | Button | Button Label | Shadow |
|--------|-----------|------|--------|-------------|--------|
| **scheme-1** (Default) | `#FFFFFF` | `#121212` | `#121212` | `#FFFFFF` | `#121212` |
| **scheme-2** (Light gray) | `#F3F3F3` | `#121212` | `#121212` | `#F3F3F3` | `#121212` |
| **scheme-3** (Dark blue) | `#242833` | `#FFFFFF` | `#FFFFFF` | `#000000` | `#121212` |
| **scheme-4** (Dark) | `#121212` | `#FFFFFF` | `#FFFFFF` | `#121212` | `#121212` |
| **scheme-5** (Accent blue) | `#334FB4` | `#FFFFFF` | `#FFFFFF` | `#334FB4` | `#121212` |

### 1.3 CSS Custom Properties

**Color tokens** (set per scheme on `.color-{id}` class):

| Property | Description |
|----------|-------------|
| `--color-background` | Background RGB (e.g. `255,255,255`) |
| `--gradient-background` | Optional gradient override, falls back to solid color |
| `--color-background-contrast` | Auto-computed contrast variant |
| `--color-foreground` | Text color RGB |
| `--color-shadow` | Shadow color RGB |
| `--color-button` | Primary button background |
| `--color-button-text` | Primary button label |
| `--color-secondary-button` | Secondary button bg (same as background) |
| `--color-secondary-button-text` | Secondary button label / link color |
| `--color-link` | Link text color |
| `--color-badge-foreground` | Badge text |
| `--color-badge-background` | Badge bg |
| `--color-badge-border` | Badge border |
| `--payment-terms-background-color` | Payment section bg |

**Alpha utilities** (global):

| Variable | Value | Usage |
|----------|-------|-------|
| `--alpha-button-background` | `1` | Button bg opacity |
| `--alpha-button-border` | `1` | Button border opacity |
| `--alpha-link` | `0.85` | Link text opacity |
| `--alpha-badge-border` | `0.1` | Badge border opacity |

**Common `rgba()` patterns**:

```
rgba(var(--color-foreground), 0.75)  → body text
rgba(var(--color-foreground), 0.55)  → placeholder text
rgba(var(--color-foreground), 0.50)  → focus outline
rgba(var(--color-foreground), 0.20)  → borders, selection highlight
rgba(var(--color-foreground), 0.10)  → media background
rgba(var(--color-foreground), 0.08)  → header bottom border
rgba(var(--color-foreground), 0.04)  → secondary background
```

---

## 2. Typography

### 2.1 Font Stack

- **Body:** `var(--font-body-family)` — defaults to `Assistant, sans-serif` (configurable)
- **Headings:** `var(--font-heading-family)` — defaults to `Assistant, sans-serif` (configurable)
- Fonts served via Shopify CDN with `font-display: swap`, preloaded in `<head>`

### 2.2 Sizing System

Base: `html { font-size: calc(var(--font-body-scale) × 62.5%) }` — 1rem = 10px at default (100%) scale.

Scaling controls (via theme settings):
- `--font-body-scale`: 100%-130% (default 100%)
- `--font-heading-scale`: auto-calculated from heading_scale / body_scale

### 2.3 Type Scale (at default 100% scale)

| Class/Element | Mobile | Desktop (750px+) |
|---------------|--------|-------------------|
| `.hxxl` | `clamp(5.6rem, 14vw, 7.2rem)` | same |
| `.hxl` | `5rem` | `6.2rem` |
| `.h0` | `4rem` | `5.2rem` |
| `h1, .h1` | `3rem` | `4rem` |
| `h2, .h2` | `2rem` | `2.4rem` |
| `h3, .h3` | `1.7rem` | `1.8rem` |
| `h4, .h4` | `1.5rem` | same |
| `h5, .h5` | `1.2rem` | `1.3rem` |
| `body` | `1.5rem` | `1.6rem` |
| `.text-body` | `1.5rem` | same |
| `.caption` | `1rem` | `1.2rem` |
| `.caption-large, .field__input` | `1.3rem` | same |
| `.subtitle` | `1.8rem` | same |

### 2.4 Typography Properties

| Property | Value |
|----------|-------|
| Body line-height | `calc(1 + 0.8 / var(--font-body-scale))` |
| Heading line-height | `calc(1 + 0.3 / max(1, var(--font-heading-scale)))` |
| Body letter-spacing | `0.06rem` |
| Heading letter-spacing | `calc(var(--font-heading-scale) × 0.06rem)` |
| Word-break | `break-word` on headings |

---

## 3. Layout System

### 3.1 Page Container

```css
.page-width {
  max-width: var(--page-width);  /* default: 120rem (1200px), configurable 1000-1600 */
  margin: 0 auto;
  padding: 0 1.5rem;  /* mobile */
  /* desktop (750px+): padding: 0 5rem */
}
```

### 3.2 Grid System

| Property | Default | Range |
|----------|---------|-------|
| `--grid-desktop-horizontal-spacing` | 8px | 4-40px |
| `--grid-desktop-vertical-spacing` | 8px | 4-40px |
| `--grid-mobile-horizontal-spacing` | 4px (half) | 2-20px |
| `--grid-mobile-vertical-spacing` | 4px (half) | 2-20px |

Grid uses Flexbox-based layout (`.grid` class), not CSS Grid. Items wrapped in `.grid__item` with width classes like `grid--1-col`, `grid--2-col`, `grid--3-col`, etc.

### 3.3 Section Spacing

| Variable | Mobile | Desktop |
|----------|--------|---------|
| `--spacing-sections-mobile` | `settings.spacing_sections` (clamped, min 20px if ≥24) | — |
| `--spacing-sections-desktop` | — | `settings.spacing_sections` (0-100px, default 0) |

### 3.4 Breakpoints

| Breakpoint | Target |
|-----------|--------|
| `750px` | Tablet+ / Desktop |
| `990px` | Desktop+ |
| `1025px` | Large desktop |
| `1440px` | Extra large |

---

## 4. Component Styles

### 4.1 Buttons

- **Border radius:** `var(--buttons-radius)` — default 0px (configurable 0-40px)
- **Border width:** `var(--buttons-border-width)` — default 1px (configurable 0-12px)
- **Border opacity:** `var(--buttons-border-opacity)` — default 100% (configurable 0-100%)
- **Shadow:** `var(--buttons-shadow-*)` — default disabled (opacity 0)
- **Primary button:** uses `--color-button` + `--color-button-text`
- **Secondary button:** uses `--color-secondary-button` + `--color-secondary-button-text`

### 4.2 Cards (Product, Collection, Blog)

Each card type follows the same pattern with independent settings:

| Property | Product Card | Collection Card | Blog Card |
|----------|-------------|-----------------|-----------|
| Style | `standard` / `card` | `standard` / `card` | `standard` / `card` |
| Corner radius | 0px (0-40) | 0px (0-40) | 0px (0-40) |
| Border width | 0px (0-24) | 0px (0-24) | 0px (0-24) |
| Shadow opacity | 0% (0-100) | 0% (0-100) | 0% (0-100) |
| Image padding | 0px (0-20) | 0px (0-20) | 0px (0-20) |
| Text alignment | left | left | left |
| Color scheme | scheme-2 | scheme-2 | scheme-2 |

CSS variables pattern: `--product-card-*`, `--collection-card-*`, `--blog-card-*`

### 4.3 Inputs

| Property | Default | Range |
|----------|---------|-------|
| Border radius | 0px | 0-40px |
| Border width | 1px | 0-12px |
| Border opacity | 55% | 0-100% |
| Shadow | Disabled | 0-100% |

### 4.4 Variant Pills

| Property | Default | Range |
|----------|---------|-------|
| Border radius | 40px (fully rounded) | 0-40px |
| Border width | 1px | 0-12px |
| Border opacity | 55% | 0-100% |

### 4.5 Badges

| Property | Default |
|----------|---------|
| Position | Bottom left |
| Corner radius | 40px (fully rounded) |
| Sale badge scheme | scheme-5 (blue accent) |
| Sold out badge scheme | scheme-3 (dark blue) |

### 4.6 Media

| Property | Default | Range |
|----------|---------|-------|
| Border width | 1px | 0-24px |
| Border opacity | 5% | 0-100% |
| Corner radius | 0px | 0-40px |
| Shadow | Disabled | 0-100% |

### 4.7 Modals / Drawers / Popups

- **Drawers:** border-width 1px, border-opacity 10%, no shadow
- **Popups:** border-width 1px, border-opacity 10%, no shadow, 0px radius
- **Text boxes (content containers):** all settings default to 0 (no border, no shadow)

---

## 5. Animations & Transitions

### 5.1 Scroll Reveal

- **Setting:** `animations_reveal_on_scroll` (boolean, default `true`)
- **JS:** `assets/animations.js` (loaded with `defer`)
- Elements are revealed on scroll via Intersection Observer

### 5.2 Hover Effects

- **Setting:** `animations_hover_elements` (select)
- **Options:**
  - `default` — standard hover
  - `vertical-lift` — cards lift vertically on hover
  - `3d-lift` — 3D transform effect on hover
- **Body class:** `.animate--hover-{value}`

### 5.3 Border & Shadow System

Each component group has its own set of CSS variables:
- `--{component}-border-width`, `--{component}-border-opacity`
- `--{component}-radius`
- `--{component}-shadow-opacity`, `--{component}-shadow-horizontal-offset`, `--{component}-shadow-vertical-offset`, `--{component}-shadow-blur-radius`, `--{component}-shadow-visible`

Components: `product-card`, `collection-card`, `blog-card`, `text-boxes`, `media`, `buttons`, `inputs`, `variant-pills`, `popup`, `drawer`

---

## 6. Section Architecture

### 6.1 Template Structure

```
layout/theme.liquid
  ├── {{ content_for_header }}     (Shopify injected)
  ├── {{ content_for_layout }}     (template content)
  ├── {% sections 'header-group' %}
  ├── {% sections 'footer-group' %}
  └── <main id="MainContent">
```

### 6.2 Section Rendering

Templates (`templates/*.json`) define which sections to render and in what order. Each section is a `.liquid` file with `{% schema %}` metadata.

### 6.3 Section Fallbacks / Defaults

The theme includes ~50+ section files (52 `.liquid`) covering:
- **Header:** announcement-bar, header, search-drawer
- **Footer:** footer
- **Content:** image-banner, slideshow, video, text-with-image, collage, multicolumn, rich-text, newsletter, email-signup, contact-form, custom-liquid
- **Commerce:** main-product, featured-collection, collection-list, main-collection-product-grid, cart-live-region-items, cart-drawer, cart-footer
- **Blog:** main-blog, main-article, blog-posts
- **Utility:** popup, age-verification, store-availability

---

## 7. Snippet System

The theme includes 37 snippet files covering reusable patterns:

- **Icons:** icon-accordion, icon-arrow, icon-cart, icon-checkmark, icon-close, icon-email, icon-error, icon-hamburger, icon-padlock, icon-play, icon-plus, icon-success, icon-tax, icon-tiktok
- **UI:** card-collection, card-product, card-blog, card-style, price, rating, badge, media, breadcrumb, share-button, social-media, social-icons
- **Commerce:** buy-buttons, quick-order-list, variant-option, variant-selects, quantity-popover, volume-pricing, modal-media
- **Utility:** predictive-search, search, sku-or-available, complementary-skus

---

## 8. Accessibility

- **Skip-to-content link:** `<a class="skip-to-content-link button visually-hidden">`
- **`visually-hidden` class:** screen-reader-only content
- **Focus outlines:** `--focused-base-outline: 0.2rem solid rgba(var(--color-foreground), 0.5)` with `--focused-base-outline-offset: 0.3rem`
- **Role attributes** throughout template sections
- **`aria-label`, `aria-expanded`, `aria-controls`** on interactive elements
- **`defer`** on all JS for non-blocking load

---

## 9. PetExpress MVP Overlay (Custom Sections)

Per `AGENTS.md`, the project adds these custom sections on top of Dawn:

| Section | Purpose |
|---------|---------|
| `sections/hero.liquid` | Fullscreen hero with bg image, overlay, shop name + subtitle + CTA |
| `sections/featured-collection.liquid` | First 8 products from `collections.all`, 2-col desktop / 1-col mobile grid |
| `sections/low-stock-slider.liquid` | Swiper horizontal carousel for inventory ≤5 products, responsive (1→2→4 slides) |

**Design constraints for custom sections:**
- Pure Liquid + native CSS (system font stack, no external fonts)
- Swiper 11 via CDN (sole third-party dependency)
- No section `settings` — all content hardcoded
- Follows Dawn's spacing / color scheme conventions

---

## 10. HTML Body Structure

```html
<body class="gradient animate--hover-{type}">
  <a class="skip-to-content-link button visually-hidden" href="#MainContent">
    Skip to content
  </a>
  
  {% if cart_type == 'drawer' %}
    {% render 'cart-drawer' %}
  {% endif %}
  
  {% sections 'header-group' %}
  
  <main id="MainContent" class="content-for-layout focus-none" role="main">
    {{ content_for_layout }}
  </main>
  
  {% sections 'footer-group' %}
</body>
```

The body uses CSS Grid layout:
```css
body {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: 100%;
  min-height: 100%;
}
```

---

## 11. Key CSS Files

| File | Purpose |
|------|---------|
| `assets/base.css` | Foundation styles (root variables, page-width, typography base, grid, utilities) |
| `assets/component-*.css` | Individual component styles (~25 files) |
| `assets/section-*.css` | Section-specific styles (~10 files) |
| `assets/global.js` | Core theme JavaScript |
| `assets/animations.js` | Scroll reveal animations |
| `assets/details-disclosure.js` | Accordion/disclosure behavior |
| `assets/details-modal.js` | Modal dialog behavior |
| `assets/search-form.js` | Search form interactions |
| `assets/predictive-search.js` | Predictive search (conditional) |
| `assets/cart-drawer.js` | Drawer cart (conditional) |

---

*Generated from Dawn v15.4.1 source analysis — June 2026*
