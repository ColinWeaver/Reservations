import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//import CreateReservationRequest from "./CreateReservationRequest";
// import ErrorAlert from "./ErrorAlert"

   function SeatReservation(){
     const history = useHistory();
    // useEffect((() => {
    //     if (postError) {
    //       setNewTable(null);
    //     }
    //   }),[postError]);

        function submitHandler(event){
          event.preventDefault();
          // setPostError(null);
          // const tableObject = {};
          // tableObject["table_name"] = tableName;
          // tableObject["capacity"] = capacity;
          // setNewTable(tableObject);
        };
      
        function cancelHandler(){
          history.push('/');
        }


        //  if (newTable){
        //     return (
        //     <CreateTableRequest 
        //     newTable={newTable} 
        //     setPostError={setPostError}
        //     postError={postError}/>
        //     );
        //  };



//import useParams and set reservation from param 
//render this component via url change (include in routes component) not in dashboard
//this component needs to have a child component to load tables 
               return (
            <>
              <h1>Seat Reservation #id </h1>
             
              {/* <ErrorAlert error={postError}/> */}
              <form onSubmit={submitHandler}>
                
              <select>
                 <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option selected value="coconut">Coconut</option>
               <option value="mango">Mango</option>
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

export default SeatReservation;

