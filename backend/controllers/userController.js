import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Item from '../models/itemModel.js';
import cloudinary from "../config/cloudinary.js";
import { z } from 'zod';
import { RegisterSchema } from '../middleware/validateSchema.js';
import dotenv from 'dotenv';
import FormData from "form-data";
dotenv.config();
import axios from "axios";
import College from "../models/collegeModel.js";

// Api to register user
export const registerUser = async (req, res) => {
    try {
        const validatedData = RegisterSchema.parse(req.body);
        const { name, email, password, phone, collegeId } = validatedData;
        const college = await College.findOne(collegeId);
        console.log(req.body);
        if (!college) {
            return res.status(400).json({
                success: false,
                message: "Invalid college selected"
            });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            collegeId: college.id,
            collegeName: college.name
        });
        const savedUser = await newUser.save();
        const tokenPayload = {
            id: savedUser._id,
            role: savedUser.role,
            collegeId: savedUser.collegeId
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(201).json({
            success: true,
            message: "Registered successfully",
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.flatten().fieldErrors
            });
        }
        console.error("REGISTRATION_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                errors: {
                    email: ["User doesn't exist"],
                },
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                errors: {
                    password: ["Wrong password"],
                },
            });
        }
        const token = generateToken(user._id, user.role);
        return res.status(200).json({
            success: true,
            token,
            message: "Login successful",
        });
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



const generateToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET
    );
};


export const addItem = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const { name, category, price, old, description } = req.body;
        const imageFile = req.file;

        if (!name || !category || !price || !old || !description || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Missing details"
            });
        }

        const imageUrl = imageFile.path;
        let isSafe = true;

        //  TEXT MODERATION 
        try {
            const form = new FormData();
            form.append("text", `${name} ${description}`);
            form.append("lang", "en");
            form.append("models", "general,self-harm");
            form.append("mode", "ml");
            form.append("api_user", process.env.SIGHTENGINE_API_USER);
            form.append("api_secret", process.env.SIGHTENGINE_API_SECRET);

            const textRes = await axios.post(
                "https://api.sightengine.com/1.0/text/check.json",
                form,
                { headers: form.getHeaders() }
            );

            const t = textRes.data.moderation_classes || {};

            if (
                (t.sexual || 0) > 0.4 ||
                (t.insulting || 0) > 0.5 ||
                (t.toxic || 0) > 0.5 ||
                (t.discriminatory || 0) > 0.5 ||
                (t.violent || 0) > 0.5 ||
                (t.self_harm || 0) > 0.4
            ) {
                isSafe = false;
            }

        } catch (err) {
            console.log("TEXT AI ERROR:", err.response?.data || err.message);
        }

        console.log("After Text Check:", isSafe);

        //  IMAGE MODERATION 
        try {
            const sightResponse = await axios.get(
                "https://api.sightengine.com/1.0/check.json",
                {
                    params: {
                        url: imageUrl,
                        models: "nudity-2.1,gore-2.0,weapon,recreational_drug,alcohol,tobacco",
                        api_user: process.env.SIGHTENGINE_API_USER,
                        api_secret: process.env.SIGHTENGINE_API_SECRET,
                    },
                }
            );

            const data = sightResponse.data || {};

            if (
                (data.nudity?.raw || 0) > 0.6 ||
                (data.gore?.prob || 0) > 0.4 ||
                (data.weapon?.classes?.firearm || 0) > 0.4 ||
                (data.recreational_drug?.prob || 0) > 0.4 ||
                (data.alcohol?.prob || 0) > 0.5 ||
                (data.tobacco?.prob || 0) > 0.5
            ) {
                isSafe = false;
            }

        } catch (err) {
            console.log("IMAGE AI ERROR:", err.response?.data || err.message);
        }

        console.log("Final isSafe:", isSafe);

        //  SAVE ITEM 
        const newItem = new Item({
            name,
            category,
            price,
            old,
            description,
            image: imageUrl,
            date: new Date().toISOString(),
            owner: userId,
            collegeId: user.collegeId,
            collegeName: user.collegeName,
            aiapproved: isSafe,
            approved: isSafe
        });

        await newItem.save();

        await User.findByIdAndUpdate(userId, {
            $push: { Listings: newItem._id }
        });

        return res.status(200).json({
            success: true,
            message: isSafe
                ? "Item Added and Approved"
                : "Item added but pending approval",
            aiapproved: isSafe
        });

    } catch (error) {
        console.error("ADD ITEM ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// api to load user data
export const loadUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await User.findById(userId);
        if (!userData) {
            res.json({ success: false, message: "User not found" });
        }
        else {
            res.json({ success: true, userData });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}
export const loadProfileData = async (req, res) => {
    try {
        const { profileId } = req.params;
        const profileData = await User.findById(profileId).select(
            "image name email phone address gender dob"
        );
        if (!profileData) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            profileData
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

// exporting the functions
export const handleItemClick = async (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.userId;

    try {
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });


        item.views += 1;
        await item.save();


        if (userId && item.owner.toString() !== userId) {
            const user = await User.findById(userId);
            const category = item.category;

            const currentCount = user.tags.get(category) || 0;
            user.tags.set(category, currentCount + 1);
            await user.save();
        }

        res.status(200).json({ success: true, message: "Item viewed", item });
    } catch (error) {
        console.error("Error updating item view:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// api to update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender, collegeId } = req.body;
        const imageFile = req.file;



        if (!name || !phone || !dob || !gender || !collegeId) {
            return res.json({ success: false, message: "Missing details" });
        }

        const updateFields = { name, phone, address, dob, gender };
        const college = await College.findOne({ id: collegeId });
        if (!college) {
            return res.json({
                success: false,
                message: "Invalid college"
            });
        }
        updateFields.collegeId = college.id;
        updateFields.collegeName = college.name;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
            });
            updateFields.image = imageUpload.secure_url;
        }

        await User.findByIdAndUpdate(userId, updateFields);

        res.json({ success: true, message: "Profile updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.json({ success: false, message: error.message });
    }
};

// api to add item in wishlist
export const addInWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId } = req.body;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }
        if (item.owner.toString() === userId) {
            return res.json({ success: false, message: "You are the owner of the item" });
        }
        // Check if item already exists in wishlist
        const user = await User.findById(userId);
        const alreadyWishlisted = user.wishlist.some(w => w.itemId.toString() === itemId);
        if (alreadyWishlisted) {
            return res.json({ success: false, message: "Item already in wishlist" });
        }
        await User.findByIdAndUpdate(userId, {
            $push: {
                wishlist: {
                    itemId: itemId,
                    addedAt: new Date()
                }
            }
        });

        res.json({ success: true, message: "Added to wishlist" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// api to items in user wishlist
export const getItemsInWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User
            .findById(userId)
            .select("wishlist")
            .populate("wishlist.itemId")
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const itemData = user.wishlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        res.json({ success: true, itemData });

    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// api to remove item from wishlist
export const removeItemsFromWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId } = req.body;

        await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: { itemId: itemId } } }
        );

        res.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};