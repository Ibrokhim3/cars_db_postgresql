import { Router } from "express";
import customsCtr from "../cars_controller/customers_controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/get_all_customers", customsCtr.GET_ALL_CUSTOMERS);
router.get("/get_one_customer/:id", customsCtr.GET_ONE_CUSTOMER);
router.post("/add_customer", verifyToken, customsCtr.CREATE_CUSTOMER);
router.delete("/delete_customer/:id", verifyToken, customsCtr.DELETE_CUSTOMER);
router.delete(
  "/delete_customer_bool/:id",
  verifyToken,
  customsCtr.DELETE_CUSTOMER_BOOL
);

export default router;
