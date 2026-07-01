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
      {/* Left: option number */}
      <div style={{ flex: "0 0 auto", paddingTop: 2 }}>
        <div style={{
          fontSize: 48, fontWeight: 900, color: C.ink,
          letterSpacing: "-0.04em", lineHeight: 1, whiteSpace: "nowrap",
        }}>
          Option {number}
        </div>
      </div>

      {/* Middle: description */}
      <div style={{ flex: "0 0 280px" }}>
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
        number={1}
        title="Search to add"
        bullets={[
          "Shows scopes (Me, Direct Reports, Subordinates) by default",
          "Search to find and add specific people",
          "Recently added people stay visible without searching again",
          "Changes apply immediately — no confirm step",
        ]}
      >
        <FilterBadge />
      </Option>

      <Option
        number={2}
        title="All names visible, confirm with Apply"
        bullets={[
          "All people visible in the list immediately — search to filter",
          "Scroll within the dropdown to browse",
          "Sticky Apply button appears only when something changed",
          "Closing without Apply discards your changes",
        ]}
      >
        <FilterBadgeV2 />
      </Option>
    </div>
  );
}
