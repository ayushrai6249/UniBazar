import College from "../models/collegeModel.js";

export const searchColleges = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        if (!search) {
            return res.json([]);
        }

        const words = search.split(" ");

        const query = {
            $and: words.map(word => ({
                $or: [
                    { shortform: { $regex: word, $options: "i" } },
                    { name: { $regex: word, $options: "i" } },
                    { city: { $regex: word, $options: "i" } }
                ]
            }))
        };

        const colleges = await College.find(query)
            .limit(10)
            .select("id name city shortform");

        res.json(colleges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching colleges" });
    }
};