import express from "express";
import controller from "../controllers/Order";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.post("/create", ValidateSchemas(Schemas.order.create), controller.createOrder);
router.get("/get/:orderId", controller.getOrder);
router.get("/get", controller.getOrders);
router.patch("/update/:orderId", ValidateSchemas(Schemas.order.update), controller.updateOrder);
router.delete("/delete/:orderId", controller.deleteOrder);

export = router;
