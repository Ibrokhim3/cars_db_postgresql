import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./cars_router/auth_router.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/cars", authRouter);

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
