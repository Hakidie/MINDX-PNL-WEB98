import PropertiesModel from '../models/Property.js';
import { resolvePropertyEmployeeId } from '../utils/resolvePropertyEmployeeId.js';

// Add a post
export const addPropertyInfo = async (req, res) => {
    try {
        const { address, price, area, status } = req.body;

        // Check fields
        if (!address || !price || !area || !status) {
            return res.status(400).json({ message: "address, price, area and status are required!", success: false });
        }

        const employeeId = await resolvePropertyEmployeeId(req);

        const newProperty = await PropertiesModel.create({
            address,
            price,
            area,
            status,
            employeeId,
        });

        res.status(200).json({
            message: "Add new property successfull",
            data: newProperty,
            success: true
        });

    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message,
            success: false
        });
    }
};

// Update a post
export const updatePropertyInfo = async (req, res) => {
    try {
        const { address, price, area, status, propertyId } = req.body;

        if (!address || !price || !area || !status || !propertyId) {
            return res.status(400).json({ message: "address, price, area and status are required!", success: false });
        }

        // Get property info
        const propertyInfo = await PropertiesModel.findById(propertyId);
        if (!propertyInfo) {
           return res.status(404).json({ message: "No property found!", success: false });
        }

        const employeeId = await resolvePropertyEmployeeId(req, propertyInfo);

        const updatedProperty = await PropertiesModel.findByIdAndUpdate(propertyId, {
            address,
            price,
            area,
            status,
            employeeId,
        }, { new: true });

        res.status(200).json({
            message: "Update property successful",
            data: updatedProperty,
            success: true
        });

    } catch (error) {
        res.status(error.status || 500).send({
            message: error.message,
            success: false
        });
    }
};
