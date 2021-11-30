import React, {useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert"

function EditReservation(){
      const history = useHistory();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [reservationDate, setReservationDate] = useState("");
      const [reservationTime, setReservationTime] = useState("");
      const [peopleCount, setPeopleCount] = useState(1);
      const [newReservation, setNewReservation] = useState("");
      const [error, setError] = useState(null);
      const [mobileNumber, setMobileNumber] = useState("");
      const useParam = useParams();
      const reservationId = useParam.reservation_id;
      const [reservation, setReservation] = useState(null);
      const [formValuesSet, setFormValuesSet] = useState(false);
      const [redirectDate, setRedirectDate] = useState(null);
      const location = useLocation();
      const [address, setAddress] = useState(location);
      
     //----------------------------------------------RESET NEWRESERVATION OBJECT IF FETCH ERROR----------------------------------------------------------------------
      useEffect((() => {
        if (error) {
          setNewReservation(null);
        }
      }),[error]);
  
//------------------------------------GET FETCH TO LOAD RESERVATION---------------------------------------------

if (!reservation ){
  let config = {
  redirectURL: `/reservations/${reservationId}/edit`,
  fetchURL: `/reservations/${reservationId}`
  };
  return (
  <Requests
  requestConfig={config}
  setError={setError}
  setReservationList={setReservation}
  reservationList={reservation}
  />
  )
  };

//------------------------------------POST FETCH TO /RESERVATIONS---------------------------------------------  
if (newReservation){
  let redirectURL;
  if (!address.state){//test case tests for dashboard page 
    redirectURL = `/dashboard?date=${redirectDate}`
  }
  else if (address.state.prev === '/search'){
     redirectURL = "/search"
  }
  else {
    redirectURL = `/dashboard?date=${redirectDate}`
  };

  let option = {
    method: 'PUT', 
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ data: newReservation })
  }
let config = {
 option: option,
 fetchURL: `/reservations/${reservationId}`,
 redirectURL: redirectURL
};
return (
<Requests
requestConfig={config}
setError={setError}
/>
)
};
//------------------------------------SETTING INITIAL FORM VALUES---------------------------------------------

  if (reservation && !formValuesSet){
    setRedirectDate(reservation.reservation_date.slice(0,10));//SETTING URL DATE FOR DASHBOARD REDIRECT
    setFirstName(reservation.first_name);
    setLastName(reservation.last_name);
    setMobileNumber(reservation.mobile_number);
    setReservationDate(reservation.reservation_date);
    setReservationTime(reservation.reservation_time);
    setPeopleCount(reservation.people);
    setFormValuesSet(true);
  };
//------------------------------------SUBMIT HANDLER---------------------------------------------
  
        function submitHandler(event){
          event.preventDefault();
          const reservationObject = {};
          setError(null);
          reservationObject["first_name"] = firstName;
          reservationObject["last_name"] = lastName;
          reservationObject["mobile_number"] = mobileNumber;
          reservationObject["reservation_date"] = reservationDate;
          reservationObject["reservation_time"] = reservationTime;
          reservationObject["people"] = Number(peopleCount);
          setNewReservation(reservationObject);
        };
      
//------------------------------------CHANGE HANDLER---------------------------------------------
        function changeHandler(event){
          event.preventDefault()
           if (event.target.name === "first_name"){
              setFirstName(event.target.value);
           };
           if (event.target.name === "last_name"){
             setLastName(event.target.value);
           };
           if (event.target.name === "mobile_number"){
             if (mobileNumber.length < event.target.value.length){
              if ((event.target.value.length === 3) || (event.target.value.length === 7)) {
                event.target.value += "-";
                }
             };
            setMobileNumber(event.target.value);
           };
           if (event.target.name === "reservation_date"){
            setReservationDate(event.target.value);
          };
          if (event.target.name === "reservation_time"){
            setReservationTime(event.target.value);
          };
          if (event.target.name === "people"){
            setPeopleCount(event.target.value);
          };
        };
//------------------------------------CANCEL HANDLER--------------------------------------------
        function cancelHandler(event){
          event.preventDefault();
          if (!address.state){
            history.push('/dashboard')
          }
          else if (address.state.prev !== "/search"){
             history.push(`/dashboard?date=${redirectDate}`)
          }
          else {
            history.push('/search')
          };
        };


//------------------------------------MAIN COMPONENT RENDER RETURN---------------------------------------------
         return (
            <>
            <div className="form-container">
              <h4>Edit Reservation</h4>
              <ErrorAlert error={error}/>
              <form onSubmit={submitHandler}>
                <label htmlFor="firstName" className="form-label">
                  First Name:&nbsp; &nbsp;
                  <input
                    id="first"
                    type="text"
                    name="first_name"
                    placeholder="first name"
                    onChange={changeHandler}
                    value={firstName}
                  />
                </label>
            

              <label htmlFor="lastName" className="form-label">
                  Last Name:&nbsp; &nbsp;
                  <input
                    id="last"
                    type="text"
                    name="last_name"
                    placeholder="last name"
                    onChange={changeHandler}
                    value={lastName}
                  />
                </label>
           

              <label htmlFor="MobileNumber" className="form-label">
                  Mobile Number:&nbsp; &nbsp;
                    <input
                    id="mobileNumber"
                    type="tel"
                    name="mobile_number"
                    onChange={changeHandler}
                    value={mobileNumber}
                    placeholder="000-000-0000"
                  />
                </label>
            

              <label htmlFor="date" className="form-label">
                  Date:&nbsp; &nbsp;
                  <input
                    id="date"
                    type="date"
                    name="reservation_date"
                    onChange={changeHandler}
                    value={reservationDate}
                  />
                </label>
             

              <label htmlFor="time" className="form-label">
                  Time:&nbsp; &nbsp;
                  <input
                    id="time"
                    type="time"
                    name="reservation_time"
                    onChange={changeHandler}
                    value={reservationTime}
                  />
                </label>
          

              <label htmlFor="people" className="form-label">
                  Number of People:&nbsp; &nbsp;
                  <input
                    id="people"
                    type="number"
                    name="people"
                    placeholder="1"
                    onChange={changeHandler}
                    value={peopleCount}
                  />
                </label>
               <div className="form-buttons">
                <button className="cancel-form-button" type="cancel" onClick={cancelHandler}>Cancel
                </button>
                {"  "}
                <button className="submit-button" type="submit" name="submit">
                  Submit
                </button>
                </div>
              </form>
              </div>
            </>
          )
         }
          
    
      export default EditReservation;


