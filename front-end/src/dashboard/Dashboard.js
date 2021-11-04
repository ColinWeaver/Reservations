import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
  const [reservationId, setReservationId] = useState(null);
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

  function TablesDisplay(){
   return <p>Table list here</p>
  }
  
  //load tables here and render here and pass in to seat reservation as well
  function ReservationsDisplay(){
    if (reservations.length > 0){
     return reservations.map((reservation) =>{
        return (
        <div>
          <h4>Reservation {reservation.reservation_id}</h4>
          <p>Last Name: {reservation.last_name}</p>
          <p>First Name: {reservation.first_name}</p>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p> Date: {reservation.reservation_date}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button onClick={() => setReservationId(reservation.reservation_id)}>Seat</button>
          </a>
        </div>
        )
     })
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
      <TablesDisplay/>
     
    </main>
  );
}

export default Dashboard;
