import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";


function CreateReservationRequest(props){
    const {newReservation, setPostError} = props;
    const history = useHistory();
    let fetchReturn = null;
    
     console.log("tet in request component", newReservation)
        useEffect(() => {
          async function createReservationRequest(){
            try {
                //todo: have a condition for certain returns from backend 
                //...to setPostError inside try block. if ok property of
                //post response set to false (because code isnt in range 200-299)
                //then set post error inside try block. so if error is in server
                //validation it wont be thrown to catch but if error is in react
                //it will go to catch so set post error variable in both try and catch
              let postRequestOption = {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(newReservation)
              }
              fetchReturn = await fetch("/reservations", postRequestOption);
              console.log("fetch return", fetchReturn)
              history.push("/");
            }
            catch(error){
              console.log(error);
              setPostError(fetchReturn);
            };
           };
          createReservationRequest();
          }, []);

        return null;
}

export default CreateReservationRequest;