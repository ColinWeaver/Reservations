import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function CreateTableRequest(props){
    const {newTable, setPostError} = props;
    const history = useHistory();
   

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}/tables`);
    
        useEffect(() => {
          
          async function createTableRequest(){
            let fetchReturn;
            try {
              let postRequestOption = {
                method: 'POST', 
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ data: newTable })
              }
              fetchReturn = await fetch(url, postRequestOption);
              if (!fetchReturn.ok) {
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = {message: errorMessage };
                setPostError(errorObject);
              }
              else history.push(`/dashboard`);
            }
            catch(error){
              console.log(error);
              
            };
           };
          createTableRequest();
          }, []);

        return null;
}

export default CreateTableRequest;