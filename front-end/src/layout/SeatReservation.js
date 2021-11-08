import React, {useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert"

   function SeatReservation(){
     const history = useHistory();
     const [updatedTable, setUpdatedTable] = useState(null);
     const [postError, setPostError] = useState(null);
     const useParam = useParams();
     const reservationId = useParam.reservation_id;
     const [tables, setTables] = useState([])
     const [optionValue, setOptionValue] = useState(null)
     useEffect((() => {
        if (postError) {
          setUpdatedTable(null);
        }
      }),[postError]);

        function submitHandler(event){
          event.preventDefault();
          setPostError(null);
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

//update table put request
         let postRequestOption = {
          method: 'PUT', 
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify({ data: { reservation_id: reservationId } })
        }
   if (updatedTable){
      let requestConfig = {
       option: postRequestOption,
       redirectURL: `/dashboard`,
       fetchURL: `/tables/${updatedTable.table_id}/seat`
     }
      return (
      <Requests
      requestConfig={requestConfig}
      setPostError={setPostError}
      />
      )
   }

//loads tables for table form
  if (tables.length < 1){
    let requestConfig = {
      fetchURL: '/tables',
      redirectURL: `/reservations/${reservationId}/seat`
    }
    return <Requests 
    requestConfig={requestConfig} 
    setPostError={setPostError} 
    setTables={setTables}
    />
  }
 
 

  function TablesForm(){
   let tableArray;
   if (tables.data){
     tableArray = tables.data
   }
   if ((tableArray) && (tableArray.length > 0)) {
     setOptionValue(tableArray[0].table_id)
     return (
    <form onSubmit={submitHandler}>
    <select name="table_id" value={optionValue} onChange={changeHandler}>
    {tableArray.map((table) => {
      return (
                <option 
                value={table.table_id}>
                {table.table_name}-{table.table_capacity}
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
     )
  }
  else return null;
}
               return (
            <>
              <h1>Seat Reservation {reservationId} </h1>
              <ErrorAlert error={postError}/>
              <TablesForm/>
            </>
        
)
}

export default SeatReservation;

