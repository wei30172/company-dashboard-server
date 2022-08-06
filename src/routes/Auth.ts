import express from "express";
import controller from "../controllers/Auth";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";
import VerifyJWT from "../middleware/VerifyJWT";

const router = express.Router();

router.post("/validate", VerifyJWT, controller.validateToken);
router.post("/register", ValidateSchemas(Schemas.user.create), controller.register);
router.post("/login", controller.login);

export = router;
