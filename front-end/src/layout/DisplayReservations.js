import React, {useEffect, useState } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"
import Requests from "./Requests";


function DisplayReservations({reservations, setReservations, setReservationsError, reservationsError}){
const [reservationId, setReservationId] = useState(null);
const [cancelReservation, setCancelReservation] = useState(null);
const [stopFetch, setStopFetch] = useState(null);
const [reservationStatus, setReservationStatus] = useState(null);
const [cancelFinished, setCancelFinished] = useState(null);
const location = useLocation();

let previousAddress;
if (location.pathname.includes('search')) {
   previousAddress = location.pathname;
}

// useEffect(() => {
// if (reservationsError || setReservations) {
//   console.log("test!!")
//   setStopFetch(true);
//   setCancelReservation(false);
  
// }
// }, [reservationsError, cancelFinished, reservations])

  function SeatButton({status, reservation_id}){
    if (status === "booked"){
      return (
        <Link to={`/reservations/${reservation_id}/seat`}>
        <button>Seat</button>
        </Link>
      )
    }
    else return null;
  }



  function cancelHandler(event){
  event.preventDefault();
  setReservationId(event.target.value)
  //setReservationStatus(event.target.value.status);
  const confirm = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
  if (confirm){
    setCancelReservation(true);
    setStopFetch(false)
  }
}
//-------------------------------------------------------------------------------------------
   
  //update status of reservation to cancelled and un-associate any table
if (cancelReservation && !stopFetch){
  console.log(reservationId, 'test in fetch cancel')
  // let redirectURL = "/"
  // if (location.search){
  //   redirectURL = `/dashboard?date=2021-11-19`
  // }


  let putRequestOption = {
    method: 'PUT', 
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ data: { status: "cancelled" } })
  }
let config = {
 option: putRequestOption,
 //redirectURL: "/dashboard",
 fetchURL: `/reservations/${reservationId}/status`,
 fetchId: 3
}
return (
<Requests
requestConfig={config}
setPostError={setReservationsError}
setCancelFinished={setCancelFinished}
setReservations={setReservations}
/>
)
}

function EditButton({status, reservation_id}){
  function notBookedHandler(event){
    event.preventDefault();
    console.log('test in handler')
    setReservationsError({message: 'You cannot edit an already seated reservation.'})
  }
if (status === 'booked'){
 return ( <Link to={{pathname: `/reservations/${reservation_id}/edit`, state: {prev: previousAddress}}}>
          <button>Edit</button>
          </Link>
 )
}
 else {
   return (
   <button onClick={notBookedHandler}>Edit</button>
 )
   }
}


  //-------------------------------------------------------------
    if (reservations && reservations.length > 0){
     return reservations.map((reservation) =>{
       let reservation_id = reservation.reservation_id;
       let status = reservation.status;
        return (
        <div>

          {/* <ErrorAlert error={error}/> */}
          <h4>Reservation {reservation.reservation_id}</h4>
          <p data-reservation-id-status={reservation.reservation_id}>{status} </p>
          <p>Last Name: {reservation.last_name}</p>
          <p>First Name: {reservation.first_name}</p>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p> Date: {reservation.reservation_date}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <SeatButton status={status} reservation_id={reservation_id}/>
          <EditButton status={status} reservation_id={reservation_id}/>
          <button data-reservation-id-cancel={reservation.reservation_id} value={reservation_id} onClick={cancelHandler}>Cancel</button>
        </div>
        )
     })
    }
    else return null;
  }

  export default DisplayReservations;