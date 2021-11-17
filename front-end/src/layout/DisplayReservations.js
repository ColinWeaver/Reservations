import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"
import Requests from "./Requests";


function DisplayReservations({reservations}){

  
  function SeatButton({status, reservation_id}){
    if (status === "booked"){
      return (
        <a href={`/reservations/${reservation_id}/seat`}>
        <button>Seat</button>
        </a>
      )
    }
    else return null;
  }

  function cancelHandler(event){
  event.preventDefault();
  const confirm = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
  if (confirm){
    //set reservation status to cancel 
  
  }
}
  //-------------------------------------------------------------
    if (reservations && reservations.length > 0){
     return reservations.map((reservation) =>{
       let reservation_id = reservation.reservation_id;
       let status = reservation.status //reservation.status 
        return (
        <div>
          <h4>Reservation {reservation.reservation_id}</h4>
          <p data-reservation-id-status={reservation.reservation_id}>{status} </p>
          <p>Last Name: {reservation.last_name}</p>
          <p>First Name: {reservation.first_name}</p>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p> Date: {reservation.reservation_date}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <SeatButton status={status} reservation_id={reservation_id}/>
          <a href={`/reservations/${reservation_id}/edit`}>
          <button>Edit</button>
          </a>
          <button data-reservation-id-cancel={reservation_id} onClick={cancelHandler}>Cancel</button>
        </div>
        )
     })
    }
    else return null;
  }

  export default DisplayReservations;