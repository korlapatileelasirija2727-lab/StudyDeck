import { useState } from "react";
import Button from "../components/Button.jsx";
import Head from "../components/Head.jsx";
import TimePicker from "../components/TimePicker.jsx";
import TodoRow from "../components/TodoRow.jsx";
import { KINDS } from "../utils/constants.js";
import { fmt, iso } from "../utils/helpers.js";
import { nextId } from "../utils/storage.js";

export default function TodoPage({ todos, setTodos, say }) {
  const [f, setF] = useState({ text: "", kind: "daily", date: iso(new Date()), time: "", repeat: "none" }); const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = (e) => {
    e.preventDefault();
    if (f.text.trim().length < 2) return setErr("Describe what you need to do.");
    if (!f.date) return setErr("Pick a date.");
    setTodos([...todos, { id: nextId(), text: f.text.trim(), kind: f.kind, date: f.date, repeat: f.repeat, time: f.time, done: false }]); setF({ ...f, text: "" }); setErr("");
  };
  const finish = (t) => {
    if (t.repeat === "none") return setTodos(todos.map((x) => x.id === t.id ? { ...x, done: true } : x));
    const d = new Date(t.date + "T00:00:00"); d.setDate(d.getDate() + (t.repeat === "daily" ? 1 : 7));
    setTodos(todos.map((x) => x.id === t.id ? { ...x, date: iso(d) } : x)); say("Done. Next one is on " + fmt(iso(d)));
  };
  const open = todos.filter((t) => !t.done).sort((a, b) => a.date.localeCompare(b.date)), done = todos.filter((t) => t.done);
  return (
    <div className="page">
      <Head title="To-do" sub="Daily tasks, assignments to submit and weekly exams." />
      <form className="panel form" onSubmit={add}>
        <label className="full">What do you need to do?<input className="field" value={f.text} onChange={set("text")} placeholder="e.g. Submit physics assignment" /></label>
        <label>Type<select className="field" value={f.kind} onChange={set("kind")}>{Object.keys(KINDS).map((k) => <option key={k} value={k}>{KINDS[k]}</option>)}</select></label>
        <label>Date<input className="field" type="date" value={f.date} onChange={set("date")} /></label>
        <label>Time (optional)<TimePicker value={f.time} onChange={(v) => setF({ ...f, time: v })} /></label>
        <label>Repeat<select className="field" value={f.repeat} onChange={set("repeat")}><option value="none">Does not repeat</option><option value="daily">Every day</option><option value="weekly">Every week</option></select></label>
        {err && <div className="err full" role="alert">{err}</div>}
        <div className="full"><Button variant="primary" type="submit">Add to list</Button></div>
      </form>
      {open.length === 0 && done.length === 0 ? <div className="empty"><h3>Your list is empty</h3><p>Add an assignment deadline or a weekly exam to get started.</p></div> : (
        <div className="panel">
          {open.length === 0 && <p className="meta">All caught up. Nice work.</p>}
          {open.map((t, i) => <TodoRow key={t.id} t={t} i={i} onFinish={finish} onUpdate={(id, p) => setTodos(todos.map((x) => x.id === id ? { ...x, ...p } : x))} onDelete={(id) => setTodos(todos.filter((x) => x.id !== id))} />)}
          {done.length > 0 && <h3 style={{ margin: "16px 0 4px", fontSize: 16 }}>Done</h3>}
          {done.map((t) => <div className="item" key={t.id}><span className="tg n">✓</span><span className="meta" style={{ flex: 1, textDecoration: "line-through" }}>{t.text}</span><Button variant="ghost" size="sm" onClick={() => setTodos(todos.filter((x) => x.id !== t.id))}>Delete</Button></div>)}
        </div>
      )}
    </div>
  );
}
