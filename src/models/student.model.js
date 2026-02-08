const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const StudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        age: {
            type: Number,
            min: 0
        },
        active: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

StudentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Student', StudentSchema);
