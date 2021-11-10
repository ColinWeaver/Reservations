import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"
import Requests from "./Requests";


function DisplayReservations({reservations}){
    if (reservations.length > 0){
     return reservations.map((reservation) =>{
       let reservation_id = reservation.reservation_id;
       //let status = reservation.status 
        return (
        <div>
          <h4>Reservation {reservation.reservation_id}</h4>
          <p data-reservation-id-status={reservation.reservation_id}>Status:  </p>
          <p>Last Name: {reservation.last_name}</p>
          <p>First Name: {reservation.first_name}</p>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p> Date: {reservation.reservation_date}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <a href={`/reservations/${reservation_id}/seat`}>
          <button href={`/reservations/${reservation_id}/seat`} >Seat</button>
          </a>

        </div>
        )
     })
    }
    else return null;
  }

  export default DisplayReservations;