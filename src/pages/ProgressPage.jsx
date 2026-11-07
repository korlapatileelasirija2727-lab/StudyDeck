import { useState } from "react";
import Bar from "../components/Bar.jsx";
import Head from "../components/Head.jsx";
import Ring from "../components/Ring.jsx";
import StudyGraph from "../components/StudyGraph.jsx";
import { doneOf, pct } from "../utils/helpers.js";

export default function ProgressPage({ log, goals, subjects, hist, overall, doneSteps, totalSteps, focusMin }) {
  const [range, setRange] = useState("week");
  return (
    <div className="page">
      <Head title="Progress" sub="Your completion across every subject." />
      <section className="hero"><Ring value={overall} /><div><h2>{totalSteps === 0 ? "Add goals to see your progress." : overall === 100 ? "Everything is done." : overall >= 50 ? "You are past halfway." : "Good start. Keep going."}</h2><p className="meta">{doneSteps} of {totalSteps} steps finished.</p></div></section>
      <div className="stats">
        <div className="panel stat"><b>{goals.length}</b><span className="meta">Active goals</span></div>
        <div className="panel stat"><b>{hist.length}</b><span className="meta">Goals completed</span></div>
        <div className="panel stat"><b>{totalSteps - doneSteps}</b><span className="meta">Steps remaining</span></div>
        <div className="panel stat"><b>{focusMin}</b><span className="meta">Focus minutes</span></div>
      </div>
      <StudyGraph log={log} range={range} setRange={setRange} />
      <div className="panel"><h3 style={{ marginBottom: 12 }}>By subject</h3>
        {subjects.length === 0 && <p className="meta">No subjects yet.</p>}
        {subjects.map((s) => {
          const act = goals.filter((g) => g.subject === s.name), h = hist.filter((x) => x.subject === s.name);
          const t = act.reduce((n, g) => n + g.tasks.length, 0) + h.reduce((n, x) => n + x.steps, 0), d = act.reduce((n, g) => n + doneOf(g), 0) + h.reduce((n, x) => n + x.steps, 0);
          return <div key={s.name} style={{ marginBottom: 14 }}><div className="row sp"><b>{s.name}</b><span className="meta">{pct(d, t)}%</span></div><Bar value={pct(d, t)} color={s.color} /></div>;
        })}
      </div>
      <div className="panel" style={{ marginTop: 16 }}><h3>Completed goals</h3>
        {hist.length === 0 ? <p className="meta">Finished goals will appear here after they clear from your list.</p> : [...hist].reverse().map((h, i) => <div className="item" key={h.id} style={{ "--d": i }}><span className="tg n">✓</span><b>{h.title}</b><span className="meta">{h.subject}</span></div>)}
      </div>
    </div>
  );
}
