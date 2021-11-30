import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Requests from "./Requests";


function DisplayReservations({ reservations, setReservations, setReservationsError }){
const [reservationId, setReservationId] = useState(null);
const [cancelReservation, setCancelReservation] = useState(null);
const [stopFetch, setStopFetch] = useState(null);
const location = useLocation();


//----------------------------------------------SET STATE VARIABLE TO BE ACCESSED BY OTHER COMPONENT VIA LINK----------------------------------------------------------------------
let previousAddress;
if (location.pathname.includes('search')) {
   previousAddress = location.pathname;
};

//----------------------------------------------SEAT BUTTON----------------------------------------------------------------------
  function SeatButton({status, reservation_id}){
    if (status === "booked"){
      return (
        <Link to={`/reservations/${reservation_id}/seat`}>
        <button className="seat-button">Seat</button>
        </Link>
      )
    }
    else return null;
  };


//----------------------------------------------CANCEL HANDLER----------------------------------------------------------------------
  function cancelHandler(event){
  event.preventDefault();
  setReservationId(event.target.value);
  const confirm = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
  if (confirm){
    setCancelReservation(true);
    setStopFetch(false);
  };
};
//----------------------------------------------CANCEL RESERVATION FETCH----------------------------------------------------------------------
  //update status of reservation to cancelled and un-associate any table
if (cancelReservation && !stopFetch){
  let option = {
    method: 'PUT', 
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ data: { status: "cancelled" } })
  };
let config = {
 option: option,
 fetchURL: `/reservations/${reservationId}/status`,
 fetchId: 3
};
return (
<Requests
requestConfig={config}
setError={setReservationsError}
setReservations={setReservations}
/>
)
};
//----------------------------------------------EDIT BUTTON----------------------------------------------------------------------
function EditButton({status, reservation_id}){
  function notBookedHandler(event){
    event.preventDefault();
    setReservationsError({message: 'You cannot edit an already seated reservation.'})
  };
if (status === 'booked'){
 return ( <Link to={{pathname: `/reservations/${reservation_id}/edit`, state: {prev: previousAddress}}}>
          <button className='edit-button'>Edit</button>
          </Link>
 )
}
 else {
   return (
   <button className="edit-button" onClick={notBookedHandler}>Edit</button>
 )
   };
};





 //----------------------------------------------MAIN COMPONENT CONDITION FOR RENDER----------------------------------------------------------------------
    if (reservations && reservations.length > 0){

     return reservations.map((reservation) =>{
       let reservation_id = reservation.reservation_id;
       let status = reservation.status;

       const time = () => {
         let hour = reservation.reservation_time.slice(0,2);
         let minute = reservation.reservation_time.slice(3,5);
        if (hour > 12){
          hour = hour - 12;
          return `${hour}:${minute} PM`
        }
        else return `${hour}:${minute} AM`
       };
       
      //----------------------------------------------MAIN COMPONENT RENDER RETURN----------------------------------------------------------------------
        return (
        <div className="list-item">
          <div className="list-data-container">
          <p><b>Reservation ID: &nbsp;</b>{reservation.reservation_id}</p>
          <p data-reservation-id-status={reservation.reservation_id}> <b>Reservations Status:&nbsp;</b>{status} </p>
          <p><b>Last Name:&nbsp;</b>{reservation.last_name}</p>
          <p><b>First Name:&nbsp;</b>{reservation.first_name}</p>
          <p><b>Mobile Number:&nbsp;</b>{reservation.mobile_number}</p>
          <p><b>Reservation Date: &nbsp;</b>{reservation.reservation_date}</p>
          <p><b>Reservation Time: &nbsp;</b>{time()}</p>
          <p><b>Number of People:&nbsp; </b>{reservation.people}</p>
          </div>
          <div className="buttons-container">
          <SeatButton status={status} reservation_id={reservation_id}/>
          <EditButton status={status} reservation_id={reservation_id}/>
          </div>
          <button className='cancel-button' data-reservation-id-cancel={reservation.reservation_id} value={reservation_id} onClick={cancelHandler}>Cancel</button>
        </div>
        )
     })
    }
    else return <p>No reservations to display for this date.</p>;
   
  }

  export default DisplayReservations;