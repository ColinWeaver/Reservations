//const { KnexTimeoutError } = require("knex");
const knex = require("../db/connection");


function listByDate(date){
     return knex('reservations').select('*')
     .where({reservation_date: date })
     .whereNot({status: "finished"})
     .orderBy('reservation_time');
}

function listByNumber(mobile_number){
  return knex("reservations")
  .whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, "")}%`)  
  .orderBy("reservation_date");
}

function create(newReservation){
  return knex('reservations').insert(newReservation).returning('*');
}

function read(reservationId){
  return knex('reservations').select("*")
  .where('reservation_id', reservationId)
  .first()
}

function update(reservationId, updatedReservation){
return knex('reservations').select("*")
.where('reservation_id', reservationId)
.update(updatedReservation)
.returning("*");
}


function readTables(reservationId){
  return knex('tables').select("*")
  .where('reservation_id', reservationId)
}

// function updateStatusSeat(reservationId, tableId){
//   //set table reservation id and reservation status to 'seated'
//   console.log("test in updateStatusSeat service", reservationId, tableId)
//   return knex.transaction((trx) => {
//     return Promise.all([
//       knex('tables').select("*").where({table_id: tableId})
//       .update({reservation_id: reservationId }).transacting(trx),
//       knex('reservations').select("*")
//       .where({reservation_id: reservationId})
//       .update({status: 'seated'}).transacting(trx)
//     ]).then(trx.commit).catch(trx.rollback)//.then((res) => 'seated').catch(console.error)
//   })
// }


function updateStatus(reservationId, status){
  //this is called if current status in request body is finished and no table is associated
 return knex('reservations').select("*")
 .where('reservation_id', reservationId)
 .update({status: status}).then((value) => status).catch(console.error);
}


module.exports = {
    listByDate,
    listByNumber,
    create,
    read,
    update,
    //updateStatusSeat, 
    updateStatus,
    readTables
  };
