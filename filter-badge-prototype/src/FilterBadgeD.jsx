import React, { useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ *
 *  Option D — All names alphabetical, selected pinned to top, explicit Apply
 *
 *  Addresses feedback from the Slack thread (2026-06-30):
 *  - Brett: don't apply on every checkbox click — large customers can
 *    trigger a full data reload per click. Use an explicit Apply button.
 *  - Brett: a "recently selected floats to top" section gets confusing
 *    past ~20 picks — no visible line between "recent" and "the rest."
 *  - Casey: keep the full list (scroll or search), sort selected names
 *    alphabetically at the top and everyone else alphabetically below.
 *    Two predictably-sorted groups, no separate "recent" section needed.
 *  - Casey: while searching, add one person at a time and clear the
 *    search after each pick (Option B's flow) — but no checkboxes in
 *    search results, since search is "add," not "toggle."
 * ------------------------------------------------------------------ */

const PEOPLE = [
  { id: "maria", name: "Maria Chévario" },
  { id: "marjorie", name: "Marjorie Black" },
  { id: "martin", name: "Martin Brundle" },
  { id: "marcus", name: "Marcus Reed" },
  { id: "marina", name: "Marina Lopez" },
  { id: "brian", name: "Brian Smith" },
  { id: "catherine", name: "Catherine Lee" },
  { id: "aisha", name: "Aisha Khan" },
  { id: "tom", name: "Tom Becker" },
];

const SCOPES = [
  { key: "me", label: "Me" },
  { key: "dr", label: "My Direct Reports" },
  { key: "sub", label: "My Subordinates" },
];

const C = {
  badgeText: "#2C5C70",
  badgeBg: "#D9ECF5",
  badgeBgHover: "#CEE6F2",
  badgeBorder: "#C2DEEA",
  caret: "#5C93A7",
  check: "#3E5BF5",
  ink: "#2F3A5C",
  placeholder: "#9099AC",
  searchIcon: "#566179",
  border: "#E7EBF2",
  divider: "#E9ECF2",
  cardBorder: "#E8ECF3",
  boxBorder: "#D3D9E3",
  rowHover: "#F5F8FF",
};

function Svg({ size = 16, color = "currentColor", strokeWidth = 2, style, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" style={style} aria-hidden="true">
      {children}
    </svg>
  );
}
const ChevronDownIcon = (p) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
const CheckIcon = (p) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>;
const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>;
const XIcon = (p) => <Svg {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>;

function Box({ checked }) {
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 6,
      border: `1.5px solid ${checked ? C.check : C.boxBorder}`,
      background: checked ? C.check : "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flex: "0 0 auto", transition: "background .12s ease, border-color .12s ease",
    }}>
      {checked && <CheckIcon size={13} strokeWidth={3.5} color="#fff" />}
    </span>
  );
}

function Row({ checked, label, onClick }) {
  return (
    <button type="button" className="fbd-row" onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%",
      padding: "10px 8px", border: "none", background: "transparent",
      cursor: "pointer", textAlign: "left", font: "inherit",
      color: C.ink, fontSize: 15, fontWeight: 500,
    }}>
      <Box checked={checked} />
      <span style={{ lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

// Search results are "add" actions, not toggles — no checkbox.
function AddRow({ label, onClick }) {
  return (
    <button type="button" className="fbd-addrow" onClick={onClick} style={{
      display: "flex", alignItems: "center", width: "100%",
      padding: "10px 12px", border: "none",
      background: "transparent", cursor: "pointer", textAlign: "left",
      font: "inherit", color: C.ink, fontSize: 15, fontWeight: 500,
    }}>
      <span style={{ lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

const INITIAL_SCOPES = { me: true, dr: true, sub: true };
const INITIAL_SELECTED = PEOPLE.map((p) => p.id);

function scopesEqual(a, b) {
  return a.me === b.me && a.dr === b.dr && a.sub === b.sub;
}
function byName(a, b) {
  return a.name.localeCompare(b.name);
}

export default function FilterBadgeD() {
  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState(INITIAL_SCOPES);
  const [selected, setSelected] = useState(INITIAL_SELECTED);

  const [pendingScopes, setPendingScopes] = useState(INITIAL_SCOPES);
  const [pendingSelected, setPendingSelected] = useState(INITIAL_SELECTED);
  const [query, setQuery] = useState("");
  // Snapshot of which names were selected/pinned-to-top when the dropdown was
  // opened. Checking/unchecking while open updates pendingSelected (so the
  // checkbox responds instantly) but the row's position stays put until the
  // dropdown is closed and reopened, which re-snapshots from the applied state.
  const [orderSnapshot, setOrderSnapshot] = useState(INITIAL_SELECTED);

  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const pendingAnyone =
    pendingScopes.me && pendingScopes.dr && pendingScopes.sub &&
    PEOPLE.every((p) => pendingSelected.includes(p.id)) &&
    pendingSelected.length === PEOPLE.length;
  const pendingNothing =
    !pendingScopes.me && !pendingScopes.dr && !pendingScopes.sub &&
    pendingSelected.length === 0;

  const isDirty =
    !scopesEqual(pendingScopes, scopes) ||
    pendingSelected.length !== selected.length ||
    pendingSelected.some((id) => !selected.includes(id));

  function resetPending() {
    setPendingScopes(scopes);
    setPendingSelected(selected);
  }

  useEffect(() => {
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        resetPending();
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        resetPending();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [scopes, selected]);

  function openDropdown() {
    resetPending();
    setOrderSnapshot(selected);
    setQuery("");
    setOpen(true);
    setTimeout(() => searchRef.current && searchRef.current.focus(), 30);
  }

  function apply() {
    setScopes(pendingScopes);
    setSelected(pendingSelected);
    setOpen(false);
  }

  const name = (id) => (PEOPLE.find((p) => p.id === id) || {}).name || id;

  function badgeLabel() {
    const anyone = scopes.me && scopes.dr && scopes.sub && PEOPLE.every((p) => selected.includes(p.id));
    const nothing = !scopes.me && !scopes.dr && !scopes.sub && selected.length === 0;
    if (anyone) return "Anyone";
    if (nothing) return "None";
    const parts = [];
    SCOPES.forEach((s) => scopes[s.key] && parts.push(s.label));
    selected.forEach((id) => parts.push(name(id)));
    if (parts.length <= 2) return parts.join(", ");
    return `${parts[0]}, ${parts[1]} +${parts.length - 2}`;
  }

  function clickAnyone() {
    if (pendingAnyone) {
      setPendingScopes({ me: false, dr: false, sub: false });
      setPendingSelected([]);
    } else {
      setPendingScopes({ me: true, dr: true, sub: true });
      setPendingSelected(PEOPLE.map((p) => p.id));
    }
  }

  function toggleScope(key) {
    setPendingScopes((prev) => ({ ...prev, [key]: !prev[key] }));
    // Stepping out of "Anyone" via a scope — the specific names were only
    // selected as a byproduct of Anyone, not a real pick, so clear them.
    if (pendingAnyone) setPendingSelected([]);
  }

  function togglePerson(id) {
    setPendingSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function addPerson(id) {
    setPendingSelected((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
    searchRef.current && searchRef.current.focus();
  }

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  // Not filtered by selection state — otherwise searching while "Anyone" is
  // active (everyone already selected) would always come back empty.
  const searchResults = PEOPLE
    .filter((p) => p.name.toLowerCase().includes(q))
    .sort(byName);

  // Grouping (top vs. bottom) is fixed to orderSnapshot for the duration of
  // this open — only checked state (pendingSelected) updates live.
  const selectedPeople = PEOPLE.filter((p) => orderSnapshot.includes(p.id)).sort(byName);
  const unselectedPeople = PEOPLE.filter((p) => !orderSnapshot.includes(p.id)).sort(byName);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: 300 }}>
      <style>{`
        .fbd-panel { animation: fbdPop .14s cubic-bezier(.2,.8,.3,1); transform-origin: top left; }
        @keyframes fbdPop { from { opacity: 0; transform: translateY(-4px) scale(.985); } to { opacity: 1; transform: none; } }
        .fbd-row:hover { background: ${C.rowHover}; }
        .fbd-row:focus-visible { outline: 2px solid ${C.check}; outline-offset: -2px; border-radius: 6px; }
        .fbd-addrow:hover { background: ${C.rowHover}; }
        .fbd-addrow:focus-visible { outline: 2px solid ${C.check}; outline-offset: -2px; border-radius: 6px; }
        .fbd-badge:focus-visible { outline: 2px solid ${C.caret}; outline-offset: 2px; }
        .fbd-scroll::-webkit-scrollbar { width: 8px; }
        .fbd-scroll::-webkit-scrollbar-thumb { background: #D7DDE8; border-radius: 8px; }
        .fbd-search::placeholder { color: ${C.placeholder}; }
        .fbd-search:focus { border-color: ${C.check}; box-shadow: 0 0 0 3px rgba(62,91,245,.13); }
        .fbd-apply:disabled { background: #C7CCDA; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .fbd-panel { animation: none; } }
      `}</style>

      <button type="button" className="fbd-badge" onClick={() => (open ? (resetPending(), setOpen(false)) : openDropdown())} style={{
        display: "inline-flex", alignItems: "center", gap: 8, maxWidth: "100%",
        padding: "9px 16px", borderRadius: 999, border: `1px solid ${C.badgeBorder}`,
        cursor: "pointer", background: open ? C.badgeBgHover : C.badgeBg,
        color: C.badgeText, fontSize: 15, fontWeight: 700,
        letterSpacing: "-0.01em", transition: "background .12s ease",
      }}>
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Submitted By: {badgeLabel()}
        </span>
        <ChevronDownIcon size={17} strokeWidth={2.75} color={C.caret} style={{
          flex: "0 0 auto", transition: "transform .15s ease",
          transform: open ? "rotate(180deg)" : "none",
        }} />
      </button>

      {open && (
        <div className="fbd-panel" style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, width: 300,
          background: "#fff", border: `1px solid ${C.cardBorder}`, borderRadius: 12,
          boxShadow: "0 12px 32px rgba(28,42,74,.13), 0 3px 8px rgba(28,42,74,.05)",
          overflow: "hidden", zIndex: 10, display: "flex", flexDirection: "column",
          maxHeight: 420,
        }}>
          {/* Search */}
          <div style={{ padding: 8, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <SearchIcon size={15} color={C.searchIcon} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input ref={searchRef} className="fbd-search" value={query}
                onChange={(e) => setQuery(e.target.value)} placeholder="Search"
                style={{
                  width: "100%", height: 32, boxSizing: "border-box",
                  padding: "0 30px 0 34px", borderRadius: 6,
                  border: `1px solid ${C.border}`, fontSize: 14,
                  color: C.ink, outline: "none", font: "inherit", fontWeight: 500,
                }} />
              {query && (
                <button type="button" aria-label="Clear search"
                  onClick={() => { setQuery(""); searchRef.current && searchRef.current.focus(); }}
                  style={{
                    position: "absolute", right: 5, top: "50%",
                    transform: "translateY(-50%)", width: 22, height: 22,
                    border: "none", background: "transparent", cursor: "pointer",
                    display: "grid", placeItems: "center", color: C.searchIcon,
                  }}>
                  <XIcon size={15} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
          <div style={{ height: 1, background: C.divider, flexShrink: 0 }} />

          {/* Scrollable content */}
          <div className="fbd-scroll" style={{ overflowY: "auto", flex: 1, padding: "6px 0" }}>
            {searching ? (
              searchResults.length ? (
                searchResults.map((p) => (
                  <AddRow key={p.id} label={p.name} onClick={() => addPerson(p.id)} />
                ))
              ) : (
                <div style={{ padding: "12px 8px", fontSize: 14, color: C.placeholder }}>
                  No people match "{query}".
                </div>
              )
            ) : (
              <>
                <Row label="Anyone" checked={pendingAnyone} onClick={clickAnyone} />
                <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                {SCOPES.map((s) => (
                  <Row key={s.key} label={s.label}
                    checked={pendingScopes[s.key]} onClick={() => toggleScope(s.key)} />
                ))}
                <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                {selectedPeople.map((p) => (
                  <Row key={p.id} label={p.name}
                    checked={pendingSelected.includes(p.id)} onClick={() => togglePerson(p.id)} />
                ))}
                {selectedPeople.length > 0 && unselectedPeople.length > 0 && (
                  <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                )}
                {unselectedPeople.map((p) => (
                  <Row key={p.id} label={p.name}
                    checked={pendingSelected.includes(p.id)} onClick={() => togglePerson(p.id)} />
                ))}
              </>
            )}
          </div>

          {/* Apply footer — hidden while searching, disabled until dirty */}
          {!searching && (
            <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.divider}`, background: "#fff" }}>
              <button type="button" className="fbd-apply" onClick={apply} disabled={!isDirty} style={{
                width: "100%", padding: "10px 0", borderRadius: 8,
                border: "none", background: isDirty ? C.check : "#C7CCDA",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: isDirty ? "pointer" : "default", letterSpacing: "-0.01em",
              }}>
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
