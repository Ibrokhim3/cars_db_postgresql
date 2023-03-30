import { Router } from "express";
import customsCtr from "../cars_controller/customers_controller.js";

const router = Router();

router.get("/get_all_customers", customsCtr.GET_ALL_CUSTOMERS);
router.get("/get_one_customer/:id", customsCtr.GET_ONE_CUTOMER);
router.post("/add_customer", customsCtr.CREATE_CUSTOMER);

export default router;
