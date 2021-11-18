/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");




//---------------------validation for CREATE and UPDATE--------------------------------
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
  const reservationDate = Date.parse(reservation.reservation_date);//note browser issues can
  //result from using parse method
  if (!reservationDate){
    next({status: 400, message: 'reservation_date must be valid date and not empty'})
  }
  res.locals.reservations = reservation;
  
  next();
}

function validateFutureDate(req, res, next){
const reservation = res.locals.reservations;
let reservationDate =  new Date(reservation.reservation_date);
//reservation Date if at month 01 and day 01 and mobing backwards to utc should 
//be taken into account. it makes reservaiton Month = 0. 
const reservationYear = reservationDate.getUTCFullYear().toString();
const reservationMonth = reservationDate.getUTCMonth().toString();
const reservationDay = reservationDate.getUTCDate().toString();
let currentDate = new Date();
const currentYear = currentDate.getFullYear().toString();
const currentMonth = currentDate.getMonth().toString();
const currentDay = currentDate.getDate().toString();
currentDate = new Date(currentYear, currentMonth, currentDay);
reservationDate = new Date(reservationYear, reservationMonth, reservationDay);


const reservationDateMilliseconds = reservationDate.getTime();
const currentDateMilliseconds = currentDate.getTime();
if (reservationDateMilliseconds < currentDateMilliseconds){
  next({status: 400, message: "reservation_date must be in future"})
}
if (reservationDateMilliseconds === currentDateMilliseconds){
  res.locals.equalDates = true;
}
res.locals.reservations = reservation;

next();
}

function validateNotTuesday(req, res, next){
  const reservation = res.locals.reservations;
  const reservationDate =  new Date(reservation.reservation_date)
  const day = reservationDate.getUTCDay()
  if (day === 2){
    next({status: 400, message: "restaurant is closed on Tuesday"})
  }
  res.locals.reservations = reservation;
  
  next();
}

function reservationTime(req, res, next){
  const reservation = res.locals.reservations;
  const reservationTimeHour = parseInt(reservation.reservation_time.substring(0,2));
  const reservationTimeColon = reservation.reservation_time.substring(2,3);
  const reservationTimeMin = parseInt(reservation.reservation_time.substring(3));
  const currentDate = new Date();//set this current date variable to utc??
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
 if ((!reservationTimeHour && reservationTimeHour > 0) || (reservationTimeColon !== ":") || (!reservationTimeMin && reservationTimeMin > 0)){
  
   next({status: 400, message: "reservation_time invalid"})
 }
 if (((reservationTimeHour === 10) && (reservationTimeMin <= 30)) || reservationTimeHour < 10){
   next({status: 400, message: "time must be during open hours"})
 }
 if (((reservationTimeHour === 21) && (reservationTimeMin >= 30)) || reservationTimeHour > 21){
  next({status: 400, message: "time must be during open hours closing close"})
}
if (res.locals.equalDates === true){
  if ((reservationTimeHour < currentHour) ||((reservationTimeHour === currentHour) && (reservationTimeMin < currentMinutes))){
     next({status: 400, message: "time and date must be future"});
  }
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

function status(req, res, next){
  const reservation = res.locals.reservations;
  if (reservation.status === "seated" || reservation.status === "finished"){
    next({status: 400, message: `status cannot be ${reservation.status}`})
  }
  next();
  
}
//---------------------------updateStatus-------------------------------------

async function validateReservationId(req, res, next){
  const reservationId = req.params.reservation_id;
  const reservation = await reservationsService.read(reservationId);
  if (!reservation){
    next({status: 404, message: `invalid reservation_id: ${reservationId}`});
  }
  res.locals.reservation = reservation;
  next();
};

function unknownStatus(req, res, next){
  const data = req.body.data;
  const status = data.status;
  if (status === "unknown"){
    next({status: 400, message: `unknown status`});
  };
  res.locals.data = data;
  res.locals.status = status;
  next();
};

function finishedStatus(req, res, next){
  const reservation = res.locals.reservation;
  if (reservation.status === "finished"){
    next({status: 400, message: `current status cannot be finished`});
  }
    next();
}

// async function validatePreviousFetch(req, res, next){
//   const reservation = res.locals.reservation;
//   const reservationId = reservation.reservation_id;
//   const status = reservation.status;//needs to be checking 
//   const table = await reservationsService.readTables(reservationId);
//   const tableOccupied = table[0];
  
//   if ((status === "seated") && !tableOccupied){
   
//     next({status: 400, message: 'Current status of reservation is seated yet no table is associated.'})
//   }
//   if ((status === "finished") && tableOccupied){
//     next({status: 400, message: 'table is occupied yet reservation is finished.'})
//   }
//   if ((status === "booked") && tableOccupied){
//     next({status: 400, message: 'current status for reservation is booked yet reservation is associated with a table'})
//   }
//   if ((status === 'canceled') && tableOccupied){
//     next({status: 400, message: 'current status for reservation is canceled yet reservation is associated with table'})
//   }
//   next();
// }

//-------------------------------update----------------------------------------
async function validReservation(req, res, next){
const reservationId = req.params.reservation_id;
const reservation = await reservationsService.read(reservationId);
if (!reservation) {
next({status: 404, message: `reservation ${reservationId} doesn't exist`})
}
res.locals.reservationId = reservationId;
next();

}
//--------------------------main query loaders--------------------------------------
async function list(req, res) {
  const date = req.query.date;
  const mobileNumber = req.query.mobile_number;
  if (date){
  const response = await reservationsService.listByDate(date);
  res.json({data: response })
  }
  if (mobileNumber){
    const response = await reservationsService.listByNumber(mobileNumber)
    res.json({data: response})
  }
}

async function create(req, res) {
   const newReservationData = res.locals.reservations;
   const response = await reservationsService.create(newReservationData);
   console.log(response, 'response in create reservaitno')
  if (response[0]) res.status(201).json({ data: response[0] });
}

async function read(req, res, next){
  const reservationId = req.params.reservation_id;
  const reservation = await reservationsService.read(reservationId);
  if (!reservation) {
    next({status: 404, message: `invalid reservation_id: ${reservationId}`})
  }
  res.json({data: reservation});
}

async function updateStatus(req, res){
  const reservationId = res.locals.reservation.reservation_id;
  const status = res.locals.status;
  if ((status === 'finished') || (status === 'cancelled')){
  await reservationsService.removeTableAssociation(reservationId);
  }
  const response = await reservationsService.updateStatus(reservationId, status);
  res.json({data: {status: response }});
}


async function update(req, res){
  const reservationId = res.locals.reservationId;
  const reservation = res.locals.reservations;
  const response = await reservationsService.update(reservationId, reservation);
  console.log(response[0], 'update response')
  res.json({ data: response[0] });

}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasProperties, firstName, lastName, mobileNumber, reservationDate, validateFutureDate, validateNotTuesday, reservationTime, people, status, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(read)],
  updateStatus: [asyncErrorBoundary(validateReservationId), unknownStatus, finishedStatus, asyncErrorBoundary(updateStatus)],
  update: [asyncErrorBoundary(validReservation), hasData, hasProperties, firstName, lastName, mobileNumber, reservationDate, validateFutureDate, validateNotTuesday, reservationTime, people, status, asyncErrorBoundary(update)]
};
