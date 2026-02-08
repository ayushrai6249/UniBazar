import express from 'express';
import { loadYourItems, loadRecentItems, toggleItemUnavailable, getItemInfo } from '../controllers/itemController.js';
import { authUser, isOwner } from '../middleware/authUser.js';

const itemRouter = express.Router();

itemRouter.get('/get-items', authUser, loadYourItems);
itemRouter.get('/approved-items', loadRecentItems);
itemRouter.post('/toggle-availability', authUser, isOwner, toggleItemUnavailable);
itemRouter.post('/get-item-info', getItemInfo);

export default itemRouter;