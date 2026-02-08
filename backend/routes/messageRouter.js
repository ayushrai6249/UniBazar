import express from "express";
import { authUser, isAdmin } from "../middleware/authUser.js";
import { loadBuyerMsg, loadOwnerMsg, loadUserMsg } from "../controllers/messageController.js";

const msgRouter = express.Router();

msgRouter.post("/buyer", authUser, loadBuyerMsg);
msgRouter.post("/owner", authUser, loadOwnerMsg);
msgRouter.post("/user", authUser, loadUserMsg);

export default msgRouter;
