import React, { useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ *
 *  Option F — Option B's search-and-jump-back flow, with an explicit
 *  Apply button instead of instant apply.
 *
 *  Same model as B:
 *  - Search results keep checkboxes (toggle either way), unlike D/E.
 *  - Picking or removing a person clears the search and jumps back to
 *    the default view; people you've touched are remembered in
 *    "recents" (in the order you touched them) so you can re-toggle
 *    them without searching again.
 *  - Anyone is a true select-all: checking it selects the scopes plus
 *    every listed name; unchecking it clears the whole list.
 *
 *  What's different from B: nothing applies until you click Apply.
 *  Opening the dropdown, checking/unchecking boxes, and searching all
 *  edit a pending draft; closing without applying discards it.
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
    <button type="button" className="fbf-row" onClick={onClick} style={{
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

// Recent rows can be checked/unchecked. Unchecked ones can be dismissed
// from the Recent list entirely via an always-visible X — they're still
// findable through search afterward. Checked (active) people can't be
// dismissed this way — uncheck first, then remove.
function RecentRow({ checked, label, onToggle, onDismiss }) {
  return (
    <div className="fbf-recentrow" style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%",
      padding: "10px 8px", borderRadius: 6, cursor: "pointer",
    }}>
      <button type="button" onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0,
        border: "none", background: "transparent", cursor: "pointer",
        textAlign: "left", font: "inherit", color: C.ink, fontSize: 15,
        fontWeight: 500, padding: 0,
      }}>
        <Box checked={checked} />
        <span style={{ lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      </button>
      {!checked && (
        <button type="button" className="fbf-dismiss" aria-label={`Remove ${label} from recent`}
          onClick={onDismiss} style={{
            flex: "0 0 auto", width: 22, height: 22, borderRadius: 6,
            border: "none", background: "transparent", cursor: "pointer",
            display: "grid", placeItems: "center", color: C.placeholder,
          }}>
          <XIcon size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

const INITIAL_SCOPES = { me: true, dr: true, sub: true };
const INITIAL_SELECTED = PEOPLE.map((p) => p.id);
const INITIAL_RECENTS = [];

function scopesEqual(a, b) {
  return a.me === b.me && a.dr === b.dr && a.sub === b.sub;
}
function sameSet(a, b) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export default function FilterBadgeF() {
  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState(INITIAL_SCOPES);
  const [selected, setSelected] = useState(INITIAL_SELECTED);
  const [recents, setRecents] = useState(INITIAL_RECENTS);

  const [pendingScopes, setPendingScopes] = useState(INITIAL_SCOPES);
  const [pendingSelected, setPendingSelected] = useState(INITIAL_SELECTED);
  const [pendingRecents, setPendingRecents] = useState(INITIAL_RECENTS);
  const [query, setQuery] = useState("");

  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const anyone =
    scopes.me && scopes.dr && scopes.sub &&
    PEOPLE.every((p) => selected.includes(p.id));
  const nothing =
    !scopes.me && !scopes.dr && !scopes.sub && selected.length === 0;

  const pendingAnyone =
    pendingScopes.me && pendingScopes.dr && pendingScopes.sub &&
    PEOPLE.every((p) => pendingSelected.includes(p.id));

  const isDirty =
    !scopesEqual(pendingScopes, scopes) ||
    !sameSet(pendingSelected, selected) ||
    !sameSet(pendingRecents, recents);

  function resetPending() {
    setPendingScopes(scopes);
    setPendingSelected(selected);
    setPendingRecents(recents);
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
  }, [scopes, selected, recents]);

  function openDropdown() {
    resetPending();
    setQuery("");
    setOpen(true);
    setTimeout(() => searchRef.current && searchRef.current.focus(), 30);
  }

  function apply() {
    setScopes(pendingScopes);
    setSelected(pendingSelected);
    setRecents(pendingRecents);
    setOpen(false);
  }

  const name = (id) => (PEOPLE.find((p) => p.id === id) || {}).name || id;

  function badgeLabel() {
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
      setPendingRecents([]);
    } else {
      setPendingScopes({ me: true, dr: true, sub: true });
      setPendingSelected(PEOPLE.map((p) => p.id));
    }
  }

  function toggleScope(key) {
    setPendingScopes((prev) => ({ ...prev, [key]: !prev[key] }));
    // Stepping out of "Anyone" via a scope — everyone was only "selected"
    // as a byproduct of Anyone, not a real pick, so drop them. Exception:
    // anyone already sitting in Recent is a real, visible pick and should
    // stay checked. Don't flood Recent with the rest of the roster.
    if (pendingAnyone) {
      setPendingSelected((prev) => prev.filter((id) => pendingRecents.includes(id)));
    }
  }

  function togglePerson(id) {
    if (pendingSelected.includes(id)) {
      if (pendingAnyone) setPendingRecents(PEOPLE.map((p) => p.id));
      setPendingSelected((prev) => prev.filter((x) => x !== id));
      setQuery("");
      searchRef.current && searchRef.current.focus();
      return;
    }
    setPendingRecents((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setPendingSelected((prev) => [...prev, id]);
    setQuery("");
    searchRef.current && searchRef.current.focus();
  }

  function dismissFromRecent(id) {
    setPendingRecents((prev) => prev.filter((x) => x !== id));
  }

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const results = PEOPLE.filter((p) => p.name.toLowerCase().includes(q));
  const recentPeople = pendingRecents
    .map((id) => PEOPLE.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: 300 }}>
      <style>{`
        .fbf-panel { animation: fbfPop .14s cubic-bezier(.2,.8,.3,1); transform-origin: top left; }
        @keyframes fbfPop { from { opacity: 0; transform: translateY(-4px) scale(.985); } to { opacity: 1; transform: none; } }
        .fbf-row:hover { background: ${C.rowHover}; }
        .fbf-row:focus-visible { outline: 2px solid ${C.check}; outline-offset: -2px; border-radius: 6px; }
        .fbf-badge:focus-visible { outline: 2px solid ${C.caret}; outline-offset: 2px; }
        .fbf-scroll::-webkit-scrollbar { width: 8px; }
        .fbf-scroll::-webkit-scrollbar-thumb { background: #D7DDE8; border-radius: 8px; }
        .fbf-search::placeholder { color: ${C.placeholder}; }
        .fbf-search:focus { border-color: ${C.check}; box-shadow: 0 0 0 3px rgba(62,91,245,.13); }
        .fbf-apply:disabled { background: #C7CCDA; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .fbf-panel { animation: none; } }
      `}</style>

      <button type="button" className="fbf-badge" onClick={() => (open ? (resetPending(), setOpen(false)) : openDropdown())} style={{
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
        <div className="fbf-panel" style={{
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
              <input ref={searchRef} className="fbf-search" value={query}
                onChange={(e) => setQuery(e.target.value)} placeholder="Search"
                style={{
                  width: "100%", height: 32, boxSizing: "border-box",
                  padding: "0 30px 0 34px", borderRadius: 6,
                  border: `1px solid ${C.border}`, fontSize: 14,
                  color: C.ink, outline: "none", font: "inherit", fontWeight: 500,
                }} />
              {searching && (
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
          <div className="fbf-scroll" style={{ overflowY: "auto", flex: 1, padding: "6px 0" }}>
            {searching ? (
              results.length ? (
                results.map((p) => (
                  <Row key={p.id} label={p.name}
                    checked={pendingSelected.includes(p.id)}
                    onClick={() => togglePerson(p.id)} />
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
                {recentPeople.length > 0 && (
                  <>
                    <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                    {recentPeople.map((p) => (
                      <RecentRow key={p.id} label={p.name}
                        checked={pendingSelected.includes(p.id)}
                        onToggle={() => togglePerson(p.id)}
                        onDismiss={() => dismissFromRecent(p.id)} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Apply footer — hidden while searching, disabled until dirty */}
          {!searching && (
            <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.divider}`, background: "#fff" }}>
              <button type="button" className="fbf-apply" onClick={apply} disabled={!isDirty} style={{
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
