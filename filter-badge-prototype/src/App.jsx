import React from "react";
import FilterBadge from "./FilterBadge.jsx";
import FilterBadgeB from "./FilterBadgeB.jsx";
import FilterBadgeV2 from "./FilterBadgeV2.jsx";
import FilterBadgeD from "./FilterBadgeD.jsx";
import FilterBadgeE from "./FilterBadgeE.jsx";
import FilterBadgeF from "./FilterBadgeF.jsx";
import FilterBadgeG from "./FilterBadgeG.jsx";

const C = {
  pageBg: "#F3F6FB",
  ink: "#2F3A5C",
  muted: "#6B7A99",
  divider: "#DDE3EE",
};

function Option({ number, title, bullets, children }) {
  return (
    <div style={{
      background: "rgba(12,12,12,0.04)",
      borderRadius: 12,
      padding: 40,
      display: "flex", alignItems: "flex-start", gap: 40,
    }}>
      {/* Left: description */}
      <div style={{ flex: "0 0 320px" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: C.muted, marginBottom: 8,
        }}>
          Option {number}
        </div>
        <div style={{
          fontSize: 18, fontWeight: 700, color: C.ink,
          letterSpacing: "-0.02em", marginBottom: 10,
        }}>
          {title}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "baseline", gap: 8,
              fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 4,
            }}>
              <span style={{ color: C.muted, fontSize: 16, lineHeight: 1 }}>·</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: dropdown */}
      <div style={{ flexShrink: 0, paddingTop: 4 }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.pageBg,
      fontFamily: '"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 40,
      display: "flex", flexDirection: "column", gap: 40,
    }}>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{
          margin: 0, fontSize: 28, fontWeight: 900, color: C.ink,
          letterSpacing: "-0.03em",
        }}>
          Filter badge dropdown
        </h1>
        <p style={{
          margin: "10px 0 0", fontSize: 13, color: C.muted, lineHeight: 1.6,
          padding: "10px 14px", background: "rgba(245,180,0,0.1)",
          border: "1px solid rgba(245,180,0,0.3)", borderRadius: 8,
          display: "inline-block",
        }}>
          Note: the visual design in this prototype does not match our Kiln 2 styling. This page is about exploring the logic and functionality, not the final look and feel.
        </p>
      </div>

      <Option
        number="G"
        title="Like C, but search starts fresh from Anyone"
        bullets={[
          "Based on C: full list always visible, requires Apply",
          "Search results are a plain list, no checkboxes",
          "With Anyone active, picking someone from search starts a new query: everyone deselects and only that person stays",
          "A picked person jumps to the top of the list, checked — no need to reopen first (unlike C)",
          "Me / Direct Reports / Subordinates behave exactly as in C",
        ]}
      >
        <FilterBadgeG />
      </Option>

      <Option
        number="F"
        title="Search to add, jump back on select, confirm with Apply"
        bullets={[
          "Same search/recent mechanics as B: checkboxes in search, Recent ordered by when you touched each person (not alphabetical, unlike E)",
          "Unlike E, you can check or uncheck people right from search — no need to visit Recent to remove someone",
          "The one change from B: requires Apply",
        ]}
      >
        <FilterBadgeF />
      </Option>

      <Option
        number="E"
        title="Compact recent list, dismiss with X"
        bullets={[
          "Unlike C/D, there's no full list — just Anyone, the 3 scopes, and a short alphabetical \"Recent\" list",
          "Search only adds (no checkboxes); to drop someone you dismiss them from Recent with an X, not from search",
          "Requires Apply",
        ]}
      >
        <FilterBadgeE />
      </Option>

      <Option
        number="D"
        title="All names, alphabetical, pinned selected"
        bullets={[
          "Like C, full list always visible — but strictly alphabetical, not recency-based",
          "Selected names pin to the top (A–Z) instead of floating around; order holds steady while open",
          "Requires Apply, like C",
        ]}
      >
        <FilterBadgeD />
      </Option>

      <Option
        number="C"
        title="All names visible, confirm with Apply"
        bullets={[
          "Unlike A/B, the full name list is always visible, not just via search",
          "Recently picked names float to the top the next time you open it",
          "First option to require Apply — nothing applies until you click it",
        ]}
      >
        <FilterBadgeV2 />
      </Option>

      <Option
        number="B"
        title="Search to add, jump back on select"
        bullets={[
          "Same as A, but picking someone clears the search and jumps back to the default view instead of staying in the results",
          "Applies instantly, no confirm step",
        ]}
      >
        <FilterBadgeB />
      </Option>

      <Option
        number="A"
        title="Search to add"
        bullets={[
          "Search adds a person; Me / Direct Reports / Subordinates start fully checked",
          "Applies instantly, no confirm step",
        ]}
      >
        <FilterBadge />
      </Option>

      <div style={{ height: 600, display: "flex", alignItems: "flex-end", paddingBottom: 40 }}>
        <p style={{ margin: 0, fontSize: 12, color: C.muted, opacity: 0.6 }}>
          These prototypes are created by Wouter & Claude. Even though they are good friends, if you find a mistake it is entirely Claude's fault.
        </p>
      </div>
    </div>
  );
}
