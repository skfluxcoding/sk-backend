const { Schema, model } = require('mongoose');

const verificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: [
                'ACTIVATE_USER',
                'PASSWORD_RESET',
                'TWO_FACTOR'
            ],
            required: true,
            index: true
        },

        token: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        },

        used: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

// Compound index for fast lookups
verificationSchema.index({ user: 1, type: 1, used: 1 });
const Verification = model('Verification', verificationSchema);
module.exports = Verification;
