import React, { useEffect, useState } from "react";
import { useHistory, useLocation} from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const address = useLocation().search;
  const queryDate = new URLSearchParams(address).get('date');
  if (queryDate) date = queryDate;
  
  function changeDayHandler(config){
    if (config === "previous"){
      history.push(`/dashboard?date=${previous(date)}`);
    }
    else if (config === "today"){
      history.push(`/dashboard?date=${today()}`);
    }
    else {
      history.push(`/dashboard?date=${next(date)}`);
    }
  }


  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    setReservations([])
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function ReservationsDisplay(){
    if (reservations.length > 0){
      return <p>{JSON.stringify(reservations)}</p>
    }
    else return null;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations</h4>
      </div>
      <div>
        <button onClick={() => changeDayHandler("previous")}>Previous</button>
        <button onClick={() => changeDayHandler("today")}>Today</button>
        <button onClick={() => changeDayHandler("next")}>Next</button>
      </div>
      <br/>
      <ErrorAlert error={reservationsError} />
      
      <ReservationsDisplay/>
     {/* {JSON.stringify(reservations)} */}
     
    </main>
  );
}

export default Dashboard;
