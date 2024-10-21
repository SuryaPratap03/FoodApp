import express from "express";
import { VerifyToken } from "../jsonwebtoken/VerifyToken.js";
import User from "../models/User.js";
import Dish from "../models/dishes.js"; // Use "Dish" with a capital "D" for consistency

const router = express.Router();

// Adding an item to favourites
router.post("/favourites/add/:id", VerifyToken, async (req, res) => {
  try {
    const user = req.user; // Get user from token
    const curruser = await User.findById(user.id);
    
    if (!curruser) {
      return res.status(404).json("Not authorized to add to favourites");
    }
    
    const dishId = req.params.id; // Get dish ID from request parameters
    const dishItem = await Dish.findById(dishId);

    if (!dishItem) {
      return res.status(404).json("Dish not found");
    }

    if (curruser.favourites.includes(dishItem._id)) {
      return res.status(400).json({ message: "Dish already in favourites", user: curruser });
    }

    curruser.favourites.push(dishItem._id); // Add dish to user's favourites
    await curruser.save(); // Save updated user

    return res.status(200).json({ message: "Dish added to favourites", user: curruser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Removing an item from favourites
router.post("/favourites/remove/:id", VerifyToken, async (req, res) => {
  try {
    const user = req.user; // Get user from token
    const curruser = await User.findById(user.id);
    
    if (!curruser) {
      return res.status(404).json("Not authorized to remove from favourites");
    }
    
    const dishId = req.params.id; // Get dish ID from request parameters
    const dishItem = await Dish.findById(dishId);

    if (!dishItem) {
      return res.status(404).json("Dish not found");
    }

    if (!curruser.favourites.includes(dishItem._id)) {
      return res.status(400).json({ message: "Dish is not in favourites", user: curruser });
    }

    curruser.favourites = curruser.favourites.filter(id => !id.equals(dishItem._id)); // Use .equals for ObjectId comparison
    await curruser.save();

    return res.status(200).json({ message: "Dish removed from favourites", user: curruser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Getting all favourites
router.get('/favourites', VerifyToken, async (req, res) => {
  try {
    const user = req.user; // Get user from token
    const curruser = await User.findById(user.id);
    
    if (!curruser) {
      return res.status(400).json({ message: 'User not found. Log in or sign up first' });
    }

    const favDishes = await Dish.find({
      _id: { $in: curruser.favourites } // Fetch dishes that are in the user's favourites
    });

    return res.status(200).json(favDishes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
