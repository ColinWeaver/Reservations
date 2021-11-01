import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function CreateReservationRequest(props){
    const {newReservation, setPostError} = props;
    const history = useHistory();
   

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}/reservations`);
    
        useEffect(() => {
          
          async function createReservationRequest(){
            let fetchReturn;
            try {
              let postRequestOption = {
                method: 'POST', 
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ data: newReservation })
              }
             
              fetchReturn = await fetch(url, postRequestOption);
              if (!fetchReturn.ok) {
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = {message: errorMessage };
                setPostError(errorObject)
              }
              else history.push(`/dashboard?date=${newReservation.reservation_date}`);
            }
            catch(error){
              console.log(error);
              

            };
           };
          createReservationRequest();
          }, []);

        return null;
}

export default CreateReservationRequest;