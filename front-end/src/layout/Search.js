import React, {useEffect, useState } from "react";
//import { useHistory, useParams } from "react-router-dom";
//import Requests from "./Requests";
// import ErrorAlert from "./ErrorAlert"
import DisplayReservations from "./DisplayReservations"

function Search(){
const [reservations, setReservations] = useState([]);
//mobilenumber state var
//change and submit handlers
//fetch to /reservations?mobile_phone={mobileNumber}
//use given service function 
//write controller list for if query since its still /reservations 

    return (
        <>
          <h1>Search</h1>
          {/* <ErrorAlert error={postError}/> */}
          <form onSubmit={submitHandler}>
            <label htmlFor="table_name">
              Table Name: <br />
              <input
                id="mobile_number"
                type="text"
                name="mobile_number"
                placeholder="Enter a customers phone number.."
                onChange={changeHandler}
                value={tableName}
              />
            </label>
          <br />
        
            {/* <button type="cancel" name="cancel" onClick={cancelHandler}>Cancel
            </button> */}
            {"  "}
            <button type="submit" name="find">
              Find
            </button>
          </form>

          <br />
          
          <div>
              <DisplayReservations reservations={reservations}/>
          </div>
        </>
      )
     }
      
     export default Search
    
