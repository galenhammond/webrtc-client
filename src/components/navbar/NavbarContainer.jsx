import React from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";
import NavbarItem from "./NavbarItem";

function NavbarContainer(props) {
  const location = useLocation();

  return (
    <nav className="my-6 bg-white flex flex-row w-full justify-between items-center">
      <Logo />
      <ul className="space-x-2 md:space-x-4">
        <NavbarItem>Watch</NavbarItem>
        <NavbarItem color={"bg-white"}>Join Random</NavbarItem>
      </ul>
    </nav>
  );
}

export default NavbarContainer;
