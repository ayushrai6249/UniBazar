import { success } from 'zod';
import Item from '../models/itemModel.js';
import User from '../models/userModel.js';
import jwt from "jsonwebtoken";

//    GET SINGLE ITEM INFO
const getItemInfo = async (req, res) => {
    try {
        const { itemId } = req.body;
        let userId = null;
        const token = req.headers.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) { }
        }
        const itemInfo = await Item.findById(itemId)
            .populate("owner", "name image");

        if (!itemInfo) {
            return res.json({ success: false, message: "Item Unavailable" });
        }

        if (userId && itemInfo.owner._id.toString() === userId) {
            return res.json({ success: true, itemInfo });
        }
        if (userId) {
            const userInfo = await User.findById(userId);
            if (userInfo.role === "manager" || userInfo.role === "admin") {
                return res.json({ success: true, itemInfo });
            }
        }

        if (itemInfo.approved) {
            return res.json({ success: true, itemInfo });
        }

        return res.json({ success: false, message: "Item Unavailable" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// DELETE USER ITEM
const deleteUserItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.json({ success: false, message: "Item ID required" });
        }
        const item = await Item.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }
        await Item.findByIdAndDelete(itemId);
        res.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



//    LOAD ITEMS OF LOGGED-IN USER
const loadYourItems = async (req, res) => {
    try {
        const userId = req.userId;

        const allItems = await Item.find({ owner: userId })
            .populate("owner", "name avatar")
            .sort({ date: -1 });

        if (!allItems.length) {
            return res.json({ success: false, message: "Cannot load Items" });
        }

        res.json({ success: true, allItems });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


//    LOAD RECENT APPROVED ITEMS
const loadRecentItems = async (req, res) => {
    try {
        let filter = { approved: true };
        if (req.userId) {
            const user = await User.findById(req.userId);

            if (user?.collegeId) {
                filter.collegeId = user.collegeId;
            }
        }
        const recentItems = await Item.find(filter)
            .populate("owner", "name image")//avatar
            .sort({ views: -1 });
        res.json({ success: true, recentItems });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


//    TOGGLE ITEM AVAILABILITY
const toggleItemUnavailable = async (req, res) => {
    try {
        const { itemId } = req.body;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        item.available = !item.available;
        await item.save();

        res.json({ success: true, message: "Availability changed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




export {
    loadYourItems,
    toggleItemUnavailable,
    loadRecentItems,
    getItemInfo,
    deleteUserItem,
};
