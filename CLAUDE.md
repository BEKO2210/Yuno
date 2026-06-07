# Yuno — Projekt-Anleitung für Claude

> Diese Datei ist die zentrale Anleitung für die Arbeit an diesem Projekt.
> Sie wird bei jeder Session automatisch geladen. Bitte vor jeder größeren
> Aufgabe lesen und bei Änderungen am Projekt aktuell halten.

---

## 1. Worum geht es?

**Yuno** ist eine **Open-Source-Plattform für Wallpaper, Klingeltöne und
Benachrichtigungstöne** zum kostenlosen Ansehen und Herunterladen.

- **Inhalte:** Bilder (Wallpaper) und Audio (Klingeltöne, Notification-Sounds).
- **Zielgruppe:** alle — international, deshalb ist die **Webseite auf Englisch**.
- **Idee:** eine frei zugängliche Alternative zu kommerziellen Wallpaper-/Ton-Portalen.
- **Betreiberin / Urheberin:** Belkis Aslani.
- **Anspruch:** Keine 0815-Seite. Modern, durchdacht, **cinematic**, mit
  Scroll-Animationen — auf dem Niveau preisgekrönter Webseiten
  (Awwwards / FWA / CSS Design Awards als Referenz für Qualität, nicht zum Kopieren).

### Wichtigste Funktion für die Betreiberin
Belkis muss **bequem neue Dateien hochladen** können (Bilder + MP3), **ohne Code
anzufassen**. Dafür gibt es einen **Admin-Bereich im Browser mit Login und
Drag-&-Drop-Upload**.

---

## 2. Tech-Stack

| Bereich            | Technologie                          | Warum                                              |
|--------------------|--------------------------------------|----------------------------------------------------|
| Framework          | **Next.js (App Router) + React + TypeScript** | SSR/SEO, Galerie + Admin + API in einem            |
| Styling            | **Tailwind CSS**                     | schnelles, konsistentes Design                     |
| Animationen        | **Framer Motion**                    | cinematische Scroll-/Page-Transitions              |
| Backend / Auth     | **Supabase** (Auth, Postgres, Storage) | Login + Datenbank + Datei-Speicher, kostenloser Tarif |
| Komponenten        | **21st.dev / Magic MCP ("Dev21")**   | hochwertige UI-Komponenten generieren — bevorzugt nutzen |
| Bild-/Logo-Generierung | **Higgsfield** (inkl. **Nano Banana 2 / Pro**) | Logo, Visuals, cinematische Assets                 |
| Hosting / Deploy   | **Vercel**                           | kostenloses Hosting, native Next.js-Integration    |

> **Hinweis:** „Dev21" = 21st.dev (Magic MCP). „frame motion" = Framer Motion.
> Diese Begriffe stammen aus der ursprünglichen Notiz und meinen die Tools oben.

---

## 3. Design-Prinzipien (Look & Feel)

**Standard-Richtung: Dark & cinematic** (anpassbar — bei Bedarf hier ändern):

- Tiefes Schwarz / dunkle Basis, dezente **Glow-/Neon-Akzente**, viel räumliche Tiefe.
- Wallpaper-Vorschauen sollen **im Mittelpunkt stehen** und maximal wirken
  (dunkler Hintergrund lässt Bilder „leuchten").
- **Große, selbstbewusste Typografie**; großzügiger Weißraum (bzw. „Schwarzraum").
- **Scroll-getriebene Animationen** (Parallax, Reveals, sanfte Transitions) —
  immer **performant** und nie verspielt-überladen.
- **Animiertes Logo** für Yuno (Intro / Hover / Ladezustand).
- Konsequente Design-Sprache: ein klares Farb-, Typo- und Abstands-System
  (Design-Tokens), kein zusammengewürfeltes Aussehen.
- **Barrierefreiheit & Performance** sind Teil von „award-winning": gute
  Kontraste, `prefers-reduced-motion` respektieren, schnelle Ladezeiten,
  optimierte Bilder/Audio.

---

## 4. Funktionsumfang

### MVP (zuerst bauen)
- [ ] Startseite mit cinematischer Hero-Sektion + animiertem Yuno-Logo
- [ ] Galerie/Browse für **Wallpaper** (Grid, Vorschau, Detailansicht)
- [ ] Bereich für **Klingeltöne** und **Benachrichtigungstöne** mit Audio-Player
- [ ] **Download**-Funktion pro Datei
- [ ] **Kategorien / Tags** und einfache **Suche**
- [ ] **Admin-Bereich** (Login) mit **Drag-&-Drop-Upload** für Bilder & MP3
      inkl. Titel, Kategorie, Tags
- [ ] Responsive (Mobile-first) + Dark-Theme

### Später / Ideen
- [ ] Beliebt / Neu / Trending Sortierung, Download-Zähler
- [ ] Nutzerkonten, Favoriten/Sammlungen
- [ ] Mehrsprachigkeit (aktuell nur Englisch)
- [ ] Community-Uploads (moderiert)

---

## 5. Tools & MCP — Nutzungshinweise

- **21st.dev / Magic MCP bevorzugt verwenden**, um UI-Komponenten zu erstellen
  (auf Wunsch der Betreiberin). Danach an das Yuno-Design anpassen.
- **Higgsfield** für Logo & Visuals; **Nano Banana 2 / Pro** für
  Charakter-/Referenz-Bilder bevorzugen.
  - **Credits sind begrenzt** — sparsam und gezielt generieren. Vor teuren
    Generierungen kurz abstimmen.
- **Supabase** für Auth, Datenbank (Tabellen für Assets/Kategorien) und Storage
  (Buckets für Bilder & Audio).
- **Vercel** zum Deployen.

---

## 6. Secrets & Sicherheit — WICHTIG

- ⚠️ **Niemals API-Keys, Tokens oder Passwörter in `CLAUDE.md`, Code oder Git
  speichern.** Sie gehören ausschließlich in `.env.local` (lokal, von Git
  ausgeschlossen) bzw. in die Vercel/Supabase-Projekt-Einstellungen.
- Die ursprüngliche Notiz enthielt einen **Google-API-Key im Klartext**. Dieser
  gilt als **kompromittiert** und muss in der Google Cloud Console
  **widerrufen / neu erstellt** werden.
- Vorlage für benötigte Variablen: siehe **`.env.example`**.
- `.env.local`, `node_modules` etc. sind in **`.gitignore`** ausgeschlossen.

---

## 7. Arbeitsweise / Konventionen

- **Sprache der Webseite:** Englisch. **Sprache mit der Betreiberin:** Deutsch.
- **Vor größeren Schritten kurz abstimmen** (besonders bei Credit-Verbrauch oder
  irreversiblen Aktionen). Belkis ist keine reine Entwicklerin — Erklärungen
  verständlich halten, Fachbegriffe kurz einordnen.
- **Fragen einzeln stellen**, möglichst mit konkreter Auswahl (nicht 10 auf einmal).
- Sauberer, lesbarer Code; sinnvolle Komponenten-Struktur; TypeScript-Typen.
- Performance & Accessibility von Anfang an mitdenken.

---

## 8. Offene Punkte / To-do

- [ ] Google-API-Key widerrufen & neu erstellen (kompromittiert).
- [ ] Endgültige Farbpalette & Logo-Konzept festlegen (Standard: dark & cinematic).
- [x] Next.js-Projekt initialisieren (Scaffold). ✅
- [x] Supabase-Projekt anlegen (Buckets + Tabellen + RLS). ✅
- [x] Repo nach github.com/BEKO2210/Yuno pushen. ✅
- [x] Admin-Login (Supabase Auth, Magic-Link) + Upload-Formular. ✅
- [x] Logo/Visuals + Scroll-Videos mit Higgsfield generiert. ✅
- [x] Auf Vercel deployt + GitHub-Auto-Deploy verbunden. ✅
- [ ] **Supabase Auth URLs** auf Production-URL setzen (sonst Login online kaputt) — Dashboard-Schritt.
- [ ] Galerie/Listen aus Supabase laden (statt Platzhalter).
- [ ] Eigene Domain (z. B. yuno.\*) prüfen & in Vercel hinterlegen.

## 10. Deployment (Live)

- **Production:** https://yuno-liard.vercel.app
- **Vercel-Projekt:** `yuno` (Scope `belkisaslani-7904`), mit GitHub `BEKO2210/Yuno`
  verbunden → **jeder `git push` auf `main` deployt automatisch**.
- **Öffentliche Build-Env** liegt in `.env.production` (committet, NEXT_PUBLIC nur).
- **Manueller Schritt für Online-Login:** In Supabase → Authentication → URL
  Configuration: **Site URL** = `https://yuno-liard.vercel.app`, und unter
  **Redirect URLs** `https://yuno-liard.vercel.app/**` hinzufügen.

## 9. Supabase-Projekt (Live)

- **Projekt:** `yuno` · Region `eu-central-1` (Frankfurt) · Org „Belkis"
- **Project Ref / ID:** `tzwcnjvciykvusunxzzl`
- **API-URL:** `https://tzwcnjvciykvusunxzzl.supabase.co`
- **Tabellen:** `public.assets` (Wallpaper/Audio-Metadaten)
- **Storage-Buckets:** `wallpapers`, `audio` (public read via URL)
- **Schreibrechte:** nur Admin (E-Mail `belkis.aslani@gmail.com`) via
  `public.is_admin()` — siehe `supabase/schema.sql`.
- Keys liegen lokal in `.env.local` (nicht in Git). Für das Deployment müssen
  sie zusätzlich in den Vercel-Projekt-Einstellungen hinterlegt werden.

> **Admin-Login einrichten:** In Supabase unter **Authentication → Users** einen
> Nutzer mit deiner E-Mail anlegen (oder per Magic-Link einloggen, sobald das
> Login-Formular steht). Nur dieser Account darf hochladen.
