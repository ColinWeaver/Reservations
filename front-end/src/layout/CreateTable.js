import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"
import Requests from "./Requests";

function CreateTable(){
      const history = useHistory();
      const [tableName, setTableName] = useState("");
      const [capacity, setTableCapacity] = useState(1);
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
          tableObject["capacity"] = capacity;
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

        function cancelHandler(){
          history.push('/');
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
              <h1>Add Table</h1>
              <ErrorAlert error={postError}/>
              <form onSubmit={submitHandler}>
                <label htmlFor="table_name">
                  Table Name: <br />
                  <input
                    id="capacity"
                    type="text"
                    name="table_name"
                    placeholder="table name.."
                    onChange={changeHandler}
                    value={tableName}
                  />
                </label>
              <br />
              <label htmlFor="capacity">
                  Capacity: <br />
                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    placeholder="capacity"
                    onChange={changeHandler}
                    value={capacity}
                  />
                </label>


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
          
        

      
      
      export default CreateTable;


