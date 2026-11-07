import { useEffect } from "react";
import { COLORS } from "../utils/constants.js";

export default function Splash({ leaving, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className={`splash ${leaving ? "leaving" : ""}`}>
      <div className="deck">{["Σ", "✎", "★", "⏰", "✓"].map((s, i) => <div key={i} className="dcard" style={{ "--i": i, "--c": COLORS[i] }}>{s}</div>)}</div>
      <h1 className="logo" aria-label="StudyDeck">{"StudyDeck".split("").map((ch, i) => <span key={i} style={{ animationDelay: 1.1 + i * 0.07 + "s" }}>{ch}</span>)}</h1>
      <p className="tagl">Plan. Focus. Finish.</p>
      <div className="load"><i /></div>
      <button className="skip" onClick={onDone}>Skip intro</button>
    </div>
  );
}
