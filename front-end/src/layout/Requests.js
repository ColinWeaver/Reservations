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
      reservationList,
      setReservationsFetch,
      setPreStop,
      setUpdatedTable,
      updatedTable,
      setCancelFinished,
      
  
    } = props;
    const history = useHistory();
    let option;
    let redirectURL;
    let fetchURL;
    let fetchId;
    if (requestConfig.option){
      option = requestConfig.option;
    }
    if (requestConfig.redirectURL){
      redirectURL = requestConfig.redirectURL;
    }
    if (requestConfig.fetchURL){
      fetchURL = requestConfig.fetchURL;
    }
    if (requestConfig.fetchId){
      
      fetchId = requestConfig.fetchId;
    }

    //------------------------------------setting url for fetch------------------------------------------
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}${fetchURL}`);

    //---------------------------------------fetch useEffect--------------------------------
        useEffect(() => {
         //fetch to reservations seems to retrigger the condition fetch reservations variable
         //that it is based on without setting postError
         //no conditin fits with the fetch to reservations so it is redirecting and continually running
          async function request(){
            let fetchReturn;
            try {
              fetchReturn = await fetch(url, option);
              if (!fetchReturn.ok) {
                console.log("tst in failed fetch")
                if (setTables){
                  setTables([]);
                }
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = { message: errorMessage };
                setPostError(errorObject);
                
                if (fetchId === 1) {
                  
                  setUpdatedTable(null);
                  setReservationsFetch(true);
                }

                //dont have post error as condition for reuqest if setting here in child
                //need to redirect or else it will also set condition to run next fetch
              }

              else {
                console.log("test good fetch")
               
                fetchReturn = await fetchReturn.json();
                
               if (setPreStop) setPreStop(true)
                //have some condition here to keep fetch to reservations from rendering
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
                if (fetchId === 1){
                 
                  setUpdatedTable(null);
                  setReservationsFetch(true);
                  
                  //updated table as not null!! why????
                

                }
                if (fetchId === 3){
                
                  //setReservations([])
                  history.go(0)
                  //setCancelFinished(true);
                }
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
          if (!redirectURL && (fetchId !== 3)) history.goBack();
          }, [tables, requestConfig, setReservationsFetch, setPostError, setUpdatedTable]);
//---------------------------------------------------
        return null;
}

export default Requests;