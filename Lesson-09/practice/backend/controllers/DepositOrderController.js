import DepositOrdersModel from '../models/DepositOrder.js';
import PropertiesModel from '../models/Property.js';
import { resolveAccountProfile } from '../utils/resolveAccountProfile.js';

// Get all deposit orders with customer info (Manager/Employee)
export const getDepositOrdersWithCustomer = async (req, res) => {
    try {
        const allDepositOrders = await DepositOrdersModel.find()
            .populate('customerId', 'name email phone');

        res.status(200).json({
            message: "Get deposit orders successful",
            data: allDepositOrders,
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Get my deposit orders with property and employee info (Customer)
export const getMyDepositOrders = async (req, res) => {
    try {
        const customerInfo = await resolveAccountProfile(req);

        const myOrders = await DepositOrdersModel.find({ customerId: customerInfo._id })
            .populate({
                path: 'propertyId',
                populate: {
                    path: 'employeeId',
                    select: 'name email phone'
                }
            });

        res.status(200).json({
            message: "Get my deposit orders successful",
            data: myOrders,
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Add a new deposit order
export const addDepositOrder = async (req, res) => {
    try {
        const { propertyId, depositAmount } = req.body;

        // Check fields
        if (!propertyId || !depositAmount) {
            return res.status(400).json({ message: "propertyId and depositAmount are required" });
        }

        if (depositAmount <= 0) {
            return res.status(400).json({ message: "depositAmount must be larger than 0" });
        }

        // Check property exist
        const propertyInfo = await PropertiesModel.findById(propertyId);
        if (!propertyInfo) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Get customer info
        const customerInfo = await resolveAccountProfile(req);

        const newDepositOrder = await DepositOrdersModel.create({
            customerId: customerInfo._id,
            propertyId,
            depositAmount
        });

        res.status(200).json({
            message: "Add new deposit order successful",
            data: newDepositOrder,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};
