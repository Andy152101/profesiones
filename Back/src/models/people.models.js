import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true,
    },
    doctype: {
        type: String,
        required: true,
    },
    docnumber: {
        type: String,
        required: true,
        unique:true,
        
    },
    birthdate: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true,
    },
    companytime: {
        type: String,
        required: true,
    },
    academiclevel: {
        type: String,
        required: true,
    },
    graduationdate: {
        type: String,
        required: true,
    },
    dominanthand: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    neighborhood: {
        type: String,
        required: true,
    },
    municipality: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

export default mongoose.model("People", peopleSchema);