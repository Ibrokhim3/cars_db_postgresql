import { Router } from "express";
import { carsCtr } from "../cars_controller/company_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { companyValidMiddle } from "../middlewares/cars_middleware.js";

const router = Router();

//token va validation vatinchalik qoshilmidi

router.get("/companies_list", carsCtr.GET_COMPANY);
router.get("/single_company/:id", carsCtr.GET_ONE_COMPANY);
router.post(
  "/adding_company",
  verifyToken,
  companyValidMiddle,
  carsCtr.CREATE_COMPANY
);
router.post("/adding_company_user", carsCtr.ADD_USERS);
router.put("/update_company/:id", carsCtr.UPDATE_COMPANY); //token va validation vatinchalik qoshilmidi
router.delete("/delete_company/:id", carsCtr.DELETE_COMPANY);

export default router;
