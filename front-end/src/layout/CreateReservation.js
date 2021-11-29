import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Requests from "./Requests";
import ErrorAlert from "./ErrorAlert"

function CreateReservation(){
      const history = useHistory();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [reservationDate, setReservationDate] = useState("");
      const [reservationTime, setReservationTime] = useState("");
      const [peopleCount, setPeopleCount] = useState(1);
      const [newReservation, setNewReservation] = useState("");
      const [postError, setPostError] = useState(null);
      const [mobileNumber, setMobileNumber] = useState("");
      let requestConfig;

      useEffect((() => {
        if (postError) {
          setNewReservation(null);
        }
      }),[postError]);

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

        function cancelHandler(){
          history.push("/")
        }

      
         let postRequestOption = {
                method: 'POST', 
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ data: newReservation })
              }
         if (newReservation){
           
           requestConfig = {
             option: postRequestOption,
             redirectURL: `/dashboard?date=${newReservation.reservation_date}`,
             fetchURL: "/reservations"
           }
            return (
            <Requests
            requestConfig={requestConfig}
            setPostError={setPostError}
            />
            )
         }

         
         return (
            <>
            
            <div className="form-container">

              <h4>Add Reservation</h4>
              <ErrorAlert error={postError}/>
              <form onSubmit={submitHandler}>
                <label htmlFor="firstName" className="form-label">
                  First Name: &nbsp; &nbsp;
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
                <button type="submit" name="submit" className="submit-button">
                  Submit
                </button>
                </div>
                
              </form>
            </div>
            </>
          )
         }
          
        

      
      
      export default CreateReservation;


