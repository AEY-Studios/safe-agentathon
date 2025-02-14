const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    }
}, { versionKey: false, timestamps: { createdAt: true, updatedAt: true }});

UserSchema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        return ret;
    },
});

module.exports = mongoose.model('User', UserSchema)