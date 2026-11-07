export default function TimePicker({ value, onChange }) {
  const [h24, m] = value ? value.split(":").map(Number) : [null, 0];
  const ap = h24 !== null && h24 < 12 ? "AM" : "PM", h12 = h24 === null ? "" : (h24 % 12) || 12;
  const emit = (h, mm, a) => onChange(String((h % 12) + (a === "PM" ? 12 : 0)).padStart(2, "0") + ":" + String(mm).padStart(2, "0"));
  return (
    <div className="row" style={{ flexWrap: "nowrap" }}>
      <select className="field" aria-label="Hour" value={h12} onChange={(e) => e.target.value && emit(Number(e.target.value), m, ap)}><option value="">Hr</option>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => <option key={h} value={h}>{h}</option>)}</select>
      <select className="field" aria-label="Minute" value={m} onChange={(e) => emit(h12 || 12, Number(e.target.value), ap)}>{Array.from({ length: 12 }, (_, i) => i * 5).map((x) => <option key={x} value={x}>{String(x).padStart(2, "0")}</option>)}</select>
      <select className="field" aria-label="AM or PM" value={ap} onChange={(e) => emit(h12 || 12, m, e.target.value)}><option>AM</option><option>PM</option></select>
    </div>
  );
}
