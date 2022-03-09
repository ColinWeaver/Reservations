import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";

function Menu() {
  const location = useLocation();
  const [dashboardClass, setDashboardClass] = useState(null);
  const [searchClass, setSearchClass] = useState(null);
  const [addReservationClass, setAddReservationClass] = useState(null);
  const [addTableClass, setAddTableClass] = useState(null);
  

  //------------------------------------SETTING STATE VARIABLES FOR STYLING MENU LINKS--------------------------------------------
  useEffect(() => {
    if (location.pathname === '/dashboard'){
      setDashboardClass('clicked-menu-nav');
    }
    else if (location.pathname === '/search'){
      setSearchClass('clicked-menu-nav');
    }
    else if (location.pathname === '/reservations/new'){
      setAddReservationClass('clicked-menu-nav');
    }
    else {
      setAddTableClass('clicked-menu-nav');
    }
    
    //unsetting other list classes back to default
    if (location.pathname !== '/dashboard'){
      setDashboardClass(null);
    }
    if (location.pathname !== '/search'){
      setSearchClass(null);
    }
    if (location.pathname !== '/reservations/new'){
      setAddReservationClass(null);
    }
    if (location.pathname !== '/tables/new'){
      setAddTableClass(null);
    }
  }, [dashboardClass, searchClass, addReservationClass, addTableClass, location.pathname]);
 
 //------------------------------------MAIN COMPONENT RENDER RETURN---------------------------------------------
  return (
    <header>
     <div style={{marginTop: "10px"}} className="title">
         <Link to="/">
          <h1 className="title">
            <span>Reservations</span>
          </h1>
        </Link> 
    </div>
        
    <nav >
        <ul >
          <li className={dashboardClass}>
            <Link to="/dashboard">
              <span className="oi oi-dashboard" />
              &nbsp;Home
            </Link>
          </li>

          <li className={searchClass}>
            <Link to="/search">
              <span className="oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
          </li>
          <li className={addReservationClass}>
            <Link  to="/reservations/new">
              <span className="oi oi-plus" />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className={addTableClass}>
            <Link  to="/tables/new">
              <span className="oi oi-layers" />
              &nbsp;New Table
            </Link>
          </li>
        </ul>
    </nav>
    
    </header>
  );
}

export default Menu;
