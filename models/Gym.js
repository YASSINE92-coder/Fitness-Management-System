import mongoose from 'mongoose'
const gymSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    equipements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment'
    }],
    coach: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    schedule: {
        type: String,
        required: true
    },
    mix: {
        type: Boolean,
        default: true
    },
    avtivities: [{
        type: String
    }]
}, {
    timestamps: true
});

export default mongoose.model('Gym', gymSchema);