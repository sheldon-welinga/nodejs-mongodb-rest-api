const express = require("express");
const router = express.Router();

//Auth middleware
const checkAuth = require("../middleware/check-auth");

//Order controller
const OrdersController = require("../controllers/orders.controller");

router.get("/", checkAuth, OrdersController.orders_get_all);
router.get("/:orderId", checkAuth, OrdersController.orders_get_single);
router.post("/", checkAuth, OrdersController.orders_create_order);
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_one);


module.exports = router;