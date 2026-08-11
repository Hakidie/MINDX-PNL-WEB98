import OrdersModel from '../models/orders.js';
import ProductsModel from '../models/products.js';

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const allOrders = await OrdersModel.find();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Get orders by customer id
export const getOrdersByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.id;

        // Only allow a customer to view their own orders
        if (req.customer._id !== customerId) {
            return res.status(403).json({ message: "You can only view your own orders" });
        }

        const customerOrders = await OrdersModel.find({ customerId: customerId });

        if (customerOrders.length === 0) {
            return res.status(404).json({ message: "Customer orders not found" });
        }

        res.status(200).json(customerOrders);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Get a orders with totalPrice is larger than 10 mil
export const getHighValueOrders = async (req, res) => {
    try {
        // const customerId = req.params.id;
        const highValueOrders = await OrdersModel.find({ totalPrice: { $gt: 10000000 } });

        if (highValueOrders.length === 0) {
            return res.status(404).json({ message: "High value orders not found" });
        }

        res.status(200).json(highValueOrders);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Add a new order
export const addOrder = async (req, res) => {
    try {
        // Get body input
        const { productId, quantity } = req.body;

        // Check product, quantity
        const productInfo = await ProductsModel.findById(productId);
        if (!productInfo) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (quantity < 0 || quantity > productInfo.quantity) {
            return res.status(404).json({ message: "Invalid quantity" });
        }

        // Generate new Id
        const lastOrder = await OrdersModel.findOne().sort({ _id: -1 });
        const lastId = parseInt(lastOrder._id.replace('o', ''));
        const newId = `o${String(lastId + 1).padStart(3, '0')}`;

        // Calculate totalPrice and update quantity for that product
        const totalPrice = productInfo.price * quantity;
        productInfo.quantity = productInfo.quantity - quantity;
        await productInfo.save();

        const newOrder = await OrdersModel.create({
            _id: newId,
            customerId: req.customer._id,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice
        });

        res.status(200).json({
            message: "Add new order successfull",
            data: newOrder,
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

// Update quantity of an order
export const updateOrderQuantity = async (req, res) => {
    try {
        // Get body input
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({ message: "Quantity are required" });
        }

        // Check order info
        const orderId = req.params.id;
        const orderInfo = await OrdersModel.findById(orderId);
        if (!orderInfo) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Get product, check quantity
        const productInfo = await ProductsModel.findById(orderInfo.productId);
        if (quantity <= 0 || quantity > productInfo.quantity) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Calculate totalPrice and update quantity for that product
        const totalPrice = productInfo.price * quantity;

        // Update quantity of products
        const difference = Math.abs(orderInfo.quantity - quantity);
        if (quantity > orderInfo.quantity) {
            productInfo.quantity = productInfo.quantity - difference;
            await productInfo.save();
        }
        if (quantity < orderInfo.quantity) {
            productInfo.quantity = productInfo.quantity + difference;
            await productInfo.save();
        }

        const updateOrder = await OrdersModel.findByIdAndUpdate(orderId, {
            quantity,
            totalPrice
        }, { new: true });

        res.status(200).json({
            message: "Update order successfull",
            data: updateOrder,
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

export const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleteOrder = await OrdersModel.findById(orderId)
    if (!deleteOrder) throw new Error("No order with that id!")

    const deletedOrder = await OrdersModel.findByIdAndDelete(orderId);

    res.status(200).json({
      message: "Deleted order!",
      data: deletedOrder,
      success: true
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      success: false
    });
  }
};
