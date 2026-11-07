import { useState, useEffect } from "react";

export default function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <div className="clock" aria-label="Current time"><b>{t.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}</b><span>{t.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}</span></div>;
}
