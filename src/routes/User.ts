import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.post("/create", ValidateSchemas(Schemas.user.create), controller.createUser);
router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.patch("/update/:userId", ValidateSchemas(Schemas.user.create), controller.updateUser);
router.delete("/delete/:userId", controller.deleteUser);

export = router;
