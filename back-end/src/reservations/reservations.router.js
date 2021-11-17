/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */




const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:reservation_id").get(controller.read).put(controller.update);
router.route("/:reservation_id/status").put(controller.updateStatus);
module.exports = router;
