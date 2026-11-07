import { useState } from "react";
import Planner from "./Planner.jsx";
import Splash from "./components/Splash.jsx";
import Auth from "./pages/Auth.jsx";
import { rawLoad, rawSave, setNS } from "./utils/storage.js";

export default function App() {
  const [stage, setStage] = useState("splash");
  const [user, setUser] = useState(() => { const e = rawLoad("sd-session", ""), a = rawLoad("sd-accounts", {}); if (e && a[e]) { setNS(e + ":"); return a[e]; } return null; });
  const enter = () => { if (stage === "splash") { setStage("leaving"); setTimeout(() => setStage("app"), 700); } };
  const login = (u) => { setNS(u.email + ":"); rawSave("sd-session", u.email); setUser(u); };
  const logout = () => { rawSave("sd-session", ""); setNS(""); setUser(null); };
  const update = (patch) => { const u = { ...user, ...patch }; rawSave("sd-accounts", { ...rawLoad("sd-accounts", {}), [u.email]: u }); setUser(u); };
  return (
    <>
      {stage !== "splash" && (user ? <Planner key={user.email} user={user} onLogout={logout} onUpdate={update} /> : <Auth onAuth={login} />)}
      {stage !== "app" && <Splash leaving={stage === "leaving"} onDone={enter} />}
    </>
  );
}
