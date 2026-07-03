import React, { useState, useRef, useEffect } from "react";

// 134 people, at least one per letter of the alphabet.
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
  { id: "adam", name: "Adam Fisher" },
  { id: "alina", name: "Alina Petrova" },
  { id: "amir", name: "Amir Nasser" },
  { id: "anya", name: "Anya Volkov" },
  { id: "arthur", name: "Arthur Bell" },
  { id: "bianca", name: "Bianca Ortiz" },
  { id: "benjamin", name: "Benjamin Cole" },
  { id: "bruno", name: "Bruno Silva" },
  { id: "bella", name: "Bella Hart" },
  { id: "boris", name: "Boris Ivanov" },
  { id: "carlos", name: "Carlos Mendez" },
  { id: "chloe", name: "Chloe Dupont" },
  { id: "caleb", name: "Caleb Young" },
  { id: "camille", name: "Camille Laurent" },
  { id: "cyrus", name: "Cyrus Bahrami" },
  { id: "daniel", name: "Daniel Kim" },
  { id: "dana", name: "Dana Whitfield" },
  { id: "diego", name: "Diego Torres" },
  { id: "daisy", name: "Daisy Wren" },
  { id: "dmitri", name: "Dmitri Sokolov" },
  { id: "elena", name: "Elena Rossi" },
  { id: "ethan", name: "Ethan Brooks" },
  { id: "emil", name: "Emil Karlsson" },
  { id: "esther", name: "Esther Cohen" },
  { id: "ezra", name: "Ezra Lindqvist" },
  { id: "farah", name: "Farah Haddad" },
  { id: "felix", name: "Felix Grant" },
  { id: "fiona", name: "Fiona MacLeod" },
  { id: "franco", name: "Franco Rinaldi" },
  { id: "freya", name: "Freya Solberg" },
  { id: "grace", name: "Grace Osei" },
  { id: "gabriel", name: "Gabriel Novak" },
  { id: "greta", name: "Greta Voss" },
  { id: "gustavo", name: "Gustavo Pinto" },
  { id: "giselle", name: "Giselle Moreau" },
  { id: "hannah", name: "Hannah Byrne" },
  { id: "hassan", name: "Hassan Ali" },
  { id: "helena", name: "Helena Dvorak" },
  { id: "hugo", name: "Hugo Estrada" },
  { id: "hazel", name: "Hazel Whitmore" },
  { id: "isabel", name: "Isabel Duarte" },
  { id: "ivan", name: "Ivan Petrenko" },
  { id: "ingrid", name: "Ingrid Halvorsen" },
  { id: "idris", name: "Idris Bakare" },
  { id: "iris", name: "Iris Chapman" },
  { id: "jasmine", name: "Jasmine Wong" },
  { id: "jorge", name: "Jorge Ramirez" },
  { id: "julia", name: "Julia Renner" },
  { id: "jonas", name: "Jonas Berg" },
  { id: "jade", name: "Jade Okafor" },
  { id: "karim", name: "Karim Farouk" },
  { id: "kaitlyn", name: "Kaitlyn Moss" },
  { id: "klaus", name: "Klaus Richter" },
  { id: "keiko", name: "Keiko Sato" },
  { id: "kwame", name: "Kwame Boateng" },
  { id: "liam", name: "Liam Sullivan" },
  { id: "lucia", name: "Lucia Fernandez" },
  { id: "leah", name: "Leah Sorensen" },
  { id: "leo", name: "Leo Marchetti" },
  { id: "lena", name: "Lena Hoffmann" },
  { id: "mateo", name: "Mateo Alvarez" },
  { id: "nina", name: "Nina Kowalski" },
  { id: "noah", name: "Noah Bennett" },
  { id: "nadia", name: "Nadia Younes" },
  { id: "nolan", name: "Nolan Shaw" },
  { id: "naomi", name: "Naomi Adeyemi" },
  { id: "omar", name: "Omar Siddiqui" },
  { id: "olivia", name: "Olivia Turner" },
  { id: "oscar", name: "Oscar Lindgren" },
  { id: "odette", name: "Odette Girard" },
  { id: "otto", name: "Otto Krueger" },
  { id: "priya", name: "Priya Nair" },
  { id: "patrick", name: "Patrick Doyle" },
  { id: "paloma", name: "Paloma Reyes" },
  { id: "peter", name: "Peter Lindholm" },
  { id: "petra", name: "Petra Vogel" },
  { id: "quentin", name: "Quentin Blake" },
  { id: "quinn", name: "Quinn Alvarado" },
  { id: "qadir", name: "Qadir Hussain" },
  { id: "queenie", name: "Queenie Fontaine" },
  { id: "quimby", name: "Quimby Larsen" },
  { id: "rachel", name: "Rachel Donovan" },
  { id: "ravi", name: "Ravi Chandran" },
  { id: "renata", name: "Renata Kowalczyk" },
  { id: "rory", name: "Rory Fitzgerald" },
  { id: "rosalind", name: "Rosalind Achebe" },
  { id: "sofia", name: "Sofia Bianchi" },
  { id: "samuel", name: "Samuel Otieno" },
  { id: "selin", name: "Selin Aydin" },
  { id: "stefan", name: "Stefan Wozniak" },
  { id: "sunita", name: "Sunita Rao" },
  { id: "talia", name: "Talia Meyer" },
  { id: "theo", name: "Theo Andersson" },
  { id: "tatiana", name: "Tatiana Volkova" },
  { id: "tariq", name: "Tariq Aziz" },
  { id: "uma", name: "Uma Devi" },
  { id: "ulric", name: "Ulric Bergman" },
  { id: "ursula", name: "Ursula Fischer" },
  { id: "uriel", name: "Uriel Santos" },
  { id: "unathi", name: "Unathi Mokoena" },
  { id: "victor", name: "Victor Castillo" },
  { id: "valeria", name: "Valeria Costa" },
  { id: "vera", name: "Vera Novikova" },
  { id: "vince", name: "Vince Romano" },
  { id: "violeta", name: "Violeta Marin" },
  { id: "wei", name: "Wei Chen" },
  { id: "willa", name: "Willa Fields" },
  { id: "winston", name: "Winston Clarke" },
  { id: "wren", name: "Wren Delgado" },
  { id: "walid", name: "Walid Kassem" },
  { id: "xiomara", name: "Xiomara Vega" },
  { id: "xavier", name: "Xavier Lund" },
  { id: "xiu", name: "Xiu Zhang" },
  { id: "ximena", name: "Ximena Ortega" },
  { id: "xander", name: "Xander Brandt" },
  { id: "yusuf", name: "Yusuf Demir" },
  { id: "yara", name: "Yara Salim" },
  { id: "yuki", name: "Yuki Tanaka" },
  { id: "yosef", name: "Yosef Katz" },
  { id: "yvonne", name: "Yvonne Dubois" },
  { id: "zoe", name: "Zoe Harrington" },
  { id: "zachary", name: "Zachary Whitman" },
  { id: "zara", name: "Zara Malik" },
  { id: "ziad", name: "Ziad Farah" },
  { id: "zola", name: "Zola Ndlovu" },
];

// Org mapping: 10 people report directly to you; "My Subordinates" is the
// broader org under you, so it includes those same 10 plus 20 more —
// checking it should surface all 30 as selected.
const DIRECT_REPORT_IDS = [
  "maria", "brian", "catherine", "daniel", "elena",
  "farah", "grace", "hannah", "isabel", "jasmine",
];
const SUBORDINATE_ONLY_IDS = [
  "karim", "liam", "mateo", "nina", "omar",
  "priya", "quentin", "rachel", "sofia", "talia",
  "uma", "victor", "wei", "xiomara", "yusuf",
  "zoe", "adam", "bianca", "carlos", "diego",
];
const SUBORDINATE_IDS = [...DIRECT_REPORT_IDS, ...SUBORDINATE_ONLY_IDS];

function scopeDerivedIds(scopes) {
  const ids = new Set();
  if (scopes.dr) DIRECT_REPORT_IDS.forEach((id) => ids.add(id));
  if (scopes.sub) SUBORDINATE_IDS.forEach((id) => ids.add(id));
  return ids;
}

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

function Row({ checked, label, onClick, plain }) {
  return (
    <button type="button" className={plain ? "fbg-row fbg-row-plain" : "fbg-row"} onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%",
      padding: "10px 8px", border: "none", background: "transparent",
      cursor: "pointer", textAlign: "left", font: "inherit",
      color: C.ink, fontSize: 15, fontWeight: 500,
    }}>
      {!plain && <Box checked={checked} />}
      <span style={{ lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

const INITIAL_SCOPES = { me: true, dr: true, sub: true };
const INITIAL_SELECTED = PEOPLE.map((p) => p.id);

function scopesEqual(a, b) {
  return a.me === b.me && a.dr === b.dr && a.sub === b.sub;
}

export default function FilterBadgeG() {
  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState(INITIAL_SCOPES);
  const [selected, setSelected] = useState(INITIAL_SELECTED);
  const [recents, setRecents] = useState([]);

  // Pending state (what's shown in the open dropdown, not yet applied)
  const [pendingScopes, setPendingScopes] = useState(INITIAL_SCOPES);
  const [pendingSelected, setPendingSelected] = useState(INITIAL_SELECTED);
  const [pendingRecents, setPendingRecents] = useState([]);
  const [query, setQuery] = useState("");

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

  useEffect(() => {
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setPendingScopes(scopes);
        setPendingSelected(selected);
        setPendingRecents(recents);
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setPendingScopes(scopes);
        setPendingSelected(selected);
        setPendingRecents(recents);
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

  // Sync pending to committed when opening
  function openDropdown() {
    setPendingScopes(scopes);
    setPendingSelected(selected);
    setPendingRecents(recents);
    setQuery("");
    setOpen(true);
    setTimeout(() => searchRef.current && searchRef.current.focus(), 30);
  }

  function apply() {
    setScopes(pendingScopes);
    setSelected(pendingSelected);
    // Add newly selected people to the front of recents, preserve existing order
    setRecents((prev) => {
      const newlyAdded = pendingSelected.filter((id) => !prev.includes(id));
      return [...newlyAdded, ...prev];
    });
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
    const nextScopes = { ...pendingScopes, [key]: !pendingScopes[key] };
    setPendingScopes(nextScopes);

    if (pendingAnyone) {
      // Stepping out of full "Anyone" — collapse everyone down to just
      // what the remaining scopes (Direct Reports / Subordinates) and
      // Recent still cover, instead of leaving every name phantom-checked.
      const covered = scopeDerivedIds(nextScopes);
      setPendingSelected((prev) =>
        prev.filter((id) => covered.has(id) || pendingRecents.includes(id))
      );
      return;
    }

    if (key === "dr" || key === "sub") {
      // Direct Reports and Subordinates overlap (subordinates includes
      // direct reports) — recompute from old vs. new coverage so toggling
      // one doesn't drop names still covered by the other.
      const oldIds = scopeDerivedIds(pendingScopes);
      const newIds = scopeDerivedIds(nextScopes);
      setPendingSelected((prev) => {
        const kept = prev.filter((id) => !oldIds.has(id) || newIds.has(id));
        const toAdd = [...newIds].filter((id) => !kept.includes(id));
        return [...kept, ...toAdd];
      });
    }
  }

  function togglePerson(id) {
    const isRemoving = pendingSelected.includes(id);
    setPendingSelected((prev) =>
      isRemoving ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (!isRemoving) {
      setQuery("");
      searchRef.current && searchRef.current.focus();
    }
  }

  function pickFromSearch(id) {
    // With "Anyone" active, a search pick starts a fresh query: drop
    // everyone (scopes included) and select only the picked person.
    if (pendingAnyone) {
      setPendingScopes({ me: false, dr: false, sub: false });
      setPendingSelected([id]);
      setPendingRecents((prev) => [id, ...prev.filter((x) => x !== id)]);
      setQuery("");
      searchRef.current && searchRef.current.focus();
      return;
    }
    const isAdding = !pendingSelected.includes(id);
    togglePerson(id);
    // Float the picked person to the top of the list right away, so they
    // sit checked up top once the search clears back to the normal view.
    if (isAdding) {
      setPendingRecents((prev) => [id, ...prev.filter((x) => x !== id)]);
    }
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", width: 300 }}>
      <style>{`
        .fbg-panel { animation: fbgPop .14s cubic-bezier(.2,.8,.3,1); transform-origin: top left; }
        @keyframes fbgPop { from { opacity: 0; transform: translateY(-4px) scale(.985); } to { opacity: 1; transform: none; } }
        .fbg-row:hover { background: ${C.rowHover}; }
        .fbg-row-plain:hover { background: rgba(0,0,0,0.04); }
        .fbg-row:focus-visible { outline: 2px solid ${C.check}; outline-offset: -2px; border-radius: 6px; }
        .fbg-badge:focus-visible { outline: 2px solid ${C.caret}; outline-offset: 2px; }
        .fbg-scroll::-webkit-scrollbar { width: 8px; }
        .fbg-scroll::-webkit-scrollbar-thumb { background: #D7DDE8; border-radius: 8px; }
        .fbg-search::placeholder { color: ${C.placeholder}; }
        .fbg-search:focus { border-color: ${C.check}; box-shadow: 0 0 0 3px rgba(62,91,245,.13); }
        .fbg-apply:disabled { background: #C7CCDA; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .fbg-panel { animation: none; } }
      `}</style>

      <button type="button" className="fbg-badge" onClick={() => open ? (() => { setPendingScopes(scopes); setPendingSelected(selected); setOpen(false); })() : openDropdown()} style={{
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
        <div className="fbg-panel" style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, width: 300,
          background: "#fff", border: `1px solid ${C.cardBorder}`, borderRadius: 12,
          boxShadow: "0 12px 32px rgba(28,42,74,.13), 0 3px 8px rgba(28,42,74,.05)",
          overflow: "hidden", zIndex: 10, display: "flex", flexDirection: "column",
          maxHeight: 400,
        }}>
          {/* Search */}
          <div style={{ padding: 8, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <SearchIcon size={15} color={C.searchIcon} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input ref={searchRef} className="fbg-search" value={query}
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
          <div className="fbg-scroll" style={{ overflowY: "auto", flex: 1, padding: "6px 0" }}>
            {(() => {
              const q = query.trim().toLowerCase();
              const filteredPeople = PEOPLE.filter((p) => p.name.toLowerCase().includes(q));
              if (q) {
                return filteredPeople.length ? filteredPeople.map((p) => (
                  <Row key={p.id} label={p.name} plain
                    onClick={() => pickFromSearch(p.id)} />
                )) : (
                  <div style={{ padding: "12px 8px", fontSize: 14, color: C.placeholder }}>
                    No people match "{query}".
                  </div>
                );
              }
              const recentPeople = pendingRecents
                .map((id) => PEOPLE.find((p) => p.id === id))
                .filter(Boolean);
              const restPeople = PEOPLE.filter((p) => !pendingRecents.includes(p.id));
              return (
                <>
                  <Row label="Anyone" checked={pendingAnyone} onClick={clickAnyone} />
                  <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                  {SCOPES.map((s) => (
                    <Row key={s.key} label={s.label}
                      checked={pendingScopes[s.key]} onClick={() => toggleScope(s.key)} />
                  ))}
                  <div style={{ height: 1, background: C.divider, margin: "7px 0" }} />
                  {recentPeople.map((p) => (
                    <Row key={p.id} label={p.name}
                      checked={pendingSelected.includes(p.id)}
                      onClick={() => togglePerson(p.id)} />
                  ))}
                  {restPeople.map((p) => (
                    <Row key={p.id} label={p.name}
                      checked={pendingSelected.includes(p.id)}
                      onClick={() => togglePerson(p.id)} />
                  ))}
                </>
              );
            })()}
          </div>

          {/* Apply footer — always visible, disabled until dirty */}
          <div style={{
            padding: "10px 10px",
            borderTop: `1px solid ${C.divider}`,
            background: "#fff",
          }}>
            <button type="button" className="fbg-apply" onClick={apply} disabled={!isDirty} style={{
              width: "100%", height: 32, boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border: "none", background: isDirty ? C.check : "#C7CCDA",
              color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: isDirty ? "pointer" : "default", letterSpacing: "-0.01em",
            }}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
