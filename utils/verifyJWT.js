import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Unauthorized request" });

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel
      .findById(decodedToken?.id)
      .select("-password -refreshToken");

    if (!user) return res.status(402).json({ error: "User not find" });

    req.user = user; //we add user in req
    next();
  } catch (error) {
    res.status(401).json({ error: `Invalid creds, ${error}` });
  }
};

export default verifyJWT;
