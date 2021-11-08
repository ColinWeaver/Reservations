const knex = require("../db/connection");

function list(){
     return knex('tables').select('*')
     .orderBy('table_name');
}

function create(newTable){
  return knex('tables').insert(newTable).returning('*');
}

function update(updatedTable, tableId){
return knex("tables").select("*")
.where({ table_id: tableId })
.update({ reservation_id: updatedTable.reservation_id });
}

function readTable(tableId){
  return knex("tables").select("*")
  .where({table_id: tableId})
}

function readReservation(reservationId){
  return knex("reservations").select("*")
  .where({reservation_id: reservationId})
}

module.exports = {
    list,
    create,
    update,
    readTable,
    readReservation
   
  };
