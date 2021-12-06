import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import Requests from "../layout/Requests";
import DisplayReservations from "../layout/DisplayReservations";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const address = useLocation().search;
  const queryDate = new URLSearchParams(address).get('date');
  const [reservationId, setReservationId] = useState(null);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [deleteSeating, setDeleteSeating] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [reservationStatus, setReservationStatus] = useState("booked");
  const [tablesError, setTablesError] = useState(null);
  const [reservationsFetched, setReservationsFetched] = useState(null);
  //----------------------------------------------SET DATE TO URL QUERY ----------------------------------------------------------------------
 
  if (queryDate){
    date = queryDate;
  }
 

  //----------------------------------------------TABLES RELOAD TRIGGER----------------------------------------------------------------------

useEffect(() => {
  setTableId(null);
  setDeleteSeating(false);
  }, [tables]);

 
//----------------------------------------------RESERVATIONS RELOAD TRIGGER----------------------------------------------------------------------


  useEffect(()=> {
      setReservations([]);
      setReservationsError(null);
      setReservationsFetched(null);
  }, [date]);
  

//----------------------------------------------FETCH TO LOAD RESERVATIONS----------------------------------------------------------------------

  if (reservations && (reservations.length === 0) && !reservationsFetched){
    let redirectURL;
    let fetchURL;


    if (queryDate){
      redirectURL = `/dashboard?date=${date}`
      fetchURL = `/reservations?date=${date}`
    }
    else {
      redirectURL = '/dashboard'
      fetchURL = '/reservations'
    }
    
    let config = {
      fetchURL: `/reservations?date=${date}`,
      redirectURL: redirectURL,
      fetchId: 10,
    };
   
    return <Requests
    requestConfig={config}
    setError={setReservationsError}
    setReservationList={setReservations}
    reservationList={reservations}
    setReservationsFetched={setReservationsFetched}
    queryDate={queryDate}
    />
    }
 //----------------------------------------------FETCH TO LOAD TABLES----------------------------------------------------------------------
  if (tables.length < 1){
    let redirectURL;
    if (queryDate) {
      redirectURL = `/dashboard?date=${queryDate}`
    }
    else {
      redirectURL = `/dashboard`
    }
    let config = {
      fetchURL: '/tables',
      redirectURL: redirectURL
    };
    return <Requests 
    requestConfig={config} 
    setError={setError} 
    setTables={setTables}
    tables={tables}
    />
  };
//-------------------------------------FETCH TO /tables DELETE SEATING FROM TABLES------------------------------------------------------------------------
  
  if (deleteSeating){
    let option = {
      method: 'DELETE', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: null
    };
    let config = {
      option: option,
      fetchURL: `/tables/${tableId}/seat`,
      redirectURL: `/`
    };
    return <Requests
    requestConfig={config}
    setError={setTablesError}
    setReservationStatus={setReservationStatus}
    reservationStatus={reservationStatus}
    tables={tables}
    setTables={setTables}
    />
  };
//----------------------------------------------FETCH TO /reservations TO CHANGE STATUS----------------------------------------------------------------------
if ((reservationStatus === "finished") && (!tablesError)){
    let option = {
      method: 'PUT', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: {data: {status: "finished"}}
    };
    let config = {
      option: option,
      fetchURL: `/reservations/${reservationId}`,
      redirectURL: `/`
    };
    return <Requests
    requestConfig={config}
    setError={setReservationsError}
    />
  };


//-----------------------------------CHANGE DAY HANDLER------------------------------------------------------------
function changeDayHandler(config){
  if (config === "previous"){
    history.push(`/dashboard?date=${previous(date)}`);
  }
  else if (config === "today"){
    history.push(`/dashboard?date=${today()}`);
  }
  else {
    history.push(`/dashboard?date=${next(date)}`);
  };
};

//--------------------------------------FINISH TABLE HANDLER----------------------------------------------------------------------
  function finishTableHandler(event){
    event.preventDefault();
    setTableId(event.target.value);
    const confirm = window.confirm('Is this table ready to seat new guests? This cannot be undone.')
    if (confirm){
      setDeleteSeating(true);
    }
  };


  //----------------------------------------------TABLES DISPLAY COMPONENT----------------------------------------------------------------------
  function TablesDisplay(){
    function FinishButton({tableStatus, table}){
      if (tableStatus === "Occupied"){
      return (
      <button className="finish-button"
      data-table-id-finish={table.table_id} 
      value={table.table_id} 
      onClick={finishTableHandler}>Finish
      </button>
      )
      }
      else return null;
    };

   if (tables.length > 0){
    return tables.map((table) => {
      let tableStatus = "Free"
      if (table.reservation_id){
        tableStatus = "Occupied"
      }

      return (
        <>
        <div className="list-item" key={table.table_id}>
        <div className='list-data-container'>
        <p><b>Table Name:&nbsp;</b>{table.table_name}</p>
        <p><b>Table ID: &nbsp;</b>{table.table_id}</p>
        <p data-table-id-status={table.table_id}> <b>Table Status: &nbsp;</b> {tableStatus}</p>
        <p><b>Table Capacity:&nbsp;</b>{table.capacity}</p>
        </div>
        <div className="buttons-container">
        <FinishButton tableStatus={tableStatus} table={table}/>
        </div>
        </div>
        <div><hr/></div>
       </>
      )
    });
  }
  else return null;
};
//---------------------------------------------MAIN COMPONENT RENDER RETURN--------------------------------------------------------------------
  return (
  <main>
     <div className="date-nav">
        <button className="date-nav-button" onClick={() => changeDayHandler("previous")}>Previous</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("today")}>Today</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("next")}>Next</button>
     </div>

     <div className="errors">
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={error}/>
     </div>

     <div className="lists">
      <h3 className="list-title">Reservations for {date} </h3>
      <DisplayReservations 
      queryDate={queryDate} 
      reservations={reservations} 
      setReservations={setReservations} 
      reservationsError={reservationsError} 
      setReservationsError={setReservationsError}/>
      <h3 className="list-title">Tables</h3>
      <TablesDisplay/>
    </div>
 </main>
  )}


export default Dashboard;
