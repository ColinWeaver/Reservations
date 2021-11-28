import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"
import Requests from "./Requests";

function CreateTable(){
      const history = useHistory();
      const [tableName, setTableName] = useState("");
      const [capacity, setTableCapacity] = useState(null);
      const [newTable, setNewTable] = useState(null);
      const [postError, setPostError] = useState(null);
      let requestConfig;
    
      useEffect((() => {
        if (postError) {
          setNewTable(null);
        }
      }),[postError]);

        function submitHandler(event){
          event.preventDefault();
          setPostError(null);
          const tableObject = {};
          tableObject["table_name"] = tableName;
          tableObject["capacity"] = Number(capacity);
          setNewTable(tableObject);
        };
      
        function changeHandler(event){
          event.preventDefault()
           if (event.target.name === "table_name"){
              setTableName(event.target.value);
           };
           if (event.target.name === "capacity"){
               setTableCapacity(event.target.value);
           };
        };

        function cancelHandler(event){
          event.preventDefault()
          history.goBack();
        }

        let postRequestOption = {
          method: 'POST', 
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify({ data: newTable })
        }
       if (newTable){
       requestConfig = {
       option: postRequestOption,
       redirectURL: `/dashboard`,
       fetchURL: "/tables"
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
              <h4>Add Table</h4>
              
              <ErrorAlert error={postError}/>

              <form onSubmit={submitHandler} >
                <label htmlFor="table_name" className="form-label">
                  Table Name:&nbsp; &nbsp;
                  <input
                    id="table_name"
                    type="text"
                    name="table_name"
                    placeholder="table name.."
                    onChange={changeHandler}
                    value={tableName}
                  />
                </label>
             
              <label htmlFor="capacity" className="form-label">
                  Capacity:&nbsp; &nbsp;
                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    placeholder="capacity"
                    onChange={changeHandler}
                    value={capacity}
                  />
                </label>

                <div className="form-buttons">
                <button className="cancel-form-button" type="cancel" name="cancel" onClick={cancelHandler}>Cancel
                </button>
                {"  "}
                <button className="submit-button" type="submit" name="submit">
                  Submit
                </button>
                </div>
              </form>
              </div>
              
            </>
          )
         }
          
        

      
      
      export default CreateTable;


