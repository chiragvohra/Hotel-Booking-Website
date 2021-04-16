import express from "express";

const router = express.Router();

import { requireSignin } from "../middleware";
import { updateProfile } from "../controllers/auth";
// controllers
import { register, login } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);

router.put("/profile", requireSignin, updateProfile);

export default router;
