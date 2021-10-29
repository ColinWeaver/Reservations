const knex = require("../db/connection");


function list(date){
     return knex('reservations').select('*')
     .where('reservation_date', date)
     .orderBy('reservation_time');
}

function create(newReservation){
  console.log(newReservation, "reservation test in create service")
  return knex("reservations").insert(newReservation).returning("*");
}

module.exports = {
    list,
    create,
   
  };
