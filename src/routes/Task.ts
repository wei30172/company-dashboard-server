import express from "express";
import controller from "../controllers/Task";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.post("/create", ValidateSchemas(Schemas.task.create), controller.createTask);
router.get("/get/:taskId", controller.getTask);
router.get("/get", controller.getTasks);
router.patch("/update/:taskId", ValidateSchemas(Schemas.task.update), controller.updateTask);
router.delete("/delete/:taskId", controller.deleteTask);

export = router;
