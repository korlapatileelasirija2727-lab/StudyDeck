import { useState } from "react";
import Avatar from "../components/Avatar.jsx";
import Button from "../components/Button.jsx";
import { TITLES } from "../utils/constants.js";
import { iso, levelOf } from "../utils/helpers.js";

export default function ProfilePage({ user, avatar, setAvatar, onUpdate, onLogout, stats }) {
  const [f, setF] = useState({ first: user.first, last: user.last, dob: user.dob }); const [saved, setSaved] = useState(false); const [err, setErr] = useState("");
  const pick = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.type.startsWith("image/")) return setErr("Choose an image file.");
    const r = new FileReader();
    r.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement("canvas"), m = Math.min(img.width, img.height); c.width = c.height = 256; c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 256, 256); setAvatar(c.toDataURL("image/jpeg", 0.85)); setErr(""); }; img.onerror = () => setErr("Could not read that image."); img.src = r.result; };
    r.readAsDataURL(file);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!f.first.trim() || !f.last.trim()) return setErr("Names cannot be empty.");
    if (!f.dob) return setErr("Enter your date of birth.");
    onUpdate({ first: f.first.trim(), last: f.last.trim(), dob: f.dob }); setErr(""); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="page">
      <div className="cover"><h1>Hi, {user.first}! 👋</h1><p>Level {levelOf(stats.points)} · {TITLES[Math.min(levelOf(stats.points) - 1, 6)]} · Update your photo and details below</p></div>
      <div className="ptiles">{[["💎", stats.points, "Points", "#ff8a3d"], ["🔥", stats.streak, "Day streak", "#e23c5a"], ["🏆", stats.goals, "Goals done", "#139a4a"], ["✅", stats.tasks, "Tasks done", "#0a9fc4"], ["🎯", stats.sessions, "Focus sessions", "#7b3fe4"]].map(([e, v, l, c], i) => <div key={l} className="pt" style={{ "--c": c, "--d": i }}><span>{e}</span><b>{v}</b><small>{l}</small></div>)}</div>
      <form className="panel form" onSubmit={submit}>
        <div className="full row" style={{ gap: 18 }}>
          <label className="camera" aria-label="Change profile photo"><Avatar src={avatar} name={user.first} size={96} /><span>✎</span><input type="file" accept="image/*" onChange={pick} style={{ display: "none" }} /></label>
          <div><h3>{user.first} {user.last}</h3><span className="meta">Level {levelOf(stats.points)} · {stats.points} points · {stats.goals} goals completed</span><br />{avatar && <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar("")}>Remove photo</Button>}</div>
        </div>
        <label>First name<input className="field" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} /></label>
        <label>Last name<input className="field" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} /></label>
        <label>Date of birth<input className="field" type="date" max={iso(new Date())} value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></label>
        <label>Email (used for reminders)<input className="field" type="email" value={user.email} readOnly disabled /></label>
        {err && <div className="err full" role="alert">{err}</div>}
        <div className="full row"><Button variant="primary" type="submit">Save changes</Button>{saved && <span className="meta" style={{ color: "var(--mint)", fontWeight: 700 }}>Saved ✓</span>}<Button type="button" variant="ghost" onClick={onLogout}>Log out</Button></div>
      </form>
    </div>
  );
}
