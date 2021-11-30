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
     const [stop, setStop] = useState(false);
     const [preStop, setPreStop] = useState(null);
    
     //------------------------------------SETTING STATE VARIABLES FOR SEATING FETCHES---------------------------------------------
     useEffect((() => {
        if (reservationsFetch) {
          while(updatedTable){
          setUpdatedTable(null);
          };
        };
          if (preStop){
            setStop(true)
          };
      }),[reservationsFetch, preStop]);

     //------------------------------------SUBMIT HANDLER---------------------------------------------
        function submitHandler(event){
          event.preventDefault();
          setTablesError(null);
          setReservationsError(null);
          const updated = {table_id: optionValue, reservation_id: reservationId};
          setUpdatedTable(updated);
        };

        //------------------------------------CANCEL HANDLER---------------------------------------------
        function cancelHandler(){
          history.push('/');
        };

        //------------------------------------CHANGE HANDLER---------------------------------------------
        function changeHandler(event){
          event.preventDefault();
          setOptionValue(event.target.value);
       };

//-----------------------------------PUT FETCH TO TABLES---------------------------------------------
      
   if (updatedTable){
    let option = {
      method: 'PUT', 
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ data: { reservation_id: reservationId } })
    };
      let config = {
       option: option,
       redirectURL: `/reservations/${reservationId}/seat`,
       fetchURL: `/tables/${updatedTable.table_id}/seat`,
       fetchId: 1
     };
      return (
      <Requests
      requestConfig={config}
      setError={setTablesError}
      setReservationsFetch={setReservationsFetch}
      setUpdatedTable={setUpdatedTable}
      updatedTable={updatedTable}
      />
      )
   };

 //------------------------------------PUT FETCH TO /RESERVATIONS TO UPDATE STATUS--------------------------------------
if (reservationsFetch && !stop && !tablesError){
  let option = {
    method: 'PUT', 
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ data: { status: 'seated' } })
  };
let config = {
 option: option,
 redirectURL: `/dashboard`,
 fetchURL: `/reservations/${reservationId}/status`,
 fetchId: 2
};
return (
<Requests
requestConfig={config}
setError={setReservationsError}
setPreStop={setPreStop}
/>
)
};
//----------------------------------------------FETCH TO LOAD TABLES FOR TABLE FORM------------------------------------------------------
  if (tables.length < 1){
    let config = {
      fetchURL: '/tables',
      redirectURL: `/reservations/${reservationId}/seat`
    };
    return <Requests 
    requestConfig={config} 
    setError={setTablesError} 
    setTables={setTables}
    tables={tables}
    />
  };
 
//----------------------------------------------TABLES FORM COMPONENT----------------------------------------------------------------------
  function TablesForm(){
  if (tables.length > 0) {
    if (!optionValue) {
      setOptionValue(tables[0].table_id);
    };
     return (
       <>
    <form onSubmit={submitHandler}>
    <select name="table_id" value={optionValue} onChange={changeHandler}>
    {tables.map((table) => {
      return (
                <option 
                value={table.table_id}>
                {table.table_name} - {table.capacity}
                </option>
      )
    })};
    </select>
     <button className="cancel-form-button" type="cancel" onClick={cancelHandler}>Cancel
     </button>
      {"  "}
      <button className="submit-button" type="submit" name="submit">
        Submit
      </button>
    </form>
    </>
     )
  };
};
//----------------------------------------------MAIN COMPONENT RENDER RETURN----------------------------------------------------------------------
               

            return (
            <>
             <div className="form-container">
              <h4>Seat Reservation {reservationId} </h4>
              <ErrorAlert error={tablesError}/>
              <ErrorAlert error={reservationsError}/>
              <TablesForm/>
              </div>
            </>
        
)
}

export default SeatReservation;

