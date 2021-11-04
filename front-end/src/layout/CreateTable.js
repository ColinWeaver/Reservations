import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CreateTableRequest from "./CreateTableRequest";
import ErrorAlert from "./ErrorAlert"

function CreateTable(){
      const history = useHistory();
      const [tableName, setTableName] = useState("");
      const [capacity, setTableCapacity] = useState(1);
      const [newTable, setNewTable] = useState(null);
      const [postError, setPostError] = useState(null);
    
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


         if (newTable){
            return (
            <CreateTableRequest 
            newTable={newTable} 
            setPostError={setPostError}
            postError={postError}/>
            );
         };

         return (
            <>
              <h1>Add Table</h1>

              <ErrorAlert error={postError}/>
              <form onSubmit={submitHandler}>
                <label htmlFor="firstName">
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
              <label htmlFor="firstName">
                  Capacity: <br />
                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    placeholder="number"
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


