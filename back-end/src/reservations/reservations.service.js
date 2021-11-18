//const { KnexTimeoutError } = require("knex");
const knex = require("../db/connection");


function listByDate(date){
     return knex('reservations').select('*')
     .where({reservation_date: date, status: 'booked'})
     .orWhere({reservation_date: date, status: 'seated'})
     //.whereNot({status: "finished"}).orWhereNot({status:"cancelled"})
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

function removeTableAssociation(reservationId){
  return knex('tables').select("*")
  .where('reservation_id', reservationId)
  .update('reservation_id', null);
}

function updateStatus(reservationId, status){
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
    removeTableAssociation,
    updateStatus,
    readTables
  };
