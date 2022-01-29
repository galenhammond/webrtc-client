import React from "react";
import { Link } from "react-router-dom";

function NavbarItem({ src, children, color, disabled }) {
  return (
    <li
      className={`${
        color
          ? color + " border-2" + (!disabled && " hover:bg-slate-100")
          : " hover:bg-slate-100"
      } inline-block p-2 rounded`}
    >
      {disabled ? (
        <button disabled className="font-medium">
          {children}
        </button>
      ) : (
        <Link to={src | "#"} className="font-medium">
          {children}
        </Link>
      )}
    </li>
  );
}

export default NavbarItem;
