import { Router } from "express";
import { AuthCtr } from "../cars_controller/auth_controller.js";

const router = Router();

router.post("/register", AuthCtr.REGISTER);
router.post("/login", AuthCtr.LOGIN);

export default router;
