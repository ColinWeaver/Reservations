import React, {useEffect, useState } from "react";
//import ErrorAlert from "./ErrorAlert"
//import Requests from "./Requests";
import CreateReservation from "./CreateReservation";
import SeatReservation from "./SeatReservation";

function Reservations({reservationId}){
  if (true) {
    console.log(reservationId, 'reservaitonid test ')
      return (
        <>
        <CreateReservation/>
        <SeatReservation reservationId={reservationId}/>
    </>
    )
      }
else return null;
}

export default Reservations;