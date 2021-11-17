import React, {useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert"

   function SeatReservation(){
     const history = useHistory();
     const [updatedTable, setUpdatedTable] = useState(null);
     const [tablesError, setTablesError] = useState(null);
     const [reservationsError, setReservationsError] = useState(null);
     const useParam = useParams();
     const reservationId = useParam.reservation_id;
     const [tables, setTables] = useState([]);
     const [optionValue, setOptionValue] = useState(null);
     const [reservationsFetch, setReservationsFetch] = useState(null);
     //const [tablesFetch, setTablesFetch] = useState(true)
     const [stop, setStop] = useState(false);
     const [preStop, setPreStop] = useState(null);
    
     
     useEffect((() => {
        if (reservationsFetch) {
          while(updatedTable){
          setUpdatedTable(null);
          }//this loop may not be necessary since im setting to null in requests
        }
          if (preStop){
            setStop(true)
          }
      }),[reservationsFetch, preStop]);

      //---------------------------handler functions------------------------------
        function submitHandler(event){
          event.preventDefault();
          setTablesError(null);
          setReservationsError(null);
          console.log(optionValue, 'submithandler value')
          const updated = {table_id: optionValue, reservation_id: reservationId}
          setUpdatedTable(updated);
          
        };
        function cancelHandler(){
          history.push('/');
        }
        function changeHandler(event){
          event.preventDefault()
          console.log(event.target.value)
          setOptionValue(event.target.value)
            }

 //---------------------------------------------------------------------------------           
//update table put request
       
   if (updatedTable){
     console.log('test in tables fetch config')
    let putRequestOption = {
      method: 'PUT', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ data: { reservation_id: reservationId } })
    }
      let requestConfig = {
       option: putRequestOption,
       redirectURL: `/reservations/${reservationId}/seat`,
       fetchURL: `/tables/${updatedTable.table_id}/seat`,
       fetchId: 1
     }
      return (
      <Requests
      requestConfig={requestConfig}
      setPostError={setTablesError}
      setReservationsFetch={setReservationsFetch}
      setUpdatedTable={setUpdatedTable}
      updatedTable={updatedTable}
      />
      )
   } 

  //update reservation put request
  //if no post error from tables fetch then run this
  console.log(tablesError, "tables error test outside second fetch")
if (reservationsFetch && !stop && !tablesError){


  console.log('test in fetch config reservations', tablesError)
  let putRequestOption = {
    method: 'PUT', 
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ data: { status: 'seated' } })
  }
let requestConfig = {
 option: putRequestOption,
 redirectURL: `/dashboard`,
 fetchURL: `/reservations/${reservationId}/status`,
 fetchId: 2
}
return (
<Requests
requestConfig={requestConfig}
setPostError={setReservationsError}
setPreStop={setPreStop}
/>
)
}
//----------------------------------------------------------------------------------
//loads tables for table form
  if (tables.length < 1){
    console.log("test in seat reservation load tables condition")
    let requestConfig = {
      fetchURL: '/tables',
      redirectURL: `/reservations/${reservationId}/seat`
    }
    return <Requests 
    requestConfig={requestConfig} 
    setPostError={setTablesError} 
    setTables={setTables}
    tables={tables}
    />
  }
 

  function TablesForm(){
  if (tables.length > 0) {
    if (!optionValue) setOptionValue(tables[0].table_id)
     return (
       <>
    <form onSubmit={submitHandler}>
    <select name="table_id" value={optionValue} onChange={changeHandler}>
    {tables.map((table) => {
      return (
                <option 
                value={table.table_id}>
                {table.table_name} - {table.capacity} - {table.reservation_id}
                </option>
      )
    })}
    </select>
<button type="cancel" onClick={cancelHandler}>Cancel
      </button>
      {"  "}
      <button type="submit" name="submit">
        Submit
      </button>
    </form>
    </>
     )
  }
  else return null;
}
               return (
            <>
              <h1>Seat Reservation {reservationId} </h1>
              <ErrorAlert error={tablesError}/>
              <ErrorAlert error={reservationsError}/>
              <TablesForm/>
            </>
        
)
}

export default SeatReservation;

