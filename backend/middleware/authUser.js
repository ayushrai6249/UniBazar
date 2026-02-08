// authUser.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";

// Authenticate user and attach userId to request
export const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login again." });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id; // keep userId for later queries
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Check admin by fetching latest role from DB
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Access denied" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isManagerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "manager") next();
    else res.status(403).json({ message: "Access denied" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//  Check item ownership
export const isOwner = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    if (item.owner.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: Not the owner of this item" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
