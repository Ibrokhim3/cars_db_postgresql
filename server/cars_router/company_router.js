import { Router } from "express";
import { comCtr } from "../cars_controller/company_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { companyValidMiddle } from "../middlewares/company_middleware.js";
import { userValidateMiddle } from "../middlewares/user_middlewares.js";

const router = Router();

router.get("/companies_list", comCtr.GET_COMPANY);
router.get("/single_company/:id", comCtr.GET_ONE_COMPANY);
router.post(
  "/adding_company",
  verifyToken,
  companyValidMiddle,
  comCtr.CREATE_COMPANY
);

router.put(
  "/update_company/:id",
  verifyToken,
  companyValidMiddle,
  comCtr.UPDATE_COMPANY
);
router.delete(
  "/delete_company_bool/:id",
  verifyToken,
  comCtr.DELETE_COMPANY_BOOL
);
router.delete("/delete_company/:id", verifyToken, comCtr.DELETE_COMPANY);

router.post(
  "/adding_company_user",
  verifyToken,
  userValidateMiddle,
  comCtr.ADD_USERS
);
router.get("/get_company_users", verifyToken, comCtr.GET_USERS);
router.get("/get_one_company_user/:id", verifyToken, comCtr.GET_ONE_USER);
router.put(
  "/update_company_user/:id",
  userValidateMiddle,
  verifyToken,
  comCtr.UPDATE_USER
);
router.delete("/delete_user_bool/:id", verifyToken, comCtr.DELETE_USER_BOOL);

export default router;
