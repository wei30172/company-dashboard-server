import express from "express";
import controller from "../controllers/User";
// import { Schemas, ValidateJoi } from "../middleware/Joi";

const router = express.Router();

router.post("/create", controller.createUser); // ValidateJoi(Schemas.user.create),
router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.patch("/update/:userId", controller.updateUser); // ValidateJoi(Schemas.user.update),
router.delete("/delete/:userId", controller.deleteUser);

export = router;
