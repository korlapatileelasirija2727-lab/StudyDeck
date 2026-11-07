import { useState } from "react";
import Button from "./Button.jsx";
import TimePicker from "./TimePicker.jsx";
import { KINDS } from "../utils/constants.js";
import { daysUntil, dueLabel, fmtTime } from "../utils/helpers.js";

export default function TodoRow({ t, i, onFinish, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false); const [sure, setSure] = useState(false); const [d, setD] = useState(t.date); const [tm, setTm] = useState(t.time || "");
  return (
    <div className="item" style={{ "--d": i, color: "var(--ink)", fontWeight: 400, fontSize: 15 }}>
      <input type="checkbox" checked={false} aria-label={"Mark done: " + t.text} onChange={() => onFinish(t)} style={{ width: 20, height: 20, accentColor: "var(--brand)" }} />
      <span style={{ flex: 1, minWidth: 160 }}><b>{t.text}</b><br /><span className="meta">{KINDS[t.kind]}{t.repeat !== "none" ? ", repeats " + t.repeat : ""}{t.time ? ", " + fmtTime(t.time) : ""}</span></span>
      <span className={"tg " + (daysUntil(t.date) < 0 || t.kind === "exam" ? "o" : "n")}>{dueLabel(t.date)}</span>
      <Button variant="ghost" size="sm" onClick={() => setEdit(!edit)}>Edit</Button>
      <Button variant="ghost" size="sm" style={{ color: "var(--rose)" }} onClick={() => { if (sure) onDelete(t.id); else { setSure(true); setTimeout(() => setSure(false), 3000); } }}>{sure ? "Tap again to remove" : "Remove"}</Button>
      {edit && (
        <div className="row" style={{ flexBasis: "100%" }}>
          <input className="field" type="date" value={d} onChange={(e) => setD(e.target.value)} style={{ width: "auto" }} />
          <TimePicker value={tm} onChange={setTm} />
          <Button variant="primary" size="sm" onClick={() => { if (d) { onUpdate(t.id, { date: d, time: tm }); setEdit(false); } }}>Save</Button>
        </div>
      )}
    </div>
  );
}
