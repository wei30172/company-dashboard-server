import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";
import VerifyRoles from "../middleware/VerifyRoles";
import { ROLES } from "../config/rolesList";

const router = express.Router();

router.get("/get", VerifyRoles(ROLES.USER, ROLES.ADMIN, ROLES.EDITOR), controller.getUsers);
router.get("/get/:userId", VerifyRoles(ROLES.USER, ROLES.ADMIN, ROLES.EDITOR), controller.getUser);
router.patch("/update/:userId", VerifyRoles(ROLES.ADMIN, ROLES.EDITOR), ValidateSchemas(Schemas.user.update), controller.updateUser);
router.delete("/delete/:userId", VerifyRoles(ROLES.ADMIN), controller.deleteUser);

export = router;
