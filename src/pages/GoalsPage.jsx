import { useState } from "react";
import Button from "../components/Button.jsx";
import GoalCard from "../components/GoalCard.jsx";
import GoalForm from "../components/GoalForm.jsx";
import Head from "../components/Head.jsx";
import LiveClock from "../components/LiveClock.jsx";
import { COLORS } from "../utils/constants.js";
import { dueAt, fmtDT, remindAt } from "../utils/helpers.js";

export default function GoalsPage({ goals, subjects, onAdd, onToggle, onAddTask, onUpdate, onDelete, go }) {
  const [show, setShow] = useState(false);
  const sorted = [...goals].sort((a, b) => dueAt(a) - dueAt(b));
  const sub = (n) => subjects.find((s) => s.name === n) || { color: COLORS[0], priority: "medium" };
  const live = goals.filter((g) => !g.finishing && remindAt(g) <= new Date());
  return (
    <div className="page">
      <Head title="Goals" sub="Finish every step and the goal clears itself.">
        <LiveClock />
        <Button variant="primary" disabled={!subjects.length} onClick={() => setShow(!show)}>{show ? "Close" : "+ New goal"}</Button>
      </Head>
      {live.length > 0 && <div className="panel" style={{ marginBottom: 16, borderLeft: "6px solid var(--brand)" }}><b>Reminders</b>{live.map((g) => <div className="meta" key={g.id}>⏰ {g.title} is due {fmtDT(dueAt(g))}</div>)}</div>}
      {show && subjects.length > 0 && <GoalForm subjects={subjects} onAdd={(g) => { onAdd(g); setShow(false); }} onCancel={() => setShow(false)} />}
      {goals.length === 0 ? (
        <div className="empty">{subjects.length === 0 ? <><h3>Add a subject first</h3><p>Goals live inside subjects.</p><Button variant="primary" onClick={() => go("subjects")}>Go to Subjects</Button></> : <><h3>No active goals</h3><p>Add a goal and we will remind you before it is due.</p></>}</div>
      ) : <div className="grid">{sorted.map((g, i) => <GoalCard key={g.id} goal={g} subject={sub(g.subject)} index={i} onToggle={onToggle} onAddTask={onAddTask} onUpdate={onUpdate} onDelete={onDelete} />)}</div>}
    </div>
  );
}
