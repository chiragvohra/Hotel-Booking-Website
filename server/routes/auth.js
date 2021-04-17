import express from "express";

const router = express.Router();

import { requireSignin } from "../middleware/index.js";
import { updateProfile } from "../controllers/auth.js";
// controllers
import { register, login } from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", login);

router.put("/profile", requireSignin, updateProfile);

export default router;
