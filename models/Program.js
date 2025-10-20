import mongoose from 'mongoose'

const programSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,    
        ref: 'User',
        required: true
    },
    bought_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    program_goals: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    period: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
     status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
});
const Program = mongoose.model('Program', programSchema)
export default Program;