import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.patch("/update/:userId", ValidateSchemas(Schemas.user.update), controller.updateUser);
router.delete("/delete/:userId", controller.deleteUser);

export = router;
