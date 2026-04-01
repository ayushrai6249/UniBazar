import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    city: String,
    shortform: String
});

const College = mongoose.model("College", collegeSchema);
export default College;