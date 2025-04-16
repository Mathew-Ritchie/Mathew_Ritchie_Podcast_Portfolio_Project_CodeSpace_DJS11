import React from "react";
import "./left-nav-bar.css";
import { NavLink } from "react-router";
import logo from "../../src/logo.png";

const LeftNavBar = ({ children, onButtonClick1, onButtonClick2 }) => {
  const activeStyles = {
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
    backgroundColor: "var(--accent-Orange)",
  };

  return (
    <nav className="left-nav-bar">
      <img src={logo} className="navbar-logo" />
      <NavLink
        to={"/"}
        className="left-navbar-btn-link-home left-navbar-btn-link"
        style={({ isActive }) => (isActive ? activeStyles : null)}
      >
        Home
      </NavLink>
      <NavLink
        to={`/favourites`}
        className="left-navbar-btn-link-favourites left-navbar-btn-link "
        style={({ isActive }) => (isActive ? activeStyles : null)}
      >
        Favourites
      </NavLink>
    </nav>
  );
};

export default LeftNavBar;
