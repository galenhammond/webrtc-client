import React from "react";

function FooterItem({ src, children, color }) {
  return (
    <li
      className={`${color && color + " text-white rounded"} inline-block p-2`}
    >
      <a href={src | "#"} className="text-sm">
        {children}
      </a>
    </li>
  );
}

export default FooterItem;
