import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 5,
    },
    lname: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      minlength: 5,
    },
    phoneno: {
      type: Number,
      trim: true,
      default: 0,
      validator: (v) => {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props} is not a valid phone number`,
      required: [true, "Phone no. is required"],
      unique: [true, "This phone number has already been used."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
      unique: true,
      validator: (v) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
    gender: {
      type: String,
      default: "notprefer",
      enum: ["female", "male", "notprefer"],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
    },
    dob: {
      type: Date,
      // default: Date.now(),
    },
    userName: {
      type: String,
      // required: true,
      default: Math.random() * 1000000,
      lowercase: true,
      trim: true,
      unique: [true, "Invalid..."],
      // minlength: 7,
    },
    refreshToken: {
      type: String,
      // required: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
      default: "User",
      enum: ["Admin", "User"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.jwtAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      password: this.password,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};
userSchema.methods.jwtRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
const userModel = model("User", userSchema);

export default userModel;

/*
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
*/
