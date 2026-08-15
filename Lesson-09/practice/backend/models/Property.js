import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    area: {
        type: Number, // Stores float / area in m2
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Đang bán', 'Đã bán', 'Dừng bán'],
        default: 'Đang bán',
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
