import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <header>
     <div className="header"> 
     <div className="title">
         <Link to="/">
          <h1 className="title">
            <span>Periodic Tables</span>
          </h1>
        </Link> 
        </div>
        
    <nav >
        <ul >
          <li className="nav-item">
            <Link to="/dashboard">
              <span className="oi oi-dashboard" />
              &nbsp;Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/search">
              <span className="oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
          </li>
          <li className="nav-item">
            <Link  to="/reservations/new">
              <span className="oi oi-plus" />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="nav-item">
            <Link  to="/tables/new">
              <span className="oi oi-layers" />
              &nbsp;New Table
            </Link>
          </li>
        </ul>


        {/* <div>
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div> */}
      {/* </div> */}
    </nav>
    </div>
    </header>
  );
}

export default Menu;
