const knex = require("../db/connection");



// function list() {
//   return knex("reservations").select("*");
// }
function list(date){
     return knex("reservations").select("*")
     .where({"reservation_date": date})
     .orderBy("reservation_time");
    
}

function create(newReservation){
  return knex("reservations").insert(newReservation).returning("*").first();
}

module.exports = {
    list,
    create,
   
  };