import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser("YourSecretString"));

app.use(express.static("public"));

import Admin from "./routes/admin.routes.js";
import User from "./routes/user.routes.js";
import Order from "./routes/order.routes.js";

app.use("/api/v1/admin", Admin);
app.use("/api/v1/user", User);
app.use("/api/v1/order", Order);

// app.get("/", (req, res) => {
//   return res.send("hello");
// });
import connectDB from "./utils/db.js";

connectDB();

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
