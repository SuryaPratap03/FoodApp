import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateToken } from "../jsonwebtoken/CreateToken.js";
import { VerifyToken } from "../jsonwebtoken/VerifyToken.js";

const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = await req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new User({ username, email, password: hashedpassword });
    await newuser.save();
    const token = await CreateToken({ id: newuser._id });
    res.cookie("token", token, {
      httpOnly: true,  // Prevents client-side access to the cookie
      maxAge: 3600000, // 1 hour
    });
    return res.status(201).json({ status: "success", newuser: newuser });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

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
    res.cookie("token", token);
    return res.status(201).json({ status: "success", user: curruser });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});

router.put("/edituser", VerifyToken, async (req, res) => {
  try {
    const user = await req.user;
    const curruser = await User.findById(user.id);
    if (!curruser) {
      return res
        .status(404)
        .json({ message: "Login and Signup first . You are not authorised" });
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

    return res
      .status(200)
      .json({ message: " Upadted Succesfully ", user: updateduser });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete("/logout",VerifyToken, async (req, res) => {
    try {
      const user = await req.user;
      const curruser = await User.findById(user.id);
      if(!curruser){
        return res.status(400).json({message : 'Login And Signup First'});
      }
      res.clearCookie('token');
      return res.status(201).json({ status: "Successfully Logged Out"});
    } catch (error){
      console.log(error.message);
      return res.status(401).json({ error: error.message });
    }
});

router.get("/user",VerifyToken, async (req, res) => {
  try {
    const user = await req.user;
    const curruser = await User.findById(user.id);
    if(!curruser){
      return res.status(400).json({message : 'Login And Signup First'});
    }
    return res.status(200).json(curruser);
  } catch (error){
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});
export default router;
