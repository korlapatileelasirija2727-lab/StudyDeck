import { useState, useEffect } from "react";

export default function Ring({ value, label, sub, size = 140 }) {
  const r = 52, c = 2 * Math.PI * r; const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 80); return () => clearTimeout(t); }, [value]);
  return (
    <svg className="ring" width={size} height={size} viewBox="0 0 130 130" aria-label={`${value}% complete`}>
      <defs><linearGradient id="rg"><stop offset="0" style={{ stopColor: "var(--brand)" }} /><stop offset="1" style={{ stopColor: "var(--brand2)" }} /></linearGradient></defs>
      <circle cx="65" cy="65" r={r} fill="none" stroke="color-mix(in srgb, var(--brand) 15%, #fff)" strokeWidth="12" />
      <circle cx="65" cy="65" r={r} fill="none" stroke="url(#rg)" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }} />
      <text x="65" y={sub ? 68 : 74} textAnchor="middle" style={label ? { fontSize: 26 } : null}>{label || value + "%"}</text>
      {sub && <text x="65" y="86" textAnchor="middle" style={{ fontSize: 11, fontWeight: 500, fill: "#667096" }}>{sub}</text>}
    </svg>
  );
}
