# Submitted By — filter badge prototype

An interactive filter-badge dropdown. A pill badge opens a searchable list with
an **Anyone** select-all, three standing scopes (Me / My Direct Reports /
My Subordinates), and searchable people that stick around once you've picked them.

## Two ways to run it

### 1. Just open it (no install)
Double-click **`standalone.html`** to open it in your browser. It pulls React and
Babel from a CDN, so you need an internet connection the first time.

### 2. Dev server (recommended for editing)
Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To make a production build:

```bash
npm run build
npm run preview
```

## Where things live
- `src/FilterBadge.jsx` — the component (all logic + styling). This is the file to edit.
- `src/main.jsx` — mounts the component.
- `standalone.html` — self-contained copy for instant preview.

## Behavior notes
- **Anyone** is a true select-all: checking it selects the scopes plus every listed
  name; unchecking it clears the whole list (the badge then reads "None").
- Unchecking a single row drops just that one and "Anyone" turns off.
- Picking a brand-new searched person switches from "Anyone" to that specific person;
  picking more while already specific just adds them (e.g. "Me, Maria Chévario").
- Names you pick are remembered and stay in the list after you clear the search.

## Notes
- The typeface is **Satoshi**, loaded from Fontshare; it falls back to the system
  sans-serif if the font can't load.
- Colors and spacing are defined in the `C` token object at the top of `FilterBadge.jsx`.
