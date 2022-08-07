import express from "express";
import controller from "../controllers/Auth";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";
import VerifyJWT from "../middleware/VerifyJWT";

const router = express.Router();

router.post("/validate", VerifyJWT, controller.validateToken);
router.post("/register", ValidateSchemas(Schemas.auth.register), controller.register);
router.post("/login", ValidateSchemas(Schemas.auth.login), controller.login);
router.get("/logout", controller.logout);
router.get("/refreshToken", controller.refreshToken);

export = router;
