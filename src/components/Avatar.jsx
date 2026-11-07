export default function Avatar({ src, name, size = 40 }) {
  return src ? <img className="av" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} /> : <span className="av" style={{ width: size, height: size, fontSize: size * 0.42 }}>{(name || "?")[0].toUpperCase()}</span>;
}
