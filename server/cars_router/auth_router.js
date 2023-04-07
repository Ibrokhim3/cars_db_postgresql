import { Router } from "express";
import { AuthCtr } from "../cars_controller/auth_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { userValidateMiddle } from "../middlewares/user_middlewares.js";

const router = Router();

router.post("/register", userValidateMiddle, AuthCtr.REGISTER);
router.post("/login", AuthCtr.LOGIN);

router.post("/logout", verifyToken, AuthCtr.LOGOUT);

export default router;
