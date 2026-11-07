import { useState } from "react";
import Badge from "./Badge.jsx";
import Bar from "./Bar.jsx";
import Button from "./Button.jsx";
import TimePicker from "./TimePicker.jsx";
import { LEADS } from "../utils/constants.js";
import { doneOf, dueAt, dueLabel, fmtDT, pct, remindAt } from "../utils/helpers.js";

export default function GoalCard({ goal, subject, index, onToggle, onAddTask, onUpdate, onDelete }) {
  const [text, setText] = useState(""); const d = doneOf(goal);
  const [edit, setEdit] = useState(false); const [sure, setSure] = useState(false);
  const [ef, setEf] = useState({ due: goal.due, time: goal.time, lead: goal.lead === undefined ? 1440 : goal.lead });
  const add = (e) => { e.preventDefault(); if (text.trim()) { onAddTask(goal.id, text.trim()); setText(""); } };
  const soon = remindAt(goal) <= new Date();
  return (
    <article className={`card ${goal.finishing ? "finishing" : ""}`} style={{ "--c": subject.color, "--d": index }}>
      <div className="row sp"><span className="meta">{goal.subject}</span><Badge level={subject.priority} /></div>
      <h3>{goal.title}</h3>
      <div>
        <div className="row sp" style={{ marginBottom: 6 }}><span className="meta">{d} of {goal.tasks.length} steps</span><span className="meta" style={soon ? { color: "var(--rose)", fontWeight: 700 } : null}>{dueLabel(goal.due)}</span></div>
        <Bar value={pct(d, goal.tasks.length)} color={subject.color} />
        <div className="meta" style={{ marginTop: 6 }}>⏰ Reminder {fmtDT(remindAt(goal))}, due {fmtDT(dueAt(goal))}</div>
      </div>
      <div>{goal.tasks.map((t) => <label key={t.id} className={`task ${t.done ? "d" : ""}`}><input type="checkbox" checked={t.done} onChange={() => onToggle(goal.id, t.id)} /><span>{t.text}</span></label>)}</div>
      <form className="row" onSubmit={add} style={{ flexWrap: "nowrap" }}><input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a step" aria-label={`Add a step to ${goal.title}`} /><Button size="sm" type="submit">Add</Button></form>
      {edit && (
        <div className="form" style={{ margin: 0, gridTemplateColumns: "1fr" }}>
          <label>Finish by (date)<input className="field" type="date" value={ef.due} onChange={(e) => setEf({ ...ef, due: e.target.value })} /></label>
          <label>Finish by (time, AM/PM)<TimePicker value={ef.time} onChange={(v) => setEf({ ...ef, time: v })} /></label>
          <label>Remind me<select className="field" value={ef.lead} onChange={(e) => setEf({ ...ef, lead: e.target.value })}>{LEADS.map(([m, l]) => <option key={m} value={m}>{l}</option>)}</select></label>
          <div className="row"><Button variant="primary" size="sm" onClick={() => { if (ef.due && ef.time) { onUpdate(goal.id, { due: ef.due, time: ef.time, lead: Number(ef.lead) }); setEdit(false); } }}>Save changes</Button><Button variant="ghost" size="sm" onClick={() => setEdit(false)}>Cancel</Button></div>
        </div>
      )}
      <div className="row">
        <Button variant="ghost" size="sm" onClick={() => setEdit(!edit)}>Edit date and time</Button>
        <Button variant="ghost" size="sm" style={{ color: "var(--rose)" }} onClick={() => { if (sure) onDelete(goal.id); else { setSure(true); setTimeout(() => setSure(false), 3000); } }}>{sure ? "Tap again to terminate" : "Terminate goal"}</Button>
      </div>
    </article>
  );
}
