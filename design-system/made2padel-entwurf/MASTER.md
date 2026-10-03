# Design System – Made2Padel Entwurf (MASTER)

> **Global Source of Truth** für die Testversion im Ordner `Entwurf/`.
> Seitenspezifische Abweichungen gehören nach `design-system/made2padel-entwurf/pages/<seite>.md` und überschreiben diese Datei.

**Projekt:** Made2Padel – personalisierte Padel-Schlägerprotektoren für Clubs
**Erstellt mit:** UI-UX-Pro-Max-Skill (Datenbank: `products.csv`, `ui-reasoning.csv`, `styles.csv`, `landing.csv`, `typography.csv`, `references/quick-reference.md`)
**Stack:** Reines HTML + CSS (statisch, GitHub Pages). Kein Tailwind, kein Build, keine externen Skripte. Nur kleines Inline-JS für Menü und Formular-Versand.

---

## 1. Herleitung (Skill-Abfrage)

| Schritt | Treffer in der Skill-Datenbank | Entscheidung |
|---|---|---|
| Produkttyp | `products.csv` #75 **Sports Team/Club** – „Vibrant & Block-based + Motion-Driven“, sekundär „Dark Mode (OLED)“; Farbe: „Team colors + Energetic accents“ | Kunde sind Clubs → Club-/Sport-Profil. Farben = unsere Markenfarben. |
| Reasoning | `ui-reasoning.csv` #75 – Pattern „Hero-Centric + Feature-Rich“, Typo „Bold + Impactful“, Anti-Pattern „Static content“ | Großer Hero, klare Feature-Blöcke, dezente Bewegung. |
| Stil | `styles.csv` #6 **Vibrant & Block-based** (große Blöcke, 48px+ Abstände, große Typo 32px+, 200–300 ms Hover) + #7 **Dark Mode (OLED)** (tiefes Schwarz, ein Neon-Akzent, sichtbarer Fokus) + #39 **Bento Box Grid** (modulare Karten mit unterschiedlichen Spannweiten) | Schwarze Fläche, Lime als einziger Akzent, Bento-Raster für Vorteile. |
| Landing-Pattern | `landing.csv` #32 **Hero-Centric Design** + #31 **Feature-Rich Showcase** | Hero → Werte-Leiste → Problem → Ablauf → Vorteile (Bento) → Qualität → CTA/Formular. CTA im Hero, in der Nav (sticky) und unten. |
| Typografie | `typography.csv` #49 **Sports/Fitness**: Barlow Condensed + Barlow („sports, athletic, energetic, condensed, action“) | Überschriften Barlow Condensed 700/800 in Versalien, Fließtext Barlow. Schriftzug bleibt Caveat Brush (Marke). |

**Bewusst NICHT übernommen:** die vom Skill vorgeschlagenen Palettenfarben (Neon Green, Purple, Pink …) – auf Wunsch bleiben Schwarz + Lime #C5E334. Google-Fonts-URLs aus der Datenbank werden nicht genutzt; alle Schriften liegen lokal.

---

## 2. Farben

| Token | Wert | Verwendung |
|---|---|---|
| `--c-bg` | `#050505` | Seitenhintergrund (Markenschwarz) |
| `--c-surface` | `#111111` | Karten, Formular |
| `--c-surface-2` | `#1A1A1A` | Hover-Flächen, Inputs |
| `--c-line` | `#2A2A2A` | Rahmen, Trennlinien |
| `--c-lime` | `#C5E334` | **Einziger Akzent**: CTAs, Kicker, Hervorhebungen, Fokus |
| `--c-lime-press` | `#B1CC2A` | Hover/Pressed auf Lime |
| `--c-on-lime` | `#050505` | Text auf Lime |
| `--c-text` | `#FFFFFF` | Überschriften |
| `--c-text-2` | `#B8B8B8` | Fließtext (Kontrast ≈ 10:1 auf #050505) |
| `--c-text-3` | `#8C8C8C` | Meta-Text, Hinweise (≈ 6:1) |
| `--c-error` | `#FF6B6B` | Formularfehler |

Regeln: Lime nie für längere Fließtexte auf Weiß; auf Schwarz ist Lime ≈ 14:1. Keine weiteren Akzentfarben. Keine Hex-Werte direkt in Komponenten – nur Tokens.

---

## 3. Typografie

| Rolle | Schrift | Gewicht | Größe |
|---|---|---|---|
| Display / H1 | Barlow Condensed, Versalien | 800 | `clamp(3.25rem, 11vw, 9rem)`, line-height 0.9 |
| H2 | Barlow Condensed, Versalien | 800 | `clamp(2.4rem, 6vw, 4.5rem)`, line-height 0.95 |
| H3 | Barlow Condensed, Versalien | 700 | 1.5rem–1.75rem |
| Kicker / Label | Barlow Condensed, Versalien, letter-spacing .12em | 600 | 0.95rem |
| Fließtext | Barlow | 400 | 1.0625rem (17px), line-height 1.6, max. 65ch |
| Lead | Barlow | 500 | `clamp(1.125rem, 2vw, 1.3rem)` |
| Schriftzug „made2padel“ | Caveat Brush | 400 | nur Logo |

Dateien (lokal, woff2, Fontsource 5.3.0, Subset latin, OFL): `Entwurf/fonts/`.
`font-display: swap`. Keine Verbindung zu fonts.googleapis.com o. ä.

---

## 4. Abstände, Raster, Formen

- **Spacing-Skala (spacious, Marketing):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px (`--s-1` … `--s-10`)
- **Sektionen:** `padding-block: clamp(64px, 10vw, 128px)`
- **Container:** `max-width: 1240px`, Seitenrand `clamp(16px, 4vw, 40px)`
- **Raster:** CSS Grid; Bento 4 Spalten (≥ 1024px) → 2 (≥ 640px) → 1
- **Radien:** Karten 20px, Buttons/Inputs 999px (Pill) bzw. 12px, Chips 999px
- **Rahmen:** 1px `--c-line`; aktive Karte: 1px Lime
- **Schatten:** keine klassischen Schatten (Dark Mode). Tiefe über Flächenfarbe und Lime-Glow nur am Hero-Ball.

---

## 5. Komponenten

- **Nav:** sticky, schwarz mit Blur, Schriftzug links, Dropdown „Menü“ (`<details>`, ohne JS bedienbar) + Lime-CTA „Muster anfragen“. Auf 375px: CTA verkürzt, Menü bleibt.
- **Buttons:** Primär = Lime-Pill, Text Schwarz, min. 48px hoch. Sekundär = Outline Weiß 1px. Hover 200ms Farbwechsel, `:active` scale(.98) ohne Layoutverschiebung.
- **Kicker:** Lime, Versalien, mit kurzem Strich davor.
- **Ticker-Leiste:** Lime-Fläche mit schwarzer Versal-Schrift (Block-Stil), langsame Laufschrift, stoppt bei reduced motion.
- **Bento-Karte:** `--c-surface`, Radius 20px, Icon 24px Strich 1.75 in Lime, Hover: Rahmen Lime.
- **Schritt-Karte:** große Nummer in Outline-Schrift (Lime-Kontur).
- **Formular:** sichtbare Labels über Feldern, Inputs 48px+, Fehlermeldung direkt am Formular (`role="status"`), Honeypot `_gotcha`, Versand per fetch an Formspree.

---

## 6. Bewegung

- Dauer: 150ms (Hover/Fokus), 250ms (Karten), 600ms (Reveal), Ticker 30s linear.
- Nur `transform` und `opacity` animieren.
- `@media (prefers-reduced-motion: reduce)`: alle Animationen aus, Ticker statisch.

---

## 7. Anti-Patterns (vermeiden)

- Emojis als Icons → nur Inline-SVG mit einheitlicher Strichstärke
- Platzhalter statt Label in Formularen
- Fokus-Ring entfernen → immer `outline: 2px solid var(--c-lime)` bei `:focus-visible`
- Horizontaler Scroll auf Mobil, Text < 12px
- Mehr als ein Akzent neben Lime, Verläufe in Bonbonfarben
- Externe Fonts, Skripte, Bilder (Datenschutz)
- Erfundene Fakten (Preise, Kundenlogos, Bewertungen) – nur Inhalte der aktuellen index.html

---

## 8. Pre-Delivery-Checkliste

- [ ] 375px und 1440px geprüft, kein horizontaler Scroll
- [ ] Kontrast Text ≥ 4.5:1, sichtbarer Fokus, Tastaturbedienung (Menü, Formular)
- [ ] Touch-Ziele ≥ 44×44px
- [ ] reduced motion respektiert
- [ ] `<meta name="robots" content="noindex">` auf jeder Seite in `Entwurf/`
- [ ] Formspree + `_gotcha` vorhanden
- [ ] Keine Requests an fremde Server außer Formspree beim Absenden
