import React from "react";
import FilterBadge from "./FilterBadge.jsx";
import FilterBadgeV2 from "./FilterBadgeV2.jsx";

const C = {
  pageBg: "#F3F6FB",
  ink: "#2F3A5C",
  muted: "#6B7A99",
  divider: "#DDE3EE",
};

function Option({ number, title, description, children, borderBottom }) {
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
          Optie {number}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, color: C.ink,
          letterSpacing: "-0.02em", marginBottom: 10,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 14, color: C.muted, lineHeight: 1.65, maxWidth: 480,
        }}>
          {description}
        </div>
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
        title="Zoek en voeg toe"
        description="De dropdown toont standaard de scopes (Me, My Direct Reports, My Subordinates) en mensen die je eerder hebt geselecteerd. Via de zoekbalk voeg je specifieke mensen toe aan je selectie. Wijzigingen worden direct toegepast."
        borderBottom
      >
        <FilterBadge />
      </Option>

      <Option
        number={2}
        title="Alle namen zichtbaar, Apply om te bevestigen"
        description="De dropdown toont meteen alle namen in de lijst — je kunt scrollen zonder te zoeken. Zolang je niets aanpast is er geen footer. Zodra je iets wijzigt verschijnt er een sticky 'Apply'-knop onderaan. Sluiten zonder Apply gooit je wijzigingen weg."
      >
        <FilterBadgeV2 />
      </Option>
    </div>
  );
}
