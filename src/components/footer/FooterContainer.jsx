import React from "react";
import FooterItem from "./FooterItem";

function FooterContainer(props) {
  return (
    <footer className="my-6 bg-white flex flex-row w-full justify-end items-center">
      <ul className="space-x-4 mr-2">
        <FooterItem>Contact</FooterItem>
        <FooterItem>Terms and Conditions</FooterItem>
      </ul>
    </footer>
  );
}

export default FooterContainer;
