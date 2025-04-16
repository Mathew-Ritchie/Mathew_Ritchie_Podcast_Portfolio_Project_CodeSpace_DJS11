import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import LeftNavBar from "./LeftNavBar";

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Header />
      <LeftNavBar />
      <Outlet />
    </div>
  );
}
