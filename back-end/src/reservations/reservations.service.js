const knex = require("../db/connection");


function list(date){
     return knex('reservations').select('*')
     .where('reservation_date', date)
     .orderBy('reservation_time');
}

function create(newReservation){
  return knex('reservations').insert(newReservation).returning('*');
}

function read(reservationId){
  return knex('reservations').select("*")
  .where('reservation_id', reservationId)
  .first()
}

function update(reservationId, status){
  return knex('reservations').select("*")
  .where('reservation_id', reservationId)
  //.update({status: status})
}
module.exports = {
    list,
    create,
    read,
    update
  };
