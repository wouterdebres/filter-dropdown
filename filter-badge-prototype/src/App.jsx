import React from "react";
import FilterBadge from "./FilterBadge.jsx";
import FilterBadgeB from "./FilterBadgeB.jsx";
import FilterBadgeV2 from "./FilterBadgeV2.jsx";
import FilterBadgeD from "./FilterBadgeD.jsx";
import FilterBadgeE from "./FilterBadgeE.jsx";
import FilterBadgeF from "./FilterBadgeF.jsx";

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
        number="A"
        title="Search to add"
        bullets={[
          "Defaults to Me, Direct Reports, and Subordinates, all selected",
          "Search to find and add a specific person",
          "Added people stay in the list, no need to search again",
          "Applies instantly — no confirm step",
        ]}
      >
        <FilterBadge />
      </Option>

      <Option
        number="B"
        title="Search to add, jump back on select"
        bullets={[
          "Same as A, but picking a person clears the search and returns to the default view",
          "People you've picked stay listed so you can re-toggle them without searching again",
          "Applies instantly — no confirm step",
        ]}
      >
        <FilterBadgeB />
      </Option>

      <Option
        number="C"
        title="All names visible, confirm with Apply"
        bullets={[
          "Full list always visible — scroll or search to find someone",
          "Picking a name clears the search but keeps the list open",
          "Recently selected people float to the top next time you open it",
          "Nothing applies until you click Apply",
        ]}
      >
        <FilterBadgeV2 />
      </Option>

      <Option
        number="D"
        title="All names, alphabetical, pinned selected"
        bullets={[
          "Full list always visible — scroll or search to find someone",
          "Selected names pin to the top (A–Z), everyone else sits below (A–Z) — order never shuffles while open",
          "Search is add-only (no checkboxes); picking someone clears the search",
          "Nothing applies until you click Apply",
        ]}
      >
        <FilterBadgeD />
      </Option>

      <Option
        number="E"
        title="Compact recent list, dismiss with X"
        bullets={[
          "No full roster — just Anyone, the 3 scopes, and a \"Recent\" list (A–Z, not by recency)",
          "Search is add-only; picking someone adds them to Recent and clears the search",
          "Unchecked names in Recent show an X to remove them for good — checked ones can't be removed until unchecked",
          "Nothing applies until you click Apply",
        ]}
      >
        <FilterBadgeE />
      </Option>

      <Option
        number="F"
        title="Search to add, jump back on select, confirm with Apply"
        bullets={[
          "Same flow as B — search keeps checkboxes, picking clears the search and returns to the default view",
          "Touched people stay in \"Recently selected\" so you can re-toggle without searching again",
          "Unchecked names in Recent show an X to remove them for good — checked ones can't be removed until unchecked",
          "Nothing applies until you click Apply",
        ]}
      >
        <FilterBadgeF />
      </Option>

      <div style={{ height: 600, display: "flex", alignItems: "flex-end", paddingBottom: 40 }}>
        <p style={{ margin: 0, fontSize: 12, color: C.muted, opacity: 0.6 }}>
          These prototypes are created by Wouter & Claude. Even though they are good friends, if you find a mistake it is entirely Claude's fault.
        </p>
      </div>
    </div>
  );
}
