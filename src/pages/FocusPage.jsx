import { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import Head from "../components/Head.jsx";
import Ring from "../components/Ring.jsx";

export default function FocusPage({ onDone, sessions, focusMin }) {
  const [mins, setMins] = useState(25); const [left, setLeft] = useState(25 * 60); const [endAt, setEndAt] = useState(null);
  useEffect(() => {
    if (!endAt) return;
    const id = setInterval(() => {
      const r = Math.ceil((endAt - Date.now()) / 1000);
      if (r <= 0) { setEndAt(null); setLeft(mins * 60); onDone(mins); } else setLeft(r);
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);
  const pick = (m) => { setMins(m); setLeft(m * 60); };
  const running = endAt !== null, total = mins * 60;
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  return (
    <div className="page">
      <Head title="Focus" sub="Study without distractions. Finish a session to earn 10 points." />
      <div className="panel" style={{ textAlign: "center" }}>
        <div className="seg2" style={{ marginBottom: 18 }}>{[5, 15, 25, 45].map((m) => <button key={m} disabled={running} className={mins === m ? "on" : ""} onClick={() => pick(m)}>{m} min</button>)}</div>
        <div style={{ display: "grid", placeItems: "center" }}><Ring size={240} value={Math.round(((total - left) / total) * 100)} label={mm + ":" + ss} sub={running ? "Stay focused" : "Ready"} /></div>
        <div className="row" style={{ justifyContent: "center", marginTop: 18 }}>
          {!running ? <Button variant="primary" onClick={() => setEndAt(Date.now() + left * 1000)}>{left === total ? "Start focus" : "Resume"}</Button> : <Button onClick={() => { setLeft(Math.ceil((endAt - Date.now()) / 1000)); setEndAt(null); }}>Pause</Button>}
          <Button variant="ghost" onClick={() => { setEndAt(null); setLeft(total); }}>Reset</Button>
        </div>
      </div>
      <div className="stats"><div className="panel stat"><b>{sessions}</b><span className="meta">Sessions finished</span></div><div className="panel stat"><b>{focusMin}</b><span className="meta">Minutes focused</span></div></div>
    </div>
  );
}
