import Message from "../models/messageModel.js";
import Item from "../models/itemModel.js";

// Load messages for buyer
export const loadBuyerMsg = async (req, res) => {
    try {
        const { itemId, buyerId } = req.body;
        const itemData = await Item.findById(itemId);
        if (!itemData.available) return res.json({ success: false, message: "Item Unavailable" });
        const messages = await Message.find({ itemId, buyer: buyerId })
            .sort({ date: 1 })
            .populate('sender', 'name email')
            .populate('owner', 'name email')
            .populate('buyer', 'name email');

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error loading buyer messages:", error);
        res.status(500).json({ success: false, message: "Failed to load messages.", error: error.message });
    }
};

// Load messages for owner
export const loadOwnerMsg = async (req, res) => {
    try {

        const { itemId, ownerId } = req.body;

        if (!itemId) {
            return res.status(400).json({ success: false, message: 'itemId is required' });
        }

        const messages = await Message.find({ itemId })
            .sort({ date: -1 })
            .populate('sender', 'name email')
            .populate('buyer', 'name email');

        const convMap = new Map();

        messages.forEach((msg) => {
            const key = msg.buyer._id.toString();

            if (!convMap.has(key)) {
                convMap.set(key, {
                    buyerId: msg.buyer._id.toString(),
                    itemId: msg.itemId.toString(),
                    buyerName: msg.buyer.name,
                    lastMessage: {
                        _id: msg._id.toString(),
                        message: msg.message,
                        date: msg.date,
                        sender: msg.sender._id
                    },
                    lastDate: msg.date,
                    unreadCount: 0,
                });
            }


            if (!msg.isRead && msg.sender._id.toString() !== ownerId) {
                const conversation = convMap.get(key);
                conversation.unreadCount += 1;
            }
        });

        const conversations = Array.from(convMap.values()).sort(
            (a, b) => new Date(b.lastDate) - new Date(a.lastDate)
        );

        res.json({ success: true, conversations });
    } catch (error) {
        console.error('Error loading owner messages:', error);
        res
            .status(500)
            .json({ success: false, message: 'Failed to fetch conversations.', error: error.message });
    }
};

export const loadUserMsg = async (req, res) => {
    try {
        const userId  = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const allMessages = await Message.find({
            $or: [
                { buyer: userId },
                { owner: userId }
            ]
        }).sort({ date: 1 })
        .populate('itemId', 'name image');

        const grouped = {};
        allMessages.forEach(msg => {
            const itemId = msg.itemId ? msg.itemId.toString() : "no_item";
            if (!grouped[itemId]) grouped[itemId] = [];
            grouped[itemId].push(msg);
        });

        res.json({ success: true, messages: grouped });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};