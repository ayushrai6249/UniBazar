
import express from 'express';
import { getAllUsers, deleteUserById, getAllItems, toggleItemApproval, toggleUserRole } from '../controllers/adminController.js';
import { authUser, isAdmin, isManagerOrAdmin } from '../middleware/authUser.js';


const adminRouter = express.Router();

adminRouter.get('/users', authUser, isAdmin, getAllUsers);
adminRouter.delete('/user/:id', authUser, isAdmin, deleteUserById);
adminRouter.get('/items', authUser, isManagerOrAdmin, getAllItems);
adminRouter.patch("/item/toggle-approval/:itemId", authUser, isManagerOrAdmin, toggleItemApproval);
adminRouter.patch("/user/role/:id", authUser, isAdmin, toggleUserRole);

export default adminRouter;
