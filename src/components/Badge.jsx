import { PR } from "../utils/constants.js";

export default function Badge({ level }) { return <span className="pill" style={{ color: PR[level].c }}>{PR[level].label}</span>; }
