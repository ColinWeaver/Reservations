import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function Requests(props){
    const {
      requestConfig, 
      setPostError, 
      setTables,
      tables, 
      setReservations, 
      setReRender,
      setReservationStatus,
      reservationStatus

    } = props;
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
    console.log(url, 'url test!!!!!')
        useEffect(() => {
          async function request(){
            let fetchReturn;
            try {
              fetchReturn = await fetch(url, option);
              console.log(fetchReturn, 'test in fetch')
              if (!fetchReturn.ok) {
                if (setTables){
                  setTables([]);
                }
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = { message: errorMessage };
                setPostError(errorObject)
              }
              else {
                console.log('request test 2')
                fetchReturn = await fetchReturn.json();
                if (setTables) {
                  console.log(tables, 'tables test request')
                  if (tables.length === 0){
                    console.log("request test 3")
                  setTables(fetchReturn.data);
                  }
                  else {
                    console.log('request test 4')
                    setTables([])
                  }
                }
                if (setReservations) {
                  console.log('request test 5')
                  setReservations(fetchReturn);
                }
               // if (setReRender) setReRender(true);

                // if (setReservationStatus) {
                //   if (reservationStatus === "seated"){
                //     setReservationStatus("finished")
                //   }
                //   else {
                //     setReservationStatus("seated")
                //   }
                // }
                if (redirectURL) {
                  console.log("request test 6")
                  history.push(redirectURL);
                }
                
                
              }
            }
            catch(error){
              console.log(error);
              

            };
           };
          request();
          }, [tables, setPostError, requestConfig, setReservations ]);

        return null;
}

export default Requests;