import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import Requests from "../layout/Requests";
import DisplayReservations from "../layout/DisplayReservations";

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
  const [deleteSeating, setDeleteSeating] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [reservationStatus, setReservationStatus] = useState("booked");//seated, or finished
  const [tablesError, setTablesError] = useState(null);
  

  if (queryDate) {
    date = queryDate;
  }

 
//to trigger reload of tables
useEffect(() => {
  //   window.location.reload(false);
  setTableId(null);
  setDeleteSeating(false);
  }, [tables])


//------------------------------------load rendered data----------------------------------------------------------------------
//reservations loads when date changes useffect. tables load when page renders no useEffect

//load reservations
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

  //load tables
  if (tables.length < 1){
    let redirectURL;
    if (queryDate) {
      redirectURL = `/dashboard?date=${queryDate}`
    }
    else {
      redirectURL = `/dashboard`
    }
    let requestConfig = {
      fetchURL: '/tables',
      redirectURL: redirectURL
    }
    return <Requests 
    requestConfig={requestConfig} 
    setPostError={setPostError} 
    setTables={setTables}
    tables={tables}
    />
  }
//-------------------------------------Fetches to delete ---------------------------------------------
  //delete seating
  if (deleteSeating){
    let option = {
      method: 'DELETE', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: null
    }
    let requestConfig = {
      option: option,
      fetchURL: `/tables/${tableId}/seat`,
      redirectURL: `/`
    }
    return <Requests
    requestConfig={requestConfig}
    setPostError={setTablesError}
    setReRender={setReRender}
    setReservationStatus={setReservationStatus}
    reservationStatus={reservationStatus}
    tables={tables}
    setTables={setTables}
    />
  }

if ((reservationStatus === "finished") && !tablesError){
    let option = {
      method: 'PUT', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: {data: {status: "finished"}}
    }
    let requestConfig = {
      option: option,
      fetchURL: `/reservations/${reservationId}`,
      redirectURL: `/`
    }
    return <Requests
    requestConfig={requestConfig}
    setPostError={setReservationsError}
    setReRender={setReRender}

    />
  }


//-----------------------------------handler functions------------------------------------------------------------
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

  function finishTableHandler(event){
    event.preventDefault()
    setTableId(event.target.value)
    const confirm = window.confirm('Is this table ready to seat new guests? This cannot be undone.')
    if (confirm){
      console.log('deleteseating before', deleteSeating)
      setDeleteSeating((value) => value = true);
      console.log('delete seating,', deleteSeating)
    }
  }


  //rendered components below//-------------------------------------------------
  function TablesDisplay(){
    function FinishButton({tableStatus, table}){
      if (tableStatus === "Occupied"){
      return (
      <button 
      data-table-id-finish={table.table_id} 
      value={table.table_id} 
      onClick={finishTableHandler}>Finish
      </button>
      )
      }
      else return null;
    }

   if (tables.length > 0){
    return tables.map((table) => {
      let tableStatus = "Free"
      if (table.reservation_id){
        tableStatus = "Occupied";
       // setReservationId(table.reservation_id);
      }

      return (
        <div>
        <h4>Table: {table.table_id}</h4>
        <p data-table-id-status={table.table_id}> {tableStatus}</p>
        <p>Name: {table.table_name}</p>
        <p>Capacity: {table.capacity}</p>
        <FinishButton tableStatus={tableStatus} table={table}/>
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
      <DisplayReservations queryDate={queryDate} reservations={reservations} setReservations={setReservations} reservationsError={reservationsError} setReservationsError={setReservationsError}/>
      <TablesDisplay/>
     
    </main>
  );
}

export default Dashboard;
