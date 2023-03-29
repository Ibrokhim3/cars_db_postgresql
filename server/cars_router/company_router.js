import { Router } from "express";
import { comCtr } from "../cars_controller/company_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { companyValidMiddle } from "../middlewares/cars_middleware.js";

const router = Router();

//token va validation vatinchalik qoshilmidi

router.get("/companies_list", comCtr.GET_COMPANY);
router.get("/single_company/:id", comCtr.GET_ONE_COMPANY);
router.post(
  "/adding_company",
  verifyToken,
  companyValidMiddle,
  comCtr.CREATE_COMPANY
);
router.post("/adding_company_user", comCtr.ADD_USERS);
router.put("/update_company/:id", comCtr.UPDATE_COMPANY); //token va validation vatinchalik qoshilmidi
router.delete("/delete_company/:id", comCtr.DELETE_COMPANY);

export default router;
