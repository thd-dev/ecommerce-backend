import { Router } from "express";
import {
  addItemToCart,
  dispatchToOrderHistory,
  getCartItem,
} from "../controllers/order.controllers.js";
import verifyJWT from "../utils/verifyJWT.js";

const router = Router();

router.put("/", verifyJWT, addItemToCart);
router.post("/dispatch", verifyJWT, dispatchToOrderHistory);
router.get("/", verifyJWT, getCartItem);

export default router;
