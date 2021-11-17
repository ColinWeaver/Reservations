const knex = require("../db/connection");

function list(){
     return knex('tables').select('*')
     .orderBy('table_name');
}

function create(newTable){
  return knex('tables').insert(newTable).returning('*');
}
function readTable(tableId){
  return knex("tables").select("*")
  .where({table_id: tableId})
}

function readReservation(reservationId){
  return knex("reservations").select("*")
  .where({reservation_id: reservationId})
}

//seats reservations: sets status to seat and reservation_id in table
function update(reservationId, tableId){
  return knex.transaction((trx) => {
    return Promise.all([
      knex('tables').select("*").where({table_id: tableId})
      .update({reservation_id: reservationId }).transacting(trx),
      knex('reservations').select("*")
      .where({reservation_id: reservationId})
      .update({status: 'seated'}).transacting(trx)
    ]).then(trx.commit).catch(trx.rollback).then((res) => 'seated').catch(console.error)
  })
  }


//finishes reservation: sets status to finished or alreadyFinished and removes table reservation_id
function destroy(tableId, reservationId, status){
  return knex.transaction((trx) => {
    return Promise.all([
      knex('tables').select("*").where({table_id: tableId})
      .update({reservation_id: null}).transacting(trx),
      knex('reservations').select("*")
      .where({reservation_id: reservationId})
      .update({status: status}).transacting(trx)
    ]).then(trx.commit).catch(trx.rollback).then((res) => status).catch(console.error)
  })
}

module.exports = {
    list,
    create,
    update,
    readTable,
    readReservation,
    destroy
   
  };
