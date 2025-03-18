// import { json } from "express";
import { json } from "stream/consumers";
import userModel from "../models/user.models.js";

const register = async (req, res) => {
  try {
    const user = new userModel(req.body);
    const registerUser = await user.save();

    if (registerUser) {
      res.status(200).json({
        message: `login sucessfully ${registerUser}`,
        redirectUrl: "/account/login",
      });
    } else {
      console.log("Can't find User credential..");
      res.status(404).json({ error: "Can't find User Credential.." });
    }
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ error: `Can not SignedIn, ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Use identifier instead of email
    let user;
    // Find the user by username, email, or phoneno
    const phoneNo = Number(identifier);
    if (!isNaN(phoneNo)) {
      user = await userModel.findOne({ phoneno: phoneNo });
    } else {
      user = await userModel.findOne({
        $or: [{ userName: identifier }, { email: identifier }],
      });
    }

    if (!user) return res.status(401).json({ message: "Creds not varified." });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(401).json({ message: "Incorrect Creds" });

    // res.status(200).json({ message: "Login successfully :)" });

    const accessToken = user.jwtAccessToken();
    const refreshToken = user.jwtRefreshToken();

    if (accessToken && refreshToken) {
      const updateAccessToken = await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
      });
      if (!updateAccessToken) return res.status(404).end();
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          // maxAge: "1d",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Login successfully :)",
          refreshToken,
          accessToken,
          // redirectUrl: "/",
        });
    } else {
      res.status(500).json({ error: "Token generation failed" });
    }
  } catch (error) {
    res.status(500).json({ error: `It's not you, its us... ${error}` });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user);
    await userModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken: null,
        },
      },
      { new: true }
    );

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ message: "Logout" });
  } catch (error) {
    console.error(error);
    json.status(500).json({ error: `Not working, ${error}` });
  }
};
export { register, login, logout };
