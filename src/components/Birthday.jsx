import { useState } from "react";
import Button from "./Button.jsx";
import { COLORS } from "../utils/constants.js";

export default function Birthday({ name, onClose }) {
  const [bits] = useState(() => Array.from({ length: 16 }, (_, i) => ({ l: 3 + i * 6 + Math.random() * 4, d: Math.random() * 3, t: 6 + Math.random() * 4, c: COLORS[i % 6] })));
  const [conf] = useState(() => Array.from({ length: 60 }, (_, i) => ({ l: Math.random() * 100, d: Math.random() * 2, t: 2.5 + Math.random() * 3, c: COLORS[i % 6] })));
  return (
    <div className="bday" role="dialog" aria-label="Happy birthday">
      {bits.map((b, i) => <i key={i} className="bl" style={{ left: b.l + "%", background: b.c, animationDuration: b.t + "s", animationDelay: b.d + "s" }} />)}
      {conf.map((b, i) => <i key={"c" + i} className="conf" style={{ left: b.l + "%", background: b.c, animationDuration: b.t + "s", animationDelay: b.d + "s" }} />)}
      <div className="cake">🎂</div>
      <h2>Happy Birthday,<br />{name}!</h2>
      <p>Wishing you a year full of great marks and bigger dreams.</p>
      <Button autoFocus style={{ background: "#fff", color: "#e0446a", fontWeight: 700 }} onClick={onClose}>Let’s study</Button>
    </div>
  );
}
