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
        <div className="search-container">
          <br/>
          <h5>Search Reservations </h5>
          <ErrorAlert error={postError}/>

          <div >
          
          <form onSubmit={submitHandler} >
            <label htmlFor="table_name">
            <button type="submit" name="find" >
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
            
          <br />
        
            {/* <button type="cancel" name="cancel" onClick={cancelHandler}>Cancel
            </button> */}
            {"  "}
            
          </form>
          </div>
          <br />
          <div>
              <DisplayReservations reservations={reservationList} setReservationsError={setPostError}/>
              <NoReservations/>
          </div>
          </div>
        </>
      )
     }
      
     export default Search
    
