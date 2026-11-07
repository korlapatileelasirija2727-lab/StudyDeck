import Button from "../components/Button.jsx";
import Head from "../components/Head.jsx";
import { KINDS } from "../utils/constants.js";
import { daysUntil, doneOf, dueAt, dueLabel, fmtDT, gcal, gcalTodo, remindAt } from "../utils/helpers.js";

export default function RemindersPage({ goals, todos, user, go, perm, askPerm }) {
  const list = goals.filter((g) => !g.finishing).sort((a, b) => remindAt(a) - remindAt(b));
  const urgent = list.filter((g) => remindAt(g) <= new Date());
  const tUrgent = todos.filter((t) => !t.done && daysUntil(t.date) <= 1);
  return (
    <div className="page">
      <Head title="Reminders" sub="Each goal reminds you at the time you chose." />
      
      {tUrgent.length > 0 && <div className="panel" style={{ marginBottom: 16, borderLeft: "6px solid var(--brand)" }}><b>To-do reminders</b>{tUrgent.map((t) => <div className="item" key={t.id}><span className={"tg " + (daysUntil(t.date) < 0 ? "o" : "")}>{dueLabel(t.date)}</span><span style={{ flex: 1 }}><b>{t.text}</b> <span className="meta">{KINDS[t.kind]}</span></span><a className="btn sm" href={gcalTodo(t)} target="_blank" rel="noopener noreferrer">Add to calendar</a></div>)}</div>}
      {perm === "default" && <div className="panel" style={{ marginBottom: 16 }}><b>Get pop-ups while this tab is open.</b><div style={{ marginTop: 10 }}><Button size="sm" onClick={askPerm}>Turn on notifications</Button></div></div>}
      {list.length === 0 ? <div className="empty"><h3>No reminders</h3><p>Reminders appear once you add a goal with a date and time.</p></div> : (
        <div className="panel">{list.map((g, i) => {
          const d = daysUntil(g.due);
          return (
            <div className="item" key={g.id} style={{ "--d": i }}>
              <span className={`tg ${d < 0 ? "o" : d > 1 ? "n" : ""}`}>{dueLabel(g.due)}</span>
              <span style={{ flex: 1, minWidth: 180 }}><b>{g.title}</b> <span className="meta">{g.subject}, {g.tasks.length - doneOf(g)} steps left</span><br /><span className="meta">⏰ {fmtDT(remindAt(g))}, due {fmtDT(dueAt(g))}</span></span>
              <div className="row"><a className="btn sm" href={gcal(g)} target="_blank" rel="noopener noreferrer">Add to calendar</a></div>
            </div>
          );
        })}</div>
      )}
      <p className="meta" style={{ marginTop: 14 }}>Tip: tap “Add to calendar” to get a real alert on your phone at the reminder time, even when this site is closed.</p>
    </div>
  );
}
