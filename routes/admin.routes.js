import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/admin.controllers.js";
import upload from "../utils/multer.js";

const routes = Router();

routes.get("/", getProduct);
routes.post("/", upload.single("productImage"), addProduct);
routes.get("/:id", getSingleProduct);
routes.delete("/:id", deleteProduct);
routes.patch("/:id", upload.single("productImage"), updateProduct);

export default routes;
