import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
// getting user data 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("Listings")
      .populate("orders");
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

export const toggleUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    if (!["admin", "user", "manager"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// deleting the user 
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Item.deleteMany({ owner: userId });

    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// getting all the items of the users

export const getAllItems = async (req, res) => {
  try {
    const allItems = await Item.find()
      .populate('owner', 'name email')
      .populate('buyer', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      message: "Items fetched successfully",
      allItems,
    });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};
// approving the item
export const toggleItemApproval = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }


    item.approved = !item.approved;
    await item.save();

    res.json({
      success: true,
      message: `Item approval status changed to ${item.approved}`,
      item,
    });
  } catch (error) {
    console.error("Error toggling approval status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle approval status",
      error: error.message,
    });
  }
};
