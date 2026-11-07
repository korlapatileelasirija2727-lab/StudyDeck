import { useState } from "react";
import Badge from "../components/Badge.jsx";
import Bar from "../components/Bar.jsx";
import Button from "../components/Button.jsx";
import Head from "../components/Head.jsx";
import { PR, QUOTES } from "../utils/constants.js";
import { doneOf, pct } from "../utils/helpers.js";

export default function SubjectsPage({ subjects, goals, hist, onAdd, onDelete }) {
  const [name, setName] = useState(""); const [pr, setPr] = useState(""); const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Enter a subject name.");
    if (!pr) return setErr("Choose how important this subject is.");
    if (subjects.some((s) => s.name.toLowerCase() === name.trim().toLowerCase())) return setErr("That subject already exists.");
    onAdd(name.trim(), pr); setName(""); setPr(""); setErr("");
  };
  return (
    <div className="page">
      <Head title="Subjects" sub="Add each subject and tell us how important it is." />
      <div className="quote"><small>THOUGHT OF THE DAY</small>{QUOTES[new Date().getDay()]}</div>
      <form className="panel form" onSubmit={submit}>
        <label className="full">Subject name<input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Physics" /></label>
        <label className="full">Subject priority
          <div className="seg">{Object.keys(PR).map((k) => <button type="button" key={k} className={pr === k ? "on" : ""} style={pr === k ? { background: PR[k].c } : null} onClick={() => setPr(k)}>{PR[k].label}</button>)}</div>
        </label>
        {err && <div className="err full" role="alert">{err}</div>}
        <div className="full"><Button variant="primary" type="submit">Add subject</Button></div>
      </form>
      {subjects.length === 0 ? <div className="empty"><h3>No subjects yet</h3><p>Start by adding your first subject above.</p></div> : (
        <div className="grid">
          {[...subjects].sort((a, b) => PR[a.priority].r - PR[b.priority].r).map((s, i) => {
            const act = goals.filter((g) => g.subject === s.name), h = hist.filter((x) => x.subject === s.name);
            const total = act.reduce((n, g) => n + g.tasks.length, 0) + h.reduce((n, x) => n + x.steps, 0);
            const done = act.reduce((n, g) => n + doneOf(g), 0) + h.reduce((n, x) => n + x.steps, 0);
            return (
              <div className="card" key={s.name} style={{ "--c": s.color, "--d": i }}>
                <div className="row sp"><h3>{s.name}</h3><Badge level={s.priority} /></div>
                <span className="meta">{act.length} active goals, {h.length} completed</span>
                <Bar value={pct(done, total)} color={s.color} />
                <div className="row sp"><span className="meta">{pct(done, total)}% done</span><Button variant="ghost" size="sm" onClick={() => onDelete(s.name)}>Remove</Button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
