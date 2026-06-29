import httpStatus from "http-status";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import jwt from "jsonwebtoken";

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please provide email and password."
    });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id, user.role, res);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    next(e); // pass to errorMiddleware.js instead of handling inline
  }
};

const register = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please provide all required fields."
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "Student"
    });

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "User registered successfully.",
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (e) {
    next(e);
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export { login, register };