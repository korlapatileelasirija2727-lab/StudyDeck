import { useState } from "react";
import Button from "./Button.jsx";

export default function RewardOverlay({ reward, onClose }) {
  const [bits] = useState(() => Array.from({ length: 70 }, (_, i) => ({ l: Math.random() * 100, d: Math.random() * 1.2, t: 2.2 + Math.random() * 2, c: ["#ffc83d", "#ff6b9d", "#7ae0ff", "#9bff9b", "#fff", "#ffa94d"][i % 6] })));
  return (
    <div className="reward" role="dialog" aria-label="Reward earned">
      {bits.map((b, i) => <i key={i} className="conf" style={{ left: b.l + "%", background: b.c, animationDuration: b.t + "s", animationDelay: b.d + "s" }} />)}
      <div className="coin">★</div>
      <h2>+{reward.total}</h2>
      <p className="rl">{reward.title}</p>
      {reward.lines.map((l, i) => <p key={i} className="rl s">{l}</p>)}
      {reward.up && <p className="rl" style={{ color: "#ffe28a", fontWeight: 700 }}>🎉 Level up! You are now level {reward.up}</p>}
      <div style={{ marginTop: 14 }}><Button autoFocus style={{ background: "#fff", color: "#3b2fb8", fontWeight: 700 }} onClick={onClose}>Awesome</Button></div>
    </div>
  );
}
