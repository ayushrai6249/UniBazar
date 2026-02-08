import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: false },
     date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});   

const Message = mongoose.model("Message", messageSchema);

export default Message;