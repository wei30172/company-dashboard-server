import express from "express";
import { register, login, logout, refreshToken } from "../controllers/Auth/index";
import { Schemas, ValidateSchemas } from "../middleware/ValidateSchemas";

const router = express.Router();

router.post("/register", ValidateSchemas(Schemas.auth.register), register);
router.post("/login", ValidateSchemas(Schemas.auth.login), login);
router.get("/logout", logout);
router.get("/refreshToken", refreshToken);

export = router;
