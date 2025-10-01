import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    assigned_by: {
        type: String,
        required: true
    },
    issued_at: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default  certificateSchema ;