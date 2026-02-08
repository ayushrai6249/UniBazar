import express from 'express';
import { addItem, registerUser, loginUser, loadProfileData, loadUserData, handleItemClick, updateProfile, addInWishlist, getItemsInWishlist, removeItemsFromWishlist } from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js'
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/add-listing', authUser, upload.single('image'), addItem);
userRouter.get('/user-data', authUser, loadUserData);
userRouter.get('/profile/:profileId', loadProfileData);
userRouter.get("/view/:itemId", authUser, handleItemClick);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/add-wishlist', authUser, addInWishlist);
userRouter.get('/get-wishlist', authUser, getItemsInWishlist);
userRouter.post('/remove-wishlist', authUser, removeItemsFromWishlist);

export default userRouter;