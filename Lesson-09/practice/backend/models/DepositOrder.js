import mongoose from 'mongoose';

const depositOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    depositAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Chờ xử lý', 'Đã thanh toán', 'Đã huỷ'],
        default: 'Chờ xử lý',
    },
}, { timestamps: true });

export default mongoose.model('DepositOrder', depositOrderSchema);
