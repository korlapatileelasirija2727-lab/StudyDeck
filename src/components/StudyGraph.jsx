import { iso } from "../utils/helpers.js";

export default function StudyGraph({ log, range, setRange }) {
  const n = range === "week" ? 7 : 30;
  const data = Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); return { d, v: log.filter((l) => l.date === iso(d)).length }; });
  const max = Math.max(3, ...data.map((x) => x.v)), total = data.reduce((s, x) => s + x.v, 0), W = 640, H = 200, bw = W / n;
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="row sp"><h3>Study graph</h3><div className="seg2"><button className={range === "week" ? "on" : ""} onClick={() => setRange("week")}>Weekly</button><button className={range === "month" ? "on" : ""} onClick={() => setRange("month")}>Monthly</button></div></div>
      <p className="meta" style={{ margin: "6px 0 0" }}>{total} tasks completed in the last {n} days, active on {data.filter((x) => x.v > 0).length} days.</p>
      <svg className="chart" viewBox={`0 0 ${W} ${H + 28}`} role="img" aria-label="Tasks completed per day">
        <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "var(--brand2)" }} /><stop offset="1" style={{ stopColor: "var(--brand)" }} /></linearGradient></defs>
        {[0, 0.5, 1].map((t) => <line key={t} x1="0" x2={W} y1={H - t * H * 0.85} y2={H - t * H * 0.85} stroke="#e3e8fa" />)}
        {data.map((x, i) => { const h = (x.v / max) * H * 0.85; return (
          <g key={i}>
            <rect className="b" style={{ "--i": i }} x={i * bw + bw * 0.18} y={H - Math.max(h, 4)} width={bw * 0.64} height={Math.max(h, 4)} rx="5" fill={x.v ? "url(#bg)" : "#e3e8fa"} />
            {x.v > 0 && <text x={i * bw + bw / 2} y={H - h - 6} textAnchor="middle" fontSize="12" fill="#1b2559">{x.v}</text>}
            {(n === 7 || i % 5 === 0 || i === n - 1) && <text x={i * bw + bw / 2} y={H + 20} textAnchor="middle" fontSize="11" fill="#667096">{n === 7 ? x.d.toLocaleDateString(undefined, { weekday: "short" }) : x.d.getDate()}</text>}
          </g>); })}
      </svg>
    </div>
  );
}
