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
  const [listsClass, setListsClass] = useState('lists');
  const [reservationsButton, setReservationsButton] = useState('clicked-button');
  const [tablesButton, setTablesButton] = useState('unclicked-button');
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


  //------------TEMPORARILY NOT RENDERING THIS DONT DELETE!!!--------------------------------------------------------------------------------------------
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
     
     
      //set tales calss and reservations calss to null and have useeffect to reset values in that case??
      console.log('delete seating,', deleteSeating)
    }
  }


  //rendered components below//-------------------------------------------------
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
          <div className='reservation-data-container'>
        <p><b>Table Name:&nbsp;</b>{table.table_name}</p>
        <p><b>Table Id: &nbsp;</b>{table.table_id}</p>
        <p data-table-id-status={table.table_id}> <b>Table Status: &nbsp;</b> {tableStatus}</p>
        <p><b>Table Capacity:&nbsp;</b>{table.capacity}</p>
        </div>
        <div className="reservation-buttons-container">
        <FinishButton tableStatus={tableStatus} table={table}/>
        </div>
        </div>
       
      )
    })
  }
  else return null;
  // else return (
  //   <>
  //   <div className="list-item">
  //   <div className='reservation-data-container'>
  //   <p><b>Table Name:&nbsp;&nbsp;&nbsp;&nbsp;</b>Name</p>
  //   <p><b>Table Id: &nbsp;&nbsp;&nbsp;&nbsp;</b>5</p>
  //   <p><b>Table Status: &nbsp;&nbsp;&nbsp;&nbsp;</b> Occupied</p>
  //   <p><b>Table Capacity:&nbsp;&nbsp;&nbsp;&nbsp;</b>2</p>
  //   </div>
  //   <div className="reservation-buttons-container">
  //   <FinishButton tableStatus={"Occupied"} table={{table_name: 'Name', table_id: 5, table_capacity: 2, reservation_id: 2}}/>
  //   </div>
  //   </div>
  //   <div><hr/></div>

  //   <div className="list-item">
  //   <div className='reservation-data-container'>
  //   <p><b>Table Name:&nbsp;&nbsp;&nbsp;&nbsp;</b>Name</p>
  //   <p><b>Table Id: &nbsp;&nbsp;&nbsp;&nbsp;</b>5</p>
  //   <p><b>Table Status: &nbsp;&nbsp;&nbsp;&nbsp;</b> Occupied</p>
  //   <p><b>Table Capacity:&nbsp;&nbsp;&nbsp;&nbsp;</b>2</p>
  //   </div>
  //   <div className="reservation-buttons-container">
  //   <FinishButton tableStatus={"Occupied"} table={{table_name: 'Name', table_id: 5, table_capacity: 2, reservation_id: 2}}/>
  //   </div>
  //   </div>
  //   <div><hr/></div>

    

  //   </>
  // )
}



  return (
    
    <main>
      
     <div className="date-nav">
        <button className="date-nav-button" onClick={() => changeDayHandler("previous")}>Previous</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("today")}>Today</button>
        <button className="date-nav-button" onClick={() => changeDayHandler("next")}>Next</button>
    </div>

    <div className="errors">
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={postError}/>
   </div>

      <div className={listsClass}>
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
  );
}

export default Dashboard;
