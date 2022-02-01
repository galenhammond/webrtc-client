import React from "react";
import { Link } from "react-router-dom";

function FooterItem({ src, children, color }) {
  return (
    <li
      className={`${color && color + " text-white rounded"} inline-block p-2`}
    >
      <Link to={src} className="text-sm">
        {children}
      </Link>
    </li>
  );
}

export default FooterItem;
