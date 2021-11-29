import React, { useState } from "react";
import Requests from "./Requests";
 import ErrorAlert from "./ErrorAlert"
import DisplayReservations from "./DisplayReservations"

function Search(){
const [reservationList, setReservationList] = useState(null);
const [mobileNumber, setMobileNumber] = useState(null);
const [postError, setPostError] = useState(null);
const [submitNumber, setSubmitNumber] = useState(null);

function changeHandler(event){
  event.preventDefault();
  setMobileNumber(event.target.value);
  console.log('test in changehandler', mobileNumber, 'mobile number')
}

function submitHandler(event){
event.preventDefault();
setSubmitNumber((submitNumber) => submitNumber = mobileNumber);
setReservationList(null);
}


function NoReservations(){
  if (reservationList && reservationList.length === 0){
    return <p>No reservations found.</p>
  }
  else return null;
}

if (submitNumber && (!reservationList) && !postError){
let requestConfig = {
redirectURL: `/search`,
fetchURL: `/reservations?mobile_number=${submitNumber}`
}
return (
<Requests
requestConfig={requestConfig}
setPostError={setPostError}
setReservationList={setReservationList}
reservationList={reservationList}
/>
)
}



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
                size="30"
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
      
     export default Search
    
