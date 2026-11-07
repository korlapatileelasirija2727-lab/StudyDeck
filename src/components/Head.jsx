import { ICONS } from "../utils/constants.js";

export default function Head({ title, sub, children }) { return <div className="head"><span className="hi" aria-hidden="true">{ICONS[title]}</span><div><h1>{title}</h1><p>{sub}</p></div>{children}</div>; }
