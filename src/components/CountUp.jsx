import { useState, useEffect } from "react";

export default function CountUp({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => { let f = 0; const id = setInterval(() => { f++; setN(Math.round(value * Math.min(1, f / 30))); if (f >= 30) clearInterval(id); }, 30); return () => clearInterval(id); }, [value]);
  return <>{n}</>;
}
