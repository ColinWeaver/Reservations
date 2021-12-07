import { useEffect} from "react";
import { useHistory } from "react-router-dom";


function Requests(props){
  const controller = new AbortController();

    const {
      requestConfig, 
      setError, 
      setTables,
      tables, 
      setReservationList,
      reservationList,
      setReservationsFetch,
      setPreStop,
      setUpdatedTable,
      setReservationsFetched,
    
    } = props;

    //----------------------------------------------ASSIGNING LOCAL VARIABLES----------------------------------------------------------------------
    const history = useHistory();
    let option;
    let redirectURL;
    let fetchURL;
    let fetchId;
    if (requestConfig.option){
      option = requestConfig.option;
    };
    if (requestConfig.redirectURL){
      redirectURL = requestConfig.redirectURL;
    };
    if (requestConfig.fetchURL){
      fetchURL = requestConfig.fetchURL;
    };
    if (requestConfig.fetchId){
      fetchId = requestConfig.fetchId;
    };

    //add abort controller to option
    if (option){
      option.signal = controller.signal
    }
    else {
      option = { signal: controller.signal }
    }

  
    //------------------------------------SETTING URL FOR FETCH------------------------------------------
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const url = new URL(`${API_BASE_URL}${fetchURL}`);

    //---------------------------------------FETCH USEEFFECT--------------------------------
        useEffect(() => {
        
          async function request(){
            let fetchReturn;
            try {
              //load reservations in dash
              if (fetchId === 10){
                fetchReturn = await fetch(url, {signal: controller.signal});
                

                if ((fetchReturn) && reservationList.length === 0) {
                fetchReturn = await fetchReturn.json();
                setReservationList(fetchReturn.data);
                setReservationsFetched(true);
                history.push(redirectURL)
                }
              }

           //primary fetch load for all others
              fetchReturn = await fetch(url, option)
              
              //--------------------------------------------FETCH NOT OK---------------------------
              
              if (!fetchReturn.ok) {
                if (setTables){
                  setTables([]);
                }
                let promiseObject = await fetchReturn.json();
                let errorMessage = await promiseObject.error;
                let errorObject = { message: errorMessage };
                setError(errorObject);

                if (fetchId === 1) {
                  
                  setUpdatedTable(null);
                  setReservationsFetch(true);
                }
              }
               //--------------------------------------------SUCCESSFUL FETCH---------------------------
              
              else {
                fetchReturn = await fetchReturn.json();
                
               if (setPreStop) {
                 setPreStop(true);
               }

               //SET TABLES
                if (setTables) {
                  if (tables.length === 0){
                  setTables(fetchReturn.data)
                  }
                  else {
                    setTables([]);
                  }
                }

                //SETRESERVATIONS IN SEARCH
                if (setReservationList) {
                  if (!reservationList){
                  setReservationList(fetchReturn.data);
                  };
                };


                if (fetchId === 1){
                  setUpdatedTable(null);
                  setReservationsFetch(true);
                };


                if (fetchId === 3){
                  history.go(0);
                };

                
                if (redirectURL) {
                  history.push(redirectURL);
                }
              }
              if (!redirectURL && (fetchId !== 3)) {
                history.goBack();
              };
            
          }


            catch(error){
              console.log(error);
            }
           }
          request();
         

        

          return () => {
            controller.abort()
          };
          
          }, [tables, requestConfig, setReservationsFetch, setError, setUpdatedTable]);
//----------------------------------------------------------------------------------------------
        return null;
}

export default Requests;