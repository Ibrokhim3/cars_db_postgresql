import Router from "express";
import { carsCtr } from "../cars_controller/cars_controller.js";

const router = Router();

router.get("/cars_list", carsCtr.GET_CARS);
router.get("/cars_list/:id", carsCtr.GET_ONE_CAR);
router.post("/add_car", carsCtr.CREATE_CAR);
router.put("/update_car/:id", carsCtr.UPDATE_CAR);
router.delete("/delete_car/:id", carsCtr.DELETE_CAR);

export default router;
