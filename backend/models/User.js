import mongoose from "mongoose";

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the dish
    ref: 'dish', // Reference the Dish model
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1, // Optional: Track the quantity of this item in the cart
  },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dish',
    },
  ],
  cart: [cartItemSchema], // Cart now stores array of cart items
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
