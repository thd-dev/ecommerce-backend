import { Router } from "express";
import { register, login, logout } from "../controllers/user.controllers.js";
import verifyJWT from "../utils/verifyJWT.js";

const routes = Router();

routes.post("/signin", register);
routes.post("/login", login);
routes.post("/logout", verifyJWT, logout);
routes.get("/", verifyJWT, (req, res) => {
  res.status(200).json({ message: "Welcome!", user: req.user });
});

export default routes;
