/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("./errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  res.json({ data: await reservationsService.list(date) });
}



//todo: add validation middleware for create and list based on critera. 
//...400 code and message.
async function create(req, res) {
   const newReservationData = req.body.data;
   const postResponse = await reservationsService.create(newReservationData);
   res.json({data: postResponse})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)]
};
