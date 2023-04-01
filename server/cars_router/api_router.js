import { Router } from "express";
import { apiCtr } from "../cars_controller/api_controllers.js";

const router = Router();

router.get("/session_info/:id", apiCtr.GET_SESSION_INFO);
router.get("/company_users_info/:id", apiCtr.GET_USER_INFO_BY_COMPANY);
router.get("/cars_info/:id", apiCtr.GET_CAR_INFO);
router.get("/email_info/:id", apiCtr.GET_EMAIL_INFO);
router.get("/car_title/:id", apiCtr.GET_CAR_TITLE);

export default router;
