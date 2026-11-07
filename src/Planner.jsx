import { useState, useEffect } from "react";
import Avatar from "./components/Avatar.jsx";
import Birthday from "./components/Birthday.jsx";
import RewardOverlay from "./components/RewardOverlay.jsx";
import FocusPage from "./pages/FocusPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import RemindersPage from "./pages/RemindersPage.jsx";
import RewardsPage from "./pages/RewardsPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import TodoPage from "./pages/TodoPage.jsx";
import { COLORS } from "./utils/constants.js";
import { doneOf, dueAt, fmtDT, iso, levelOf, pct, remindAt, streakOf } from "./utils/helpers.js";
import { load, nextId, save } from "./utils/storage.js";

export default function Planner({ user, onLogout, onUpdate }) {
  const [page, setPage] = useState("subjects");
  const [avatar, setAvatar] = useState(() => load("sd-avatar", ""));
  const [subjects, setSubjects] = useState(() => load("sd-subjects", []));
  const [goals, setGoals] = useState(() => load("sd-goals", []).map((g) => ({ ...g, finishing: false })));
  const [hist, setHist] = useState(() => load("sd-hist", []));
  const [log, setLog] = useState(() => load("sd-log", []));
  const [points, setPoints] = useState(() => load("sd-points", 0));
  const [lastClaim, setLastClaim] = useState(() => load("sd-last", ""));
  const [todos, setTodos] = useState(() => load("sd-todos", []));
  const [sessions, setSessions] = useState(() => load("sd-sessions", 0));
  const [focusMin, setFocusMin] = useState(() => load("sd-focus", 0));
  const [reward, setReward] = useState(null);
  const [bday, setBday] = useState(() => !!user.dob && user.dob.slice(5) === iso(new Date()).slice(5));
  const [now, setNow] = useState(Date.now());
  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const [toast, setToast] = useState("");
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);
  useEffect(() => { save("sd-avatar", avatar); }, [avatar]);
  useEffect(() => { save("sd-subjects", subjects); save("sd-goals", goals); save("sd-hist", hist); save("sd-todos", todos); }, [subjects, goals, hist, todos]);
  useEffect(() => { save("sd-log", log); save("sd-points", points); save("sd-last", lastClaim); save("sd-sessions", sessions); save("sd-focus", focusMin); }, [log, points, lastClaim, sessions, focusMin]);
  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2400); };
  const urgent = goals.filter((g) => !g.finishing && remindAt(g) <= new Date(now));
  useEffect(() => {
    const check = () => goals.filter((g) => remindAt(g) <= new Date() && dueAt(g) > new Date()).forEach((g) => {
      const k = "sd-n-" + g.id + g.due + g.time; if (load(k, false)) return;
      save(k, true); say("Reminder: " + g.title + " is due " + fmtDT(dueAt(g)));
      if (perm === "granted") { try { new Notification("Reminder: " + g.title + " is due " + fmtDT(dueAt(g)), { body: g.subject + ", " + (g.tasks.length - doneOf(g)) + " steps left" }); } catch (e) {} }
    });
    check(); const id = setInterval(check, 30000); return () => clearInterval(id);
  }, [goals, perm]);

  const addSubject = (name, priority) => setSubjects([...subjects, { name, priority, color: COLORS[subjects.length % COLORS.length] }]);
  const delSubject = (n) => { setSubjects(subjects.filter((s) => s.name !== n)); setGoals(goals.filter((g) => g.subject !== n)); };
  const addGoal = (g) => { setGoals([g, ...goals]); say("Goal added"); };
  const updateGoal = (id, patch) => { setGoals(goals.map((g) => g.id === id ? { ...g, ...patch } : g)); say("Goal updated"); };
  const delGoal = (id) => { setGoals(goals.filter((g) => g.id !== id)); say("Goal terminated"); };
  const addTask = (gid, text) => setGoals(goals.map((g) => g.id === gid ? { ...g, tasks: [...g.tasks, { id: nextId(), text, done: false }] } : g));
  const toggle = (gid, tid) => {
    const next = goals.map((g) => g.id !== gid ? g : { ...g, tasks: g.tasks.map((t) => t.id === tid ? { ...t, done: !t.done } : t) });
    const g = next.find((x) => x.id === gid), tk = g.tasks.find((x) => x.id === tid);
    if (tk.done) { if (!log.some((l) => l.tid === tid)) { setLog([...log, { tid, date: iso(new Date()), claimed: false }]); say("+5 points ready to claim in Rewards"); } }
    else setLog(log.filter((l) => l.tid !== tid || l.claimed));
    if (g.tasks.every((t) => t.done) && !g.finishing) {
      setGoals(next.map((x) => x.id === gid ? { ...x, finishing: true } : x));
      setTimeout(() => {
        setGoals((gs) => gs.filter((x) => x.id !== gid));
        setHist((h) => [...h, { id: gid, title: g.title, subject: g.subject, steps: g.tasks.length }]);
        say("Goal completed and cleared");
      }, 1400);
    } else setGoals(next);
  };
  const streak = streakOf(log), claimable = log.filter((l) => !l.claimed).length;
  const claim = () => {
    if (!claimable) return;
    const t = iso(new Date()), base = claimable * 5, bonus = lastClaim !== t ? 5 * Math.min(streak, 7) : 0, total = base + bonus, lv0 = levelOf(points), lv1 = levelOf(points + total);
    setLog(log.map((l) => ({ ...l, claimed: true }))); setPoints(points + total); setLastClaim(t);
    setReward({ title: "Reward points earned!", total, up: lv1 > lv0 ? lv1 : 0, lines: [claimable + " task" + (claimable > 1 ? "s" : "") + " x 5 = " + base + (bonus ? ", streak bonus +" + bonus + " (" + streak + "-day streak)" : "")] });
  };
  const focusDone = (m) => { setSessions((s) => s + 1); setFocusMin((x) => x + m); const lv0 = levelOf(points), lv1 = levelOf(points + 10); setPoints(points + 10); setReward({ title: "Focus session complete!", total: 10, up: lv1 > lv0 ? lv1 : 0, lines: [m + " minutes of deep focus"] }); };

  const totalSteps = goals.reduce((n, g) => n + g.tasks.length, 0) + hist.reduce((n, h) => n + h.steps, 0);
  const doneSteps = goals.reduce((n, g) => n + doneOf(g), 0) + hist.reduce((n, h) => n + h.steps, 0);
  const stats = { tasks: log.length, streak, goals: hist.length, points, sessions };
  const tabs = [["subjects", "📘 Subjects"], ["goals", "🎯 Goals"], ["todo", "✅ To-do"], ["focus", "⏱ Focus"], ["progress", "📊 Progress"], ["reminders", "🔔 Reminders"], ["rewards", "🏆 Rewards"], ["profile", "👤 Profile"]];
  const askPerm = () => { try { Notification.requestPermission().then(setPerm); } catch (e) {} };

  return (
    <div className={"th th-" + page}>
      <header className="nav">
        <div className="brand"><i>✎</i>StudyDeck</div>
        <nav className="tabs" aria-label="Pages">
          {tabs.map(([k, l]) => <button key={k} className={`tab ${page === k ? "on" : ""}`} onClick={() => setPage(k)}>{l}{k === "reminders" && urgent.length > 0 && <span className="badge-n">{urgent.length}</span>}</button>)}
        </nav>
        <div className="chips"><span className="chip"><span className="flame">🔥</span> {streak}</span><span className="chip"><i className="gem" /> {points}</span></div>
        <button className="avb" onClick={() => setPage("profile")} aria-label="Open profile"><Avatar src={avatar} name={user.first} size={38} /></button>
      </header>
      <div key={page}>
        {page === "subjects" && <SubjectsPage subjects={subjects} goals={goals} hist={hist} onAdd={addSubject} onDelete={delSubject} />}
        {page === "goals" && <GoalsPage onUpdate={updateGoal} onDelete={delGoal} goals={goals} subjects={subjects} onAdd={addGoal} onToggle={toggle} onAddTask={addTask} go={setPage} />}
        {page === "todo" && <TodoPage todos={todos} setTodos={setTodos} say={say} />}
        {page === "focus" && <FocusPage onDone={focusDone} sessions={sessions} focusMin={focusMin} />}
        {page === "progress" && <ProgressPage log={log} goals={goals} subjects={subjects} hist={hist} overall={pct(doneSteps, totalSteps)} doneSteps={doneSteps} totalSteps={totalSteps} focusMin={focusMin} />}
        {page === "reminders" && <RemindersPage goals={goals} todos={todos} user={user} go={setPage} perm={perm} askPerm={askPerm} />}
        {page === "rewards" && <RewardsPage log={log} points={points} streak={streak} claimable={claimable} onClaim={claim} stats={stats} />}
        {page === "profile" && <ProfilePage user={user} avatar={avatar} setAvatar={setAvatar} onUpdate={onUpdate} onLogout={onLogout} stats={stats} />}
      </div>
      {bday && <Birthday name={user.first} onClose={() => setBday(false)} />}
      {reward && <RewardOverlay reward={reward} onClose={() => setReward(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
