const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function hasData(req, res, next){
  const data = req.body.data;
  if (!data) next({status: 400, message: 'missing data'});
  res.locals.data = data;
  next();
}
//create validations-------
function hasPropertiesCreate(req, res, next){
  const data = res.locals.data;
  const properties = Object.keys(data)
  const requiredProperties = ["table_name", "capacity"]
  for (let i = 0; i < requiredProperties.length; i++){
    if (!properties.includes(requiredProperties[i])){
      next({status: 400, message: `missing property: ${requiredProperties[i]}`})
    }
  }
  res.locals.data = data;;
  next();
}

function capacity(req, res, next){
  const data = res.locals.data;
  const capacity = data.capacity;
  if (typeof capacity !== "number"){
    next({status: 400, message: 'capacity must be a number'})
  }
  if (capacity === 0){
    next({status: 400, message: 'capacity cannot be 0'})
  }
  res.locals.data = data;
  next();
}

   
function tableName(req, res, next){
  const data = res.locals.data;
  const tableName = data.table_name;
  if (tableName.length <= 1){
    next({status: 400, message: 'table_name must be more than 1 character'})
  }
  res.locals.data = data;
  next();
}


//update validations---------------------------------------
function hasPropertiesUpdate(req, res, next){
  const data = res.locals.data;
  const properties = Object.keys(data)
  const requiredProperties = ["reservation_id"]
  for (let i = 0; i < requiredProperties.length; i++){
    if (!properties.includes(requiredProperties[i])){
      next({status: 400, message: `missing property: ${requiredProperties[i]}`})
    }
  }
  res.locals.data = data;
  next();
}

async function tableNotOccupied(req, res, next){
  const data = res.locals.data;
  const tableId = req.params.table_id;
  const table = await tablesService.readTable(tableId);
  if (table[0].reservation_id){
    next({status: 400, message: "table cannot be occupied must be free"})
  }
  res.locals.table = table[0];
  res.locals.tableId = tableId;
  next();
}

async function validReservation(req, res, next){
const data = res.locals.data
const table = res.locals.table;
const reservationId = data.reservation_id;
const reservation = await tablesService.readReservation(reservationId);
if (reservation.length === 0){
next({status: 404, message: `invalid reservation ${reservationId}doesnt exist`})
}
res.locals.data = data;
res.locals.reservation = reservation[0];
res.locals.table = table;
next();
}


function capacityUpdate(req, res, next){
const reservation = res.locals.reservation;
const reservationSize = reservation.people;
const table = res.locals.table;
const tableCapacity = table.capacity;
if (tableCapacity < reservationSize){
  next({status: 400, message: 'table capacity cant be less than reservation size '})
}
next();
}

function alreadySeated(req, res, next){
  const reservation = res.locals.reservation;
  if (reservation.status === "seated"){
    next({status: 400, message: `reservation is already seated`})
  }
  next();
}
//----------------------------------------------------------------

//destroy validation----
async function notOccupiedDestroy(req, res, next){
  const tableId = req.params.table_id;
  const table = await tablesService.readTable(tableId);
  if (!table[0]) {
    next({status: 404, message: `table_id: ${tableId} non existent`});
  }
  if (!table[0].reservation_id){
    next({status: 400, message: "not occupied"})
  }
  
  res.locals.tableId = tableId;
  next();
}

//--------------------------------------------------------------
async function list(req, res) {
  const response = await tablesService.list();
  res.json({ data: response});
}

async function create(req, res) {
   const data = res.locals.data
   const response = await tablesService.create(data);
   res.status(201).json({ data: response[0] });
}

async function update(req, res){
 const tableId = res.locals.tableId;
 const data = req.body.data;
 const response = await tablesService.update(data, tableId);
 res.json({ data: response });
}

async function destroy(req, res){
  const tableId = res.locals.tableId;
  const response = await tablesService.destroy(tableId);
  res.json({data: response});
}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasPropertiesCreate, capacity, tableName, asyncErrorBoundary(create)],
  update: [hasData, hasPropertiesUpdate, asyncErrorBoundary(tableNotOccupied), asyncErrorBoundary(validReservation), capacityUpdate, alreadySeated, asyncErrorBoundary(update)],
  destroy: [asyncErrorBoundary(notOccupiedDestroy), asyncErrorBoundary(destroy)]
};
