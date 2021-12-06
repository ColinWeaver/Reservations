import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import "./Layout.css";




function Layout() {
  
  return (
    <div>
      <div className="layout">
        <div className="menu">
          <Menu />
        </div>
        <div className="routes">
          <Routes />
        </div>
      </div>
    </div>
  );
  
}

export default Layout;
