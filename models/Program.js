import mongoose from 'mongoose'

const programSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    program_goals: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    period: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Program', programSchema);