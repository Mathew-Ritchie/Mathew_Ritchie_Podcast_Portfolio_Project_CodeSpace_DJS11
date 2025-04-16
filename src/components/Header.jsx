import React, { useContext } from "react";
import "./header.css";
import miniLogo from "../assets/miniLogo.png";

export default function Header() {
  return (
    <header className="header">
      <img src={miniLogo} className="header-logo-img" />
      <h1 className="header-title">The Best Ever Podcast Web-App</h1>
    </header>
  );
}
