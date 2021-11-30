import React, { useState } from "react";
import Requests from "./Requests";
 import ErrorAlert from "./ErrorAlert"
import DisplayReservations from "./DisplayReservations"

function Search(){
const [reservationList, setReservationList] = useState(null);
const [mobileNumber, setMobileNumber] = useState(null);
const [postError, setPostError] = useState(null);
const [submitNumber, setSubmitNumber] = useState(null);

//------------------------------------CHANGE HANDLER---------------------------------------------
function changeHandler(event){
  event.preventDefault();
  setMobileNumber(event.target.value);
};

//------------------------------------SUBMIT HANDLER---------------------------------------------
function submitHandler(event){
event.preventDefault();
setSubmitNumber((submitNumber) => submitNumber = mobileNumber);
setReservationList(null);
};

//------------------------------------NO RESERVATIONS MESSAGE OMPONENT---------------------------------------------
function NoReservations(){
  if ((reservationList) && reservationList.length === 0){
    return <p>No reservations found.</p>
  }
  else {
    return null;
  };
};

//------------------------------------GET FETCH TO /RESERVATIONS---------------------------------------------
if (submitNumber && (!reservationList) && !postError){
let config = {
redirectURL: `/search`,
fetchURL: `/reservations?mobile_number=${submitNumber}`
};
return (
<Requests
requestConfig={config}
setError={setPostError}
setReservationList={setReservationList}
reservationList={reservationList}
/>
)
};

//------------------------------------COMPONENT MAIN RENDER RETURN---------------------------------------------
    return (
        <>
        <div className="form-container">
          <h4>Search Reservations </h4>
          <ErrorAlert error={postError}/>
          <div >
          <form onSubmit={submitHandler} >
            <label htmlFor="table_name" className="search-form">
            <button type="submit" name="find" className="find-button" >
              Find
            </button>
              <input
                id="mobile_number"
                type="text"
                name="mobile_number"
                placeholder="Enter a customers phone number.."
                onChange={changeHandler}
                value={mobileNumber}
                size="35"
              />
            </label>
            {"  "}
          </form>
          </div>
        </div>
        <div className="lists">
              <DisplayReservations reservations={reservationList} setReservationsError={setPostError}/>
              <NoReservations/>
        </div>
        </>
      )
     }
      
     export default Search;
    
