import Router from "express";
import { carsCtr } from "../cars_controller/cars_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { carsValidMiddle } from "../middlewares/company_middleware.js";

const router = Router();

router.get("/cars_list", carsCtr.GET_CARS);
router.get("/cars_list/:id", carsCtr.GET_ONE_CAR);
router.get("/cars_list_by_admin", verifyToken, carsCtr.GET_CARS_BY_ADMIN);
router.get("/one_car_by_admin/:id", verifyToken, carsCtr.GET_ONE_CAR_BY_ADMIN);
router.post("/add_car", verifyToken, carsValidMiddle, carsCtr.CREATE_CAR);
router.put("/update_car/:id", verifyToken, carsValidMiddle, carsCtr.UPDATE_CAR);
router.delete("/delete_car/:id", verifyToken, carsCtr.DELETE_CAR);
router.delete("/delete_car_bool/:id", verifyToken, carsCtr.DELETE_CAR_BOOL);

export default router;
