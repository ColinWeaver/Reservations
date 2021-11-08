import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function CreateReservationRequest(props){
    const {requestConfig, setPostError, setTables, setReservations} = props;
    const history = useHistory();
    let option;
    let redirectURL;
    let fetchURL;
    if (requestConfig.option){
      option = requestConfig.option;
    }
    if (requestConfig.redirectURL){
      redirectURL = requestConfig.redirectURL;
    }
    if (requestConfig.fetchURL){
      fetchURL = requestConfig.fetchURL;
    }
    
    
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}${fetchURL}`);
    
        useEffect(() => {
          async function request(){
            let fetchReturn;
            try {
              fetchReturn = await fetch(url, option);
              console.log(fetchReturn, 'test in fetch')
              if (!fetchReturn.ok) {
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = { message: errorMessage };
                setPostError(errorObject)
              }
              else {
                fetchReturn = await fetchReturn.json();
                if (setTables) setTables(fetchReturn);
                if (setReservations) setReservations(fetchReturn);
                if (redirectURL) history.push(redirectURL);
              }
            }
            catch(error){
              console.log(error);
              

            };
           };
          request();
          }, []);

        return null;
}

export default CreateReservationRequest;