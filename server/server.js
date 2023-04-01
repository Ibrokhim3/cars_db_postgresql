import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./cars_router/auth_router.js";
import companyRouter from "./cars_router/company_router.js";
import carsRouter from "./cars_router/cars_router.js";
import customsRouter from "./cars_router/customers_router.js";
import apiRouter from "./cars_router/api_router.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", authRouter);
app.use("/company", companyRouter);
app.use("/cars", carsRouter);
app.use("/customers", customsRouter);
app.use("/info", apiRouter);

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
