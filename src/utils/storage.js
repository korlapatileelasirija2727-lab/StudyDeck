// Browser storage helpers. Every logged-in user gets their own namespace (their email),
// so two accounts on the same browser never see each other's data.
let NS = "";
let uid = Date.now();

export const setNS = (v) => { NS = v; };
export const nextId = () => ++uid;

export const rawLoad = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };

export const rawSave = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

export const load = (k, d) => rawLoad(NS + k, d);

export const save = (k, v) => rawSave(NS + k, v);
