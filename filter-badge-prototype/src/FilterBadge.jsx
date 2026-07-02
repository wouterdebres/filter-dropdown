import React, { useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ *
 *  Filter badge dropdown — "Submitted By"
 *
 *  Model
 *  -----
 *  • Standing scopes: Me / My Direct Reports / My Subordinates.
 *  • "Anyone" = everyone: all standing scopes on AND every name shown in
 *    the list selected too. It's derived, so checking all three (or
 *    clearing everything specific) snaps the badge back to "Anyone".
 *  • Clicking "Anyone" toggles: check → select the scopes plus every
 *    listed name; uncheck → clear the whole list.
 *  • Unchecking one scope drops just that scope (Anyone turns off).
 *  • Picking a brand-new person while in "Anyone" mode switches you to a
 *    specific selection (the standing scopes step aside). Picking a person
 *    while already specific just adds them — so you can have "Me, Maria".
 *  • People you've picked are remembered and stay in the list after you
 *    clear the search, so you can re-toggle them without searching again.
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
  pageBg: "#F3F6FB",
  badgeText: "#2C5C70", // dark teal
  badgeBg: "#D9ECF5", // pale cyan
  badgeBgHover: "#CEE6F2",
  badgeBorder: "#C2DEEA",
  caret: "#5C93A7", // teal caret
  check: "#3E5BF5", // vivid indigo-blue (checked)
  ink: "#2F3A5C", // navy labels
  placeholder: "#9099AC",
  searchIcon: "#566179",
  border: "#E7EBF2", // search field border
  divider: "#E9ECF2", // section dividers
  cardBorder: "#E8ECF3",
  boxBorder: "#D3D9E3", // unchecked box border
  rowHover: "#F5F8FF",
};

/* --- Inline icons (no external icon library) ---------------------- */
function Svg({ size = 16, color = "currentColor", strokeWidth = 2, style, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);
const XIcon = (p) => (
  <Svg {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
);
const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

function Box({ checked }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `1.5px solid ${checked ? C.check : C.boxBorder}`,
        background: checked ? C.check : "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        transition: "background .12s ease, border-color .12s ease",
      }}
    >
      {checked && <CheckIcon size={13} strokeWidth={3.5} color="#fff" />}
    </span>
  );
}

function Row({ checked, label, onClick }) {
  return (
    <button
      type="button"
      className="fb-row"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 8px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        font: "inherit",
        color: C.ink,
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      <Box checked={checked} />
      <span style={{ lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

export default function FilterBadge() {
  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState({ me: true, dr: true, sub: true });
  const [selected, setSelected] = useState(PEOPLE.map((p) => p.id));
  const [recents, setRecents] = useState([]);
  const [query, setQuery] = useState("");

  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const anyone =
    scopes.me && scopes.dr && scopes.sub &&
    PEOPLE.every((p) => selected.includes(p.id));
  const nothing =
    !scopes.me && !scopes.dr && !scopes.sub && selected.length === 0;

  useEffect(() => {
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current && searchRef.current.focus(), 30);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  useEffect(() => {
    const id = "fb-satoshi";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

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
    if (anyone) {
      setScopes({ me: false, dr: false, sub: false });
      setSelected([]);
      setRecents([]);
    } else {
      setScopes({ me: true, dr: true, sub: true });
      setSelected(PEOPLE.map((p) => p.id));
    }
  }

  function toggleScope(key) {
    setScopes((prev) => ({ ...prev, [key]: !prev[key] }));
    // Stepping out of "Anyone" via a scope — the specific names were only
    // selected as a byproduct of Anyone, not a real pick, so clear them
    // (surfacing them in recents so they can still be re-picked).
    if (anyone) {
      setRecents(PEOPLE.map((p) => p.id));
      setSelected([]);
    }
  }

  function togglePerson(id) {
    if (selected.includes(id)) {
      // Unchecking — if leaving anyone mode, surface all people in recents
      if (anyone) setRecents(PEOPLE.map((p) => p.id));
      setSelected(selected.filter((x) => x !== id));
      return;
    }
    setRecents((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSelected([...selected, id]);
  }

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const results = PEOPLE.filter((p) => p.name.toLowerCase().includes(q));
  const recentPeople = recents
    .map((id) => PEOPLE.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: 300 }}>
        {/* Badge */}
        <button
          type="button"
          className="fb-badge"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            maxWidth: "100%",
            padding: "9px 16px",
            borderRadius: 999,
            border: `1px solid ${C.badgeBorder}`,
            cursor: "pointer",
            background: open ? C.badgeBgHover : C.badgeBg,
            color: C.badgeText,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            transition: "background .12s ease",
          }}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Submitted By: {badgeLabel()}
          </span>
          <ChevronDownIcon
            size={17}
            strokeWidth={2.75}
            color={C.caret}
            style={{
              flex: "0 0 auto",
              transition: "transform .15s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="fb-panel"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              width: 300,
              background: "#fff",
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 12,
              boxShadow:
                "0 12px 32px rgba(28,42,74,.13), 0 3px 8px rgba(28,42,74,.05)",
              padding: 0,
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {/* Search */}
            <div style={{ padding: 8 }}>
              <div style={{ position: "relative" }}>
                <SearchIcon
                  size={15}
                  color={C.searchIcon}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={searchRef}
                  className="fb-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  style={{
                    width: "100%",
                    height: 32,
                    boxSizing: "border-box",
                    padding: "0 30px 0 34px",
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                    fontSize: 14,
                    lineHeight: "30px",
                    color: C.ink,
                    outline: "none",
                    font: "inherit",
                    fontWeight: 500,
                  }}
                />
                {searching && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      searchRef.current && searchRef.current.focus();
                    }}
                    aria-label="Clear search"
                    style={{
                      position: "absolute",
                      right: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      color: C.searchIcon,
                    }}
                  >
                    <XIcon size={15} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: C.divider }} />

            <div
              className="fb-scroll"
              style={{ maxHeight: 340, overflowY: "auto", padding: "6px 0 8px" }}
            >
              {searching ? (
                results.length ? (
                  results.map((p) => (
                    <Row
                      key={p.id}
                      label={p.name}
                      checked={selected.includes(p.id)}
                      onClick={() => togglePerson(p.id)}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      padding: "12px 8px",
                      fontSize: 14,
                      color: C.placeholder,
                    }}
                  >
                    No people match “{query}”.
                  </div>
                )
              ) : (
                <>
                  <Row label="Anyone" checked={anyone} onClick={clickAnyone} />
                  <div
                    style={{ height: 1, background: C.divider, margin: "7px 0" }}
                  />
                  {SCOPES.map((s) => (
                    <Row
                      key={s.key}
                      label={s.label}
                      checked={scopes[s.key]}
                      onClick={() => toggleScope(s.key)}
                    />
                  ))}
                  {recentPeople.length > 0 && (
                    <>
                      <div
                        style={{
                          height: 1,
                          background: C.divider,
                          margin: "7px 0",
                        }}
                      />
                      {recentPeople.map((p) => (
                        <Row
                          key={p.id}
                          label={p.name}
                          checked={selected.includes(p.id)}
                          onClick={() => togglePerson(p.id)}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
