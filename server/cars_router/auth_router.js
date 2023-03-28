import { Router } from "express";
import { AuthCtr } from "../cars_controller/auth_controller.js";
import { userValidateMiddle } from "../middlewares/user_middlewares.js";

const router = Router();

router.post("/register", userValidateMiddle, AuthCtr.REGISTER);
router.post("/login", AuthCtr.LOGIN);
router.get("/logout", AuthCtr.LOGOUT);

export default router;
