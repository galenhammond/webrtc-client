import React from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function Logo(props) {
  //bg-gradient-to-r from-cyan-800  to-sky-500 bg-clip-text text-transparent
  return (
    <Link to={"/"} className="flex flex-row items-center space-x-1.5">
      <img src={logo} alt={"Mumbl logo"} className="w-5 h-5" />
      <h1 className="text-xl font-bold text-slate-900">{process.env.REACT_APP_LOGO}</h1>
    </Link>
  );
}

export default Logo;
