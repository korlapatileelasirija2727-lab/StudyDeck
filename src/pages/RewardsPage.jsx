import Button from "../components/Button.jsx";
import CountUp from "../components/CountUp.jsx";
import Head from "../components/Head.jsx";
import { TITLES } from "../utils/constants.js";
import { iso, levelOf } from "../utils/helpers.js";

function badgesFor(s) {
  return [
    { e: "🌱", n: "First Step", d: "Complete 1 task", ok: s.tasks >= 1 },
    { e: "🔥", n: "On Fire", d: "3-day streak", ok: s.streak >= 3 },
    { e: "⚡", n: "Week Warrior", d: "7-day streak", ok: s.streak >= 7 },
    { e: "🏆", n: "Goal Crusher", d: "Finish a goal", ok: s.goals >= 1 },
    { e: "💯", n: "Centurion", d: "Earn 100 points", ok: s.points >= 100 },
    { e: "📚", n: "Task Master", d: "Complete 25 tasks", ok: s.tasks >= 25 },
    { e: "🎯", n: "Deep Focus", d: "3 focus sessions", ok: s.sessions >= 3 },
    { e: "👑", n: "Legend", d: "Reach level 7", ok: levelOf(s.points) >= 7 },
  ];
}

export default function RewardsPage({ log, points, streak, claimable, onClaim, stats }) {
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const set = new Set(log.map((l) => l.date)), lv = levelOf(points), bs = badgesFor(stats);
  return (
    <div className="page">
      <Head title="Rewards" sub="Earn 5 points for every task and 10 for every focus session." />
      <section className="rhero">
        <span className="tw" style={{ left: "6%", top: "14%" }}>✦</span><span className="tw" style={{ right: "9%", top: "12%", animationDelay: ".8s" }}>✦</span><span className="tw" style={{ right: "30%", bottom: "10%", animationDelay: "1.4s" }}>✧</span>
        <div className="coin">★</div>
        <div>
          <span className="lv">Level {lv} · {TITLES[Math.min(lv - 1, 6)]}</span>
          <h2><CountUp value={points} /> <span style={{ fontSize: "0.4em", fontWeight: 700 }}>points</span></h2>
          <div className="xp"><div style={{ width: points % 100 + "%" }} /></div>
          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>{100 - (points % 100)} points to level {lv + 1} · <span className="flame">🔥</span> {streak}-day streak</p>
        </div>
      </section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="row sp"><div><h3>Ready to claim</h3><span className="meta">{claimable} completed tasks x 5 = {claimable * 5} points</span></div>
          <Button variant={claimable ? "claim pulse" : "claim off"} disabled={!claimable} onClick={onClaim}>{claimable ? `Claim ${claimable * 5} points` : "Complete a task to claim"}</Button></div>
        <p className="meta" style={{ margin: "10px 0 0" }}>Your first claim each day adds a streak bonus of 5 points per streak day, up to 35.</p>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}><h3>Your week</h3>
        <div className="row" style={{ marginTop: 12, justifyContent: "space-between", flexWrap: "nowrap" }}>{days.map((d, i) => { const on = set.has(iso(d)); return <div key={iso(d)} style={{ textAlign: "center" }}><div className={"day " + (on ? "on" : "")} style={{ "--d": i }}>{on ? "✓" : ""}</div><span className="meta">{d.toLocaleDateString(undefined, { weekday: "short" })}</span></div>; })}</div>
      </div>
      <div className="panel"><div className="row sp" style={{ marginBottom: 12 }}><h3>Badges</h3><span className="meta">{bs.filter((b) => b.ok).length} of {bs.length} unlocked</span></div>
        <div className="badges">{bs.map((b, i) => <div key={b.n} className={"bdg " + (b.ok ? "on" : "off")} style={{ "--d": i }}><span className="e">{b.ok ? b.e : "🔒"}</span><b>{b.n}</b><small>{b.d}</small></div>)}</div>
      </div>
    </div>
  );
}
