export default function Button({ children, variant = "", size = "", ...rest }) { return <button className={`btn ${variant} ${size}`} {...rest}>{children}</button>; }
