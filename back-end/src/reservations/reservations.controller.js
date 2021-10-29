/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



//validation
async function dateExists(req, res, next){
  const date = req.query.date;
  const response = await reservationsService.list(date);
  if (response) {
    next()
  }
  else {
    next({ message: "date doesnt exist", status: 400 })
  }
}

//----------------------------------------------------------------

async function list(req, res) {
  let date = req.query.date;
  res.json({ data: await reservationsService.list(date) });
}

async function create(req, res) {
   const newReservationData = req.body;
   console.log("test in create", newReservationData);
   const postResponse = await reservationsService.create(newReservationData);
   console.log("postResponse test in controller create: ", postResponse)
   res.json({data: postResponse})
}

module.exports = {
  list: [asyncErrorBoundary(dateExists), asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)]
};
