import express from "express";
import controller from "../controllers/Task";

const router = express.Router();

router.post("/create", controller.createTask);
router.get("/get/:taskId", controller.getTask);
router.get("/get", controller.getTasks);
router.patch("/update/:taskId", controller.updateTask);
router.delete("/delete/:taskId", controller.deleteTask);

export = router;
