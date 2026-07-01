import React from "react";
import FilterBadge from "./FilterBadge.jsx";
import FilterBadgeV2 from "./FilterBadgeV2.jsx";

const C = {
  pageBg: "#F3F6FB",
  ink: "#2F3A5C",
  muted: "#6B7A99",
  divider: "#DDE3EE",
};

function Option({ number, title, bullets, children, borderBottom }) {
  return (
    <div style={{
      borderBottom: borderBottom ? `1px solid ${C.divider}` : "none",
      paddingBottom: 64,
      marginBottom: borderBottom ? 64 : 0,
    }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: C.muted, marginBottom: 8,
        }}>
          Option {number}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, color: C.ink,
          letterSpacing: "-0.02em", marginBottom: 12,
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
      {children}
    </div>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.pageBg,
      fontFamily: '"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: "72px 48px",
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
        borderBottom
      >
        <FilterBadge />
      </Option>

      <Option
        number={2}
        title="All names visible, confirm with Apply"
        bullets={[
          "All people visible in the list immediately — no search needed",
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
