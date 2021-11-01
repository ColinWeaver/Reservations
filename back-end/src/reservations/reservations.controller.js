/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



//validation
// async function dateExists(req, res, next){
//   const date = req.query.date;
//   const response = await reservationsService.list(date);
//   if (response) next();
//   // if (response.length !== 0) {
//   //   res.locals.date = date;
//   //   next();
//   // }
//   else {
//     next({ message: "date doesnt exist", status: 400 })
//   }
// }

function hasData(req, res, next){
  const newReservationData = req.body.data;
  if (!newReservationData) next({status: 400, message: 'missing data'});
  res.locals.reservations = newReservationData;
  next();
}
function hasProperties(req, res, next){
  const newReservationData = res.locals.reservations;
  if (!newReservationData) next({status: 400, message: 'missing data'});
  const properties = Object.keys(newReservationData)
  const requiredProperties = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time"]
  for (let i = 0; i < requiredProperties.length; i++){
    if (!properties.includes(requiredProperties[i])){
      next({status: 400, message: `missing property: ${requiredProperties[i]}`})
    }
  }
  res.locals.reservations = newReservationData;
  next();
}
 
function firstName(req, res, next){
const reservation = res.locals.reservations;
const firstName = reservation.first_name;
if ((firstName.length < 1) || (!firstName)){
  next({status: 400, message: `first_name property must not be empty`})
}
res.locals.reservations = reservation;
next();
}

function lastName(req, res, next){
  const reservation = res.locals.reservations;
  const lastName = reservation.last_name;
  if ((lastName.length < 1) || (!lastName)){
    next({status: 400, message: `last_name property must not be empty`})
  }
  res.locals.reservations = reservation;
  next();
}

function mobileNumber(req, res, next){
  const reservation = res.locals.reservations;
const mobileNumber = reservation.mobile_number;
  if (mobileNumber.length < 1){
    next({status: 400, message: `mobile_number property must not be empty`})
  }
  res.locals.reservations = reservation;
  next();
}

function reservationDate(req, res, next){
  const reservation = res.locals.reservations;
  const reservationDate = Date.parse(reservation.reservation_date);
  if (!reservationDate){
    next({status: 400, message: 'reservation_date must be valid date and not empty'})
  }
  res.locals.reservations = reservation;
  next();
}

function reservationTime(req, res, next){
  const reservation = res.locals.reservations;
  const reservationTimeHour = parseInt(reservation.reservation_time.substring(0,2));
  const reservationTimeColon = reservation.reservation_time.substring(2,3);
  const reservationTimeMin = parseInt(reservation.reservation_time.substring(3));
 if ((!reservationTimeHour) || (reservationTimeColon !== ":") || (!reservationTimeMin)){
   next({status: 400, message: "reservation_time invalid"})
 }
  res.locals.reservations = reservation;
  next();
}

function people(req, res, next){
  const reservation = res.locals.reservations;
  const people = reservation.people;
  if (people === 0) {
    next({status: 400, message: "need to be more than 0 people"});
  }
  if ((typeof people) !== "number"){
    next({status: 400, message: "need to be number value for people"})
  }
  res.locals.reservations = reservation;
  next();
}

//----------------------------------------------------------------

async function list(req, res) {
  let date = req.query.date;
  res.json({ data: await reservationsService.list(date) });
}

async function create(req, res) {
   const newReservationData = res.locals.reservations
   const response = await reservationsService.create(newReservationData);
   res.status(201).json({ data: response[0] });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasProperties, firstName, lastName, mobileNumber, reservationTime, reservationDate, people, asyncErrorBoundary(create)]
};
