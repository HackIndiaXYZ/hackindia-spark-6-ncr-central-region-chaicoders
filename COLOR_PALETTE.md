# 🎨 Official Color Palette

This document defines the core visual identity and color system for **Intellect**. These colors are derived from the project's high-end, organic-tech aesthetic requirements.

## 🏛️ Background System
These colors are used for full-bleed sections, containers, and cards.

| Color | RGB Value | Hex (Approx) | Usage |
| :--- | :--- | :--- | :--- |
| **Steel Blue** | `rgb(150, 169, 194)` | `#96A9C2` | Primary Section Backgrounds |
| **Cream** | `rgb(243, 238, 212)` | `#F3EED4` | Highlight/Secondary Sections |
| **Desert Sand** | `rgb(227, 201, 178)` | `#E3C9B2` | Accent Backgrounds |
| **Sage Grey** | `rgb(194, 194, 176)` | `#C2C2B0` | System/Neutral Surfaces |
| **Sky Tint** | `rgb(162, 190, 206)` | `#A2BECE` | Secondary Surfaces |

## 🖋️ Typography System
Standardized colors for headers, body, and UI elements.

| Color | RGB Value | Hex (Approx) | Usage |
| :--- | :--- | :--- | :--- |
| **Onyx** | `rgb(0, 0, 0)` | `#000000` | Primary Headings (H1, H2) |
| **Electric Blue** | `rgb(0, 0, 238)` | `#0000EE` | Action Links / Primary Accents |
| **Taupe** | `rgb(170, 151, 133)` | `#AA9785` | Subtext / Metadata |
| **Charcoal** | `rgb(38, 42, 49)` | `#262A31` | Body Text / Dark UI |
| **Tan** | `rgb(199, 150, 107)` | `#C7966B` | High-End Accents / Callouts |

## 🛠️ Implementation (NextSteps)
- **Global CSS Variables**: Map these to `--bg-primary`, `--text-primary`, `--accent-blue`, etc.
- **Tailwind Extension**: Add to `tailwind.config.ts` under the `theme.extend.colors` section.
- **Section Transitions**: Use these colors for the `LuxurySection` sticky bars and backgrounds.
