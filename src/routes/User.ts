import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";
import ExtractJWT from "../middleware/ExtractJWT";

const router = express.Router();

router.post("/validate", ExtractJWT, controller.validateToken);
router.post("/register", ValidateSchemas(Schemas.user.create), controller.register);
router.post("/login", controller.login);
router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.patch("/update/:userId", ValidateSchemas(Schemas.user.create), controller.updateUser);
router.delete("/delete/:userId", controller.deleteUser);

export = router;
