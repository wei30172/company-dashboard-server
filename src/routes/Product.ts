import express from "express";
import controller from "../controllers/Product";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.post("/create", ValidateSchemas(Schemas.product.create), controller.createProduct);
router.get("/get/:productId", controller.getProduct);
router.get("/get", controller.getProducts);
router.patch("/update/:productId", ValidateSchemas(Schemas.product.create), controller.updateProduct);
router.delete("/delete/:productId", controller.deleteProduct);

export = router;
