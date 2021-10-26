import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import CreateReservationRequest from "./CreateReservationRequest";

function CreateReservation(){
      const history = useHistory();
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [reservationDate, setReservationDate] = useState(null);
      const [reservationTime, setReservationTime] = useState(null);
      const [peopleCount, setPeopleCount] = useState(0);
      const [newReservation, setNewReservation] = useState(null);
      const [postError, setPostError] = useState(null);
     
      // console.log("firstName: ", firstName,
      // "lastName: ", lastName, "date: ", reservationDate, 
      // "time: ", reservationTime, "people: ", peopleCount);
   

        function submitHandler(event){
          event.preventDefault();
          const reservationObject = {};
          reservationObject["first_name"] = firstName;
          reservationObject["last_name"] = lastName;
          reservationObject["reservation_date"] = reservationDate;
          reservationObject["reservation_time"] = reservationTime;
          reservationObject["people"] = peopleCount;
          setNewReservation(reservationObject);
        }

        function changeHandler(event){
          event.preventDefault()
          console.log("changehandler")
           if (event.target.name === "first_name"){
              setFirstName(event.target.value);
           };
           if (event.target.name === "last_name"){
             setLastName(event.target.value);
           };
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
          history.push('/');
        }

         function errorMessage(){
          if (postError) return "deconstruct error message";
          else return null;
         }

         if (newReservation){
            return (
            <CreateReservationRequest 
            newReservation={newReservation} 
            setPostError={setPostError}/>
            )
         }

          return (
            <>
              <h1>Add Reservation</h1>
              <p>{errorMessage()}</p>
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </label>
              <br />

              <label htmlFor="people">
                  Number of People: <br />
                  <input
                    id="people"
                    type="number"
                    name="people"
                    placeholder="0"
                    onChange={changeHandler}
                    value={peopleCount}
                    required
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
          
        

      
      
      export default CreateReservation;


