import React from "react";
import FilterBadge from "./FilterBadge.jsx";
import FilterBadgeV2 from "./FilterBadgeV2.jsx";

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
      <Option
        number="A"
        title="Search to add"
        bullets={[
          "Defaults to Me, My Direct Reports, and My Subordinates, all selected",
          "Search to find and add a specific person to your filter",
          "Once added, a person stays visible in the list without searching again",
          "Selections apply instantly, no confirm step needed",
        ]}
      >
        <FilterBadge />
      </Option>

      <Option
        number="B"
        title="All names visible, confirm with Apply"
        bullets={[
          "All names are visible immediately. Scroll or search to find someone.",
          "Selecting a name clears the search and keeps you in the list",
          "Recently selected people move to the top the next time you open the dropdown",
          "Changes only apply when you click Apply. Closing without it discards them.",
        ]}
      >
        <FilterBadgeV2 />
      </Option>
    </div>
  );
}
