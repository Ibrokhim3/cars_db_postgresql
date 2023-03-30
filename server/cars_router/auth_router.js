import { Router } from "express";
import { AuthCtr } from "../cars_controller/auth_controller.js";
import { userValidateMiddle } from "../middlewares/user_middlewares.js";

const router = Router();

router.post("/register", userValidateMiddle, AuthCtr.REGISTER);
router.post("/login", AuthCtr.LOGIN);
router.get("/get_users", AuthCtr.GET_USERS);
router.get("/get_one_user/:id", AuthCtr.GET_ONE_USER);
router.get("/logout", AuthCtr.LOGOUT);

export default router;
