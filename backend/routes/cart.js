import express from "express";
import { VerifyToken } from "../jsonwebtoken/VerifyToken.js";
import User from "../models/User.js";
import Dish from "../models/dishes.js";
import dish from "../models/dishes.js";

const router = express.Router();

// Adding an item to cart
router.post("/cart/add/:id", VerifyToken, async (req, res) => {
  try {
    const user = req.user;

    const currUser = await User.findById(user.id);
    if (!currUser) {
      return res.status(404).json("Not authorized to add to cart");
    }

    const dishId = req.params.id; // Accessing the dish ID from the URL params
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json("Dish not found");
    }

    const inCart = currUser.cart.find((item) => item.dish.toString() === dishId);

    if (inCart) {
      return res.status(400).json({ message: "Dish already in cart", user: currUser });
    }

    const finalPrice = parseInt(req.headers["final-price"]);
    if (isNaN(finalPrice)) {
      return res.status(400).json({ message: `Invalid final price ${JSON.stringify(finalPrice)}` });
    }
    
    const quantity = parseInt(req.headers["quantity"]) || 1;
    const cartItem = {
      dish: dishId, // Save the ObjectId reference
      finalPrice: finalPrice,
      quantity: quantity,
    };

    currUser.cart.push(cartItem);
    await currUser.save();

    return res.status(200).json({ message: "Dish added to cart", user: currUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Removing an item from cart
router.post("/cart/remove/:id", VerifyToken, async (req, res) => {
  try {
    const user = req.user;

    const currUser = await User.findById(user.id);
    if (!currUser) {
      return res.status(404).json("Not authorized to remove from cart");
    }

    const dishId = req.params.id;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json("Dish not found");
    }

    const inCart = currUser.cart.find((item) => item.dish.toString() === dishId);

    if (!inCart) {
      return res.status(400).json({ message: "Dish not in cart", user: currUser });
    }

    currUser.cart = currUser.cart.filter((item) => item.dish.toString() !== dishId);
    await currUser.save();

    return res.status(200).json({ message: "Dish removed from cart", user: currUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Getting all cart items
router.get("/cart", VerifyToken, async (req, res) => {
  try {
    const user = req.user;

    // Find the current user
    const currUser = await User.findById(user.id);

    if (!currUser) {
      return res.status(400).json({ message: "User not found. Please login or signup first" });
    }

    // Create an array of promises to fetch dish details for each cart item
    const cartWithDetails = await Promise.all(
      currUser.cart.map(async (item) => {
        const dishDetails = await Dish.findById(item.dish);
        return {
          dish: {
            id: dishDetails._id,
            name: dishDetails.name,
            description: dishDetails.description,
            img: dishDetails.img,
            options: dishDetails.options,
            category: dishDetails.CategoryName, // Make sure this matches your schema
          },
          finalPrice: item.finalPrice,
          quantity: item.quantity,
        };
      })
    );

    return res.status(200).json(cartWithDetails);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



export default router;
