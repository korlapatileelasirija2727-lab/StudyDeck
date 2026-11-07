import { useState } from "react";
import Button from "../components/Button.jsx";
import { hashPw, iso } from "../utils/helpers.js";
import { rawLoad, rawSave } from "../utils/storage.js";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("signup"); const [f, setF] = useState({ first: "", last: "", dob: "", email: "", pw: "", pw2: "" });
  const [err, setErr] = useState(""); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const email = f.email.trim().toLowerCase(), accts = rawLoad("sd-accounts", {});
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    if (mode === "login") {
      const a = accts[email]; if (!a) return setErr("No account found for this email. Sign up first.");
      if (!f.pw) return setErr("Enter your password.");
      setBusy(true);
      if (!a.hash) { const salt = String(Math.random()).slice(2); const u = { ...a, salt, hash: await hashPw(f.pw, salt) }; rawSave("sd-accounts", { ...accts, [email]: u }); setBusy(false); return onAuth(u); }
      const h = await hashPw(f.pw, a.salt); setBusy(false);
      return h === a.hash ? onAuth(a) : setErr("Incorrect password.");
    }
    if (!f.first.trim() || !f.last.trim()) return setErr("Enter your first and last name.");
    if (!f.dob) return setErr("Enter your date of birth.");
    if (accts[email]) return setErr("An account with this email already exists. Log in instead.");
    if (f.pw.length < 6) return setErr("Password must be at least 6 characters.");
    if (f.pw !== f.pw2) return setErr("The passwords do not match.");
    setBusy(true); const salt = String(Math.random()).slice(2);
    const u = { first: f.first.trim(), last: f.last.trim(), dob: f.dob, email, salt, hash: await hashPw(f.pw, salt) };
    rawSave("sd-accounts", { ...accts, [email]: u }); setBusy(false); onAuth(u);
  };
  return (
    <div className="auth">
      <i className="orb" style={{ width: 340, height: 340, background: "#ffb199", left: "-6%", top: "-8%" }} />
      <i className="orb" style={{ width: 300, height: 300, background: "#b9a8ff", right: "-4%", bottom: "-6%", animationDelay: "-3s" }} />
      <i className="orb" style={{ width: 220, height: 220, background: "#ffd86b", right: "22%", top: "8%", animationDelay: "-6s" }} />
      <div className="acard">
        <div className="brand" style={{ marginBottom: 14 }}><i>✎</i>StudyDeck</div>
        <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="meta" style={{ margin: "0 0 16px" }}>{mode === "signup" ? "Your goals and progress are saved under your email." : "Log in with your email and password."}</p>
        <div className="seg2" style={{ marginBottom: 16 }}><button className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setErr(""); }}>Sign up</button><button className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); }}>Log in</button></div>
        <form className="form" style={{ marginBottom: 0 }} onSubmit={submit}>
          {mode === "signup" && <>
            <label>First name<input className="field" value={f.first} onChange={set("first")} autoComplete="given-name" /></label>
            <label>Last name<input className="field" value={f.last} onChange={set("last")} autoComplete="family-name" /></label>
            <label className="full">Date of birth<input className="field" type="date" max={iso(new Date())} value={f.dob} onChange={set("dob")} /></label>
          </>}
          <label className="full">Email<input className="field" type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" /></label>
          <label className={mode === "signup" ? "" : "full"}>{mode === "signup" ? "Enter password" : "Password"}<input className="field" type={show ? "text" : "password"} value={f.pw} onChange={set("pw")} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>
          {mode === "signup" && <label>Confirm password<input className="field" type={show ? "text" : "password"} value={f.pw2} onChange={set("pw2")} autoComplete="new-password" /></label>}
          <label className="full" style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password</label>
          {err && <div className="err full" role="alert">{err}</div>}
          <div className="full"><Button variant="primary" type="submit" disabled={busy} style={{ width: "100%" }}>{busy ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}</Button></div>
        </form>
      </div>
    </div>
  );
}
