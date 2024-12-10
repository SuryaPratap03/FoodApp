import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateToken } from "../jsonwebtoken/CreateToken.js";
import { VerifyToken } from "../jsonwebtoken/VerifyToken.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const curruser = await User.findOne({ email });
    if (curruser) {
      return res.status(401).json("Email Already Exists");
    }
    const currusername = await User.findOne({ username });
    if (currusername) {
      return res.status(401).json("Username Already Exists");
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new User({ username, email, password: hashedpassword });
    await newuser.save();
    const token = await CreateToken({ id: newuser._id });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Required for cross-origin requests
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return res.status(201).json({ status: "success", newuser });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const curruser = await User.findOne({ email });

    if (!curruser) {
      return res.status(404).json("Enter valid credentials");
    }

    const passcheck = await bcrypt.compare(password, curruser.password);
    if (!passcheck) {
      return res.status(400).json("Enter Valid Credentials");
    }

    const token = await CreateToken({ id: curruser._id });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Required for cross-origin requests
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return res.status(201).json({ status: "success", user: curruser });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});

// Edit User Route
router.put("/edituser", VerifyToken, async (req, res) => {
  try {
    const user = req.user;
    const curruser = await User.findById(user.id);
    if (!curruser) {
      return res.status(404).json({
        message: "Login and Signup first. You are not authorized.",
      });
    }

    const body = req.body;
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updateduser = await User.findByIdAndUpdate(
      curruser.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Updated Successfully",
      user: updateduser,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Logout Route
router.delete("/logout", VerifyToken, async (req, res) => {
  try {
    const user = req.user;
    const curruser = await User.findById(user.id);
    if (!curruser) {
      return res.status(400).json({ message: "Login and Signup First" });
    }

    res.clearCookie("token", {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Ensures the cookie is only cleared over HTTPS
      sameSite: "None", // Required for cross-origin requests
    });

    return res.status(201).json({ status: "Successfully Logged Out" });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});

// Get User Route
router.get("/user", VerifyToken, async (req, res) => {
  try {
    const user = req.user;
    const curruser = await User.findById(user.id);
    if (!curruser) {
      return res.status(400).json({ message: "Login and Signup First" });
    }
    return res.status(200).json(curruser);
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});

export default router;
