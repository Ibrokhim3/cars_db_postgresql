import { Router } from "express";
import { carsCtr } from "../cars_controller/cars_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";

const router = Router();

router.post("/adding_company", verifyToken, carsCtr.CREATE_COMPANY);

export default router
