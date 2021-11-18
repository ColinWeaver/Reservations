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
      const [postError, setPostError] = useState(null);
      const [mobileNumber, setMobileNumber] = useState("");
      const useParam = useParams();
      const reservationId = useParam.reservation_id;
      const [reservation, setReservation] = useState(null);//load current reservation
      const [formValuesSet, setFormValuesSet] = useState(false);
      const [redirectDate, setRedirectDate] = useState(null);
      const location = useLocation();
      const [address, setAddress] = useState(location);
      
     
      useEffect((() => {
        if (postError) {
          setNewReservation(null);
        }
      }),[postError]);
  
//------------------------------------FETCHES---------------------------------------------
//get request for initial data
if (!reservation ){
  let requestConfig = {
  redirectURL: `/reservations/${reservationId}/edit`,
  fetchURL: `/reservations/${reservationId}`
  }
  return (
  <Requests
  requestConfig={requestConfig}
  setPostError={setPostError}
  setReservationList={setReservation}
  reservationList={reservation}
  />
  )
  }

   //PUT request to update reservation
if (newReservation){
  let redirectURL;
  if (!address.state){//test case tests for dashboard page 
    redirectURL = `/dashboard?date=${redirectDate}`
  }
  else if (address.state.prev === '/search'){
     redirectURL = "/search"
  }
  else {
    console.log(redirectDate, 'redirec date test')
    redirectURL = `/dashboard?date=${redirectDate}`
  }

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
}
return (
<Requests
requestConfig={config}
setPostError={setPostError}
/>
)
}
//-------------------------------------------------------------------------

  //set initial form values
  if (reservation && !formValuesSet){
    setRedirectDate(reservation.reservation_date.slice(0,10));//SETTING URL DATE FOR DASHBOARD REDIRECT
    setFirstName(reservation.first_name);
    setLastName(reservation.last_name);
    setMobileNumber(reservation.mobile_number);
    setReservationDate(reservation.reservation_date);
    setReservationTime(reservation.reservation_time);
    setPeopleCount(reservation.people);
    //setReservationDate(reservation.reservation_date);
    setFormValuesSet(true);
    
  }
//--------------------------------HANDLER FUNCTIONS-------------------------------------------
  
        function submitHandler(event){
          event.preventDefault();
          const reservationObject = {};
          setPostError(null);
          reservationObject["first_name"] = firstName;
          reservationObject["last_name"] = lastName;
          reservationObject["mobile_number"] = mobileNumber;
          reservationObject["reservation_date"] = reservationDate;
          reservationObject["reservation_time"] = reservationTime;
          reservationObject["people"] = Number(peopleCount);
          setNewReservation(reservationObject);
        }
      

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
             }
            setMobileNumber(event.target.value);
           }
           if (event.target.name === "reservation_date"){
            setReservationDate(event.target.value);
          };
          if (event.target.name === "reservation_time"){
            setReservationTime(event.target.value);
          };
          if (event.target.name === "people"){
            setPeopleCount(event.target.value);
          }
        }

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
          }
        }


     

         return (
            <>
              <h1>Edit Reservation</h1>
              {/* <ErrorMessage/> */}
              <ErrorAlert error={postError}/>
              <form onSubmit={submitHandler}>
                <label htmlFor="firstName">
                  First Name: <br />
                  <input
                    id="first"
                    type="text"
                    name="first_name"
                    placeholder="first name"
                    onChange={changeHandler}
                    value={firstName}
                   
                  />
                </label>
              <br />

              <label htmlFor="lastName">
                  Last Name: <br />
                  <input
                    id="last"
                    type="text"
                    name="last_name"
                    placeholder="last name"
                    onChange={changeHandler}
                    value={lastName}
                    
                  />
                </label>
              <br />

              <label htmlFor="MobileNumber">
                  Mobile Number: <br />
                    <input
                    id="mobileNumber"
                    type="tel"
                    name="mobile_number"
                    onChange={changeHandler}
                    value={mobileNumber}
                    placeholder="000-000-0000"
                    
                  />
                </label>
              <br />

              <label htmlFor="date">
                  Date: <br />
                  <input
                    id="date"
                    type="date"
                    name="reservation_date"
                    onChange={changeHandler}
                    value={reservationDate}
                    
                  />
                </label>
              <br />

              <label htmlFor="time">
                  Time: <br />
                  <input
                    id="time"
                    type="time"
                    name="reservation_time"
                    onChange={changeHandler}
                    value={reservationTime}
                   
                  />
                </label>
              <br />

              <label htmlFor="people">
                  Number of People: <br />
                  <input
                    id="people"
                    type="number"
                    name="people"
                    placeholder="1"
                    onChange={changeHandler}
                    value={peopleCount}
                  />
                </label>
                <br />
                <br />

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
          
        

      
      
      export default EditReservation;


