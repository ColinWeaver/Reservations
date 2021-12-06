import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert"
import ReservationsForm from "./ReservationsForm";


function CreateReservation(){
      const history = useHistory();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [reservationDate, setReservationDate] = useState("");
      const [reservationTime, setReservationTime] = useState("");
      const [peopleCount, setPeopleCount] = useState(1);
      const [newReservation, setNewReservation] = useState("");
      const [error, setError] = useState(null);
      const [mobileNumber, setMobileNumber] = useState("");
    

      //----------------------------------------------RESET NEWRESERVATION OBJECT IF FETCH ERROR----------------------------------------------------------------------
      useEffect((() => {
        if (error) {
          setNewReservation(null);
        };
      }),[error]);

        //----------------------------------------------CANCEL HANDLER----------------------------------------------------------------------
        function cancelHandler(){
          history.push("/")
        };

        //----------------------------------------------POST FETCH TO /RESERVATIONS----------------------------------------------------------------------
         let option = {
                method: 'POST', 
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ data: newReservation })
              };
         if (newReservation){
           let config = {
             option: option,
             redirectURL: `/dashboard?date=${newReservation.reservation_date}`,
             fetchURL: "/reservations"
           };
            return (
            <Requests
            requestConfig={config}
            setError={setError}
            />
            )
         };

         //----------------------------------------------MAIN COMPONENT RENDER RETURN----------------------------------------------------------------------
         return (
            <>
            <div className="form-container">
              <h4>Add Reservation</h4>
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
      
      
      export default CreateReservation;


