import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    old: { type: String, default: "Not specified" },
    date: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    aiapproved: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: { type: String, required: true },
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",

    }]
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
