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
  const [tablesClass, setTablesClass] = useState('list-small');
  const [reservationsClass, setReservationsClass] = useState('list-wide');
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
        <div className="list-item">
        <p>Table Name:{table.table_name}</p>
        <p>{table.table_id}</p>
        <p data-table-id-status={table.table_id}>  {tableStatus}</p>
        <p>Table Capacity:{table.capacity}</p>
        <FinishButton tableStatus={tableStatus} table={table}/>
        <br/>
        <hr/>
        </div>
       
      )
    })
  }
  else return null
}
console.log(tablesClass, reservationsClass, 'talbe, reservation')

 function classHandler(event){
  // event.preventDefault();
  console.log("tst in classHandler", event.target.value)
  if (event.target.value === 'reservations'){
   
   setReservationsClass('list-wide')
   setTablesClass('list-small')
  }
  else {
    console.log('test fun')
   setTablesClass('list-wide')
   setReservationsClass('list-small')
  }
 };

console.log(tablesClass, 'tableclass')
  return (
    <main>
      <div className="dashboard-nav">
      <button className="dashboard-title" onClick={classHandler} value="reservations" >Reservations</button>
      <button className="dashboard-title" onClick={classHandler} value="tables">Tables</button>
      </div>
      <div className="lists">
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={postError}/>

      <div className={reservationsClass}>
      <div className="date-nav">
        
        <button className="date-nav-button" onClick={() => changeDayHandler("previous")}>Previous</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("today")}>Today</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("next")}>Next</button>
      </div>
      <br/>
      <h5>Reservations for {queryDate} </h5>
      <DisplayReservations queryDate={queryDate} reservations={reservations} setReservations={setReservations} reservationsError={reservationsError} setReservationsError={setReservationsError}/>
      </div>

      <div className={tablesClass}>
      <h5>Tables</h5>
      <br/>
      <TablesDisplay/>
      </div>
      
      </div>
     
    </main>
  );
}

export default Dashboard;
