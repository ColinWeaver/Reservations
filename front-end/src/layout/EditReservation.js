import React, {useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert";
import ReservationsForm from "./ReservationsForm";


function EditReservation(){
      const history = useHistory();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [reservationDate, setReservationDate] = useState("");
      const [reservationTime, setReservationTime] = useState("");
      const [peopleCount, setPeopleCount] = useState(1);
      const [mobileNumber, setMobileNumber] = useState("");
      const [newReservation, setNewReservation] = useState("");
      const [error, setError] = useState(null);
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
              <ReservationsForm
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName} 
              setLastName={setLastName}
              mobileNumber={mobileNumber}
              setMobileNumber={setMobileNumber}
              reservationDate={reservationDate}
              setReservationDate={setReservationDate}
              reservationTime={reservationTime}
              setReservationTime={setReservationTime}
              peopleCount={peopleCount}
              setPeopleCount={setPeopleCount} 
              cancelHandler={cancelHandler}
              setNewReservation={setNewReservation}
              setError={setError}
              />
              </div>
            </>
          )
         }
          
    
      export default EditReservation;


