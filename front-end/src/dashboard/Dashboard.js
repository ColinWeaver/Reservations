import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import Requests from "../layout/Requests";


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
  const [tables, setTables] = useState([]);
  const [postError, setPostError] = useState(null);

  if (queryDate) date = queryDate;
  
  function changeDayHandler(config){
    console.log(date, 'changeHandlerdate test')
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

  //have useeffect for tables whenever date changes, or maybe reservations changes
  


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

  
  if (tables.length < 1){
    let requestConfig = {
      fetchURL: '/tables',
      redirectURL: '/dashboard'
    }
    return <Requests 
    requestConfig={requestConfig} 
    setPostError={setPostError} 
    setTables={setTables}
    />
  }
 // date = queryDate

  function TablesDisplay(){
   let tableArray;
   if (tables.data){
     tableArray = tables.data
   }
   if ((tableArray) && (tableArray.length > 0)) {
   //  date = queryDate;
     
    return tableArray.map((table) => {
      let tableStatus = "Free"
      if (table.reservation_id){
        tableStatus = "Occupied"
      }
      return (
        <div>
        <h4>Table: {table.table_id}</h4>
        <p data-table-id-status={table.table_id}>Table Status: {tableStatus}</p>
        <p>Name: {table.table_name}</p>
        <p>Capacity: {table.capacity}</p>
        </div>
      )
    })
  }
  else return null;
}
  
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
          <button>Seat</button>
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
      <ErrorAlert error={postError}/>
      <ReservationsDisplay/>
      <TablesDisplay/>
     
    </main>
  );
}

export default Dashboard;
