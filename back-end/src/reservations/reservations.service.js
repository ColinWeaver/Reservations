const knex = require("../db/connection");


function listByDate(date){
     return knex('reservations').select('*')
     .where('reservation_date', date)
     .orderBy('reservation_time');
}

function listByNumber(mobile_number){
  console.log('test in servie for list')
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

//STORY 6 update status in reservations 
//need transaction to sink reservations with tables
function update(reservationId, status){
  return knex('reservations').select("*")
  .where('reservation_id', reservationId)
  //.update({status: status})
}


module.exports = {
    listByDate,
    listByNumber,
    create,
    read,
    update
  };
