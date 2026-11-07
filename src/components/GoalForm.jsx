import { useState } from "react";
import Button from "./Button.jsx";
import TimePicker from "./TimePicker.jsx";
import { LEADS } from "../utils/constants.js";
import { nextId } from "../utils/storage.js";

export default function GoalForm({ subjects, onAdd, onCancel }) {
  const [f, setF] = useState({ title: "", subject: subjects[0].name, due: "", time: "", lead: 1440, steps: "" }); const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const tasks = f.steps.split("\n").map((t) => t.trim()).filter(Boolean).map((text) => ({ id: nextId(), text, done: false }));
    if (f.title.trim().length < 3) return setErr("Give your goal a title (3+ characters).");
    if (!f.due || !f.time) return setErr("Pick the date and time you plan to finish this goal.");
    if (!tasks.length) return setErr("Add at least one step, one per line.");
    onAdd({ id: nextId(), title: f.title.trim(), subject: f.subject, due: f.due, time: f.time, lead: Number(f.lead), tasks });
  };
  return (
    <form className="panel form" onSubmit={submit}>
      <label className="full">Goal<input className="field" autoFocus value={f.title} onChange={set("title")} placeholder="e.g. Finish chapter 4 revision" /></label>
      <label>Subject<select className="field" value={f.subject} onChange={set("subject")}>{subjects.map((s) => <option key={s.name}>{s.name}</option>)}</select></label>
      <label>Finish by (date)<input className="field" type="date" value={f.due} onChange={set("due")} /></label>
      <label>Finish by (time, AM/PM)<TimePicker value={f.time} onChange={(v) => setF({ ...f, time: v })} /></label>
      <label>Remind me<select className="field" value={f.lead} onChange={set("lead")}>{LEADS.map(([m, l]) => <option key={m} value={m}>{l}</option>)}</select></label>
      <label className="full">Steps (one per line)<textarea className="field" rows="3" value={f.steps} onChange={set("steps")} placeholder={"Read notes\nSolve 10 questions"} /></label>
      {err && <div className="err full" role="alert">{err}</div>}
      <div className="row full"><Button variant="primary" type="submit">Save goal</Button><Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}
