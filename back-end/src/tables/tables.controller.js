const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function hasData(req, res, next){
  console.log('ttest in has data')
  const table = req.body.data;
  if (!table) next({status: 400, message: 'missing data'});
  res.locals.table = table;
  next();
}
//create validations-------
function hasPropertiesCreate(req, res, next){
  const newTable = res.locals.table;
  const properties = Object.keys(newTable)
  const requiredProperties = ["table_name", "capacity"]
  for (let i = 0; i < requiredProperties.length; i++){
    if (!properties.includes(requiredProperties[i])){
      next({status: 400, message: `missing property: ${requiredProperties[i]}`})
    }
  }
  res.locals.table = newTable;
  next();
}

function capacity(req, res, next){
  const newTable = res.locals.table;
  const capacity = newTable.capacity;
  if (typeof capacity !== "number"){
    next({status: 400, message: 'capacity must be a number'})
  }
  if (capacity === 0){
    next({status: 400, message: 'capacity cannot be 0'})
  }
  res.locals.table = newTable;
  next();
}

   
function tableName(req, res, next){
  const newTable = res.locals.table;
  const tableName = newTable.table_name;
  if (tableName.length <= 1){
    next({status: 400, message: 'table_name must be more than 1 character'})
  }
  res.locals.table = newTable;
  next();
}


//update validations---------------------------------------
function hasPropertiesUpdate(req, res, next){
  console.log('test i has properties update')
  const tableUpdate = res.locals.table;
  const properties = Object.keys(tableUpdate)
  const requiredProperties = ["reservation_id"]
  for (let i = 0; i < requiredProperties.length; i++){
    if (!properties.includes(requiredProperties[i])){
      next({status: 400, message: `missing property: ${requiredProperties[i]}`})
    }
  }
  res.locals.table = tableUpdate;
  next();
}

async function tableNotOccupied(req, res, next){
  console.log('test in table not occupied')
  const updateObject = res.locals.table;
  const tableId = req.params.table_id;
  const table = await tablesService.readTable(tableId);
 console.log(table, 'table occupied test')
  if (table[0].reservation_id){
    next({status: 400, message: "table cannot be occupied must be free"})
  }
  res.locals.table = updateObject;
  res.locals.specificTable = table;
  next();
}

// async function validReservation(req, res, next){
//   console.log('test in valid reservation')
// //pass reservation in locals after load
// const updateObject = res.locals.table;
// const reservationId = updateObject.reservation_id;
// const reservation = await tablesService.readReservation(reservationId);
// console.log(reservation, 'reservation return')
// if (reservation.length === 0){
// next({status: 404, message: `invalid reservation ${reservationId}doesnt exist`})
// }
// res.locals.table = updateObject;
// res.locals.reservation = reservation;
// next();
// }


// async function capacityValidationUpdate(req, res, next){
//   console.log('test in capactiy validationupdate')
// const updateObject = res.locals.table;
// const reservation = res.locals.reservation;
// const reservationSize = reservation.people;
// const tableId = req.params.table_id;
// const table = await tablesService.readTable(tableId);
// const tableCapacity = table[0].capacity;
// if (tableCapacity < reservationSize){
//   next({status: 400, message: 'table capacity cant be less than reservation size '})
// }
// res.locals.table = updateObject;
// res.locals.specificTable = table;
// next();
// }

//----------------------------------------------------------------

async function list(req, res) {
  const response = await tablesService.list();
  res.json({ data: response});
}

async function create(req, res) {
   const newTable = res.locals.table;
   const response = await tablesService.create(newTable);
   res.status(201).json({ data: response[0] });
}

async function update(req, res){
  console.log('test in update')
 const tableId = req.params.table_id;
 const data = req.body.data;
 console.log('updated table,', data)
 const response = await tablesService.update(data, tableId);
 res.json({ data: response });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasPropertiesCreate, capacity, tableName, asyncErrorBoundary(create)],
  update: [hasData, hasPropertiesUpdate, asyncErrorBoundary(tableNotOccupied), asyncErrorBoundary(update)]
};
