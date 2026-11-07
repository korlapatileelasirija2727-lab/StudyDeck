import { KINDS } from "./constants.js";

export const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

export const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });

export const daysUntil = (due) => { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(due + "T00:00:00") - t) / 86400000); };

export const dueLabel = (due) => { const d = daysUntil(due); return d < 0 ? "Overdue" : d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : "Due " + fmt(due); };

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export const doneOf = (g) => g.tasks.filter((t) => t.done).length;

export const dueAt = (g) => new Date(g.due + "T" + (g.time || "23:59") + ":00");

export const remindAt = (g) => new Date(dueAt(g).getTime() - (g.lead === undefined ? 1440 : g.lead) * 60000);

export const fmtDT = (d) => d.toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });

export const stamp = (d) => iso(d).replace(/-/g, "") + "T" + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0") + "00";

export const gcal = (g) => { const s = remindAt(g), e = new Date(s.getTime() + 1800000); return "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: "Study reminder: " + g.title, dates: stamp(s) + "/" + stamp(e), details: g.subject + ", due " + fmtDT(dueAt(g)) }).toString(); };

export const fmtTime = (s) => { const [h, m] = s.split(":").map(Number); return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + (h < 12 ? "AM" : "PM"); };

export const gcalTodo = (t) => { const s = new Date(t.date + "T" + (t.time || "09:00") + ":00"), e = new Date(s.getTime() + 1800000); return "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: KINDS[t.kind] + ": " + t.text, dates: stamp(s) + "/" + stamp(e), details: "From StudyDeck" }).toString(); };

export const streakOf = (log) => { const days = new Set(log.map((l) => l.date)); const d = new Date(); if (!days.has(iso(d))) d.setDate(d.getDate() - 1); let n = 0; while (days.has(iso(d))) { n++; d.setDate(d.getDate() - 1); } return n; };

export const levelOf = (p) => Math.floor(p / 100) + 1;

export const hashPw = async (pw, salt) => { try { const b = new TextEncoder().encode(salt + pw); const d = await crypto.subtle.digest("SHA-256", b); return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, "0")).join(""); } catch (e) { return btoa(unescape(encodeURIComponent(salt + pw))); } };
