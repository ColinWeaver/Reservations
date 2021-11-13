import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function Requests(props){
  //variables
    const {
      requestConfig, 
      setPostError, 
      setTables,
      tables, 
      setReservations, 
      setReRender,
      setReservationStatus,
      reservationStatus,
      setReservationList,
      reservationList
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

    //------------------------------------setting url for fetch------------------------------------------
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}${fetchURL}`);

    //---------------------------------------fetch useEffect--------------------------------
        useEffect(() => {
          async function request(){
            let fetchReturn;
            try {
              fetchReturn = await fetch(url, option);
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
                fetchReturn = await fetchReturn.json();
                if (setTables) {
                  if (tables.length === 0){
                  setTables(fetchReturn.data);
                  }
                  else {
                    setTables([])
                  }
                }
                if (setReservationList) {
                  if (!reservationList){
                  setReservationList(fetchReturn.data);
                  //history.push(redirectURL);
                  }
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
                  history.push(redirectURL);
                }
              }
            }
            catch(error){
              console.log(error);
            };
           };
          request();
          if (!redirectURL) history.goBack();
          }, [tables, setPostError, requestConfig]);
//---------------------------------------------------
        return null;
}

export default Requests;