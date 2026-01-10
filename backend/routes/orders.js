const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create Order
router.post('/create', auth, async (req, res) => {
    try {
        const { package_description, pickup_address, delivery_address, amount } = req.body;

        // User ID comes from auth middleware
        const sender_id = req.user.id;

        if (!pickup_address || !delivery_address || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (amount < 0) {
            return res.status(400).json({ message: 'Amount cannot be negative' });
        }

        const orderId = await Order.create({
            sender_id,
            package_description,
            pickup_address,
            delivery_address,
            amount
        });

        res.status(201).json({
            id: orderId,
            sender_id,
            status: 'pending',
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Authorization check: User must be sender, admin, or assigned partner
        // allowing all authenticated users to view for simplicity unless strict privacy needed
        // Requirement: "Admin sees all; users see only their own."
        // Authorization check: 
        // 1. Sender can see their own
        // 2. Delivery Partner can see all

        if (req.user.user_type === 'delivery_partner') {
            // Allow delivery partners to view any order
        } else if (req.user.id !== order.sender_id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// List Orders
router.get('/', auth, async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.limit) filters.limit = req.query.limit;
        if (req.query.type) filters.type = req.query.type;

        // Sender sees own, others (Delivery Partner) see all
        if (req.user.user_type === 'sender') {
            filters.sender_id = req.user.id;
        }

        const orders = await Order.findAll(filters);
        res.json({ orders, total: orders.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Order Status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status, delivery_partner_id } = req.body;
        const validStatuses = ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Sender might cancel
        if (req.user.user_type === 'sender') {
            if (status === 'cancelled' && order.status === 'pending') {
                // Allow cancellation
            } else {
                return res.status(403).json({ message: 'Senders can only cancel pending orders' });
            }
        }

        // If assigning, ensure delivery_partner_id is present or use current user if they are partner
        let partnerId = delivery_partner_id;
        if (status === 'assigned' && !partnerId && req.user.user_type === 'delivery_partner') {
            partnerId = req.user.id;
        }

        const success = await Order.updateStatus(req.params.id, status, partnerId);
        if (success) {
            res.json({ id: req.params.id, status, updated: true });
        } else {
            res.status(400).json({ message: 'Update failed' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel Order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.user_type === 'sender') {
            if (req.user.id !== order.sender_id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const success = await Order.cancel(req.params.id);
        if (success) {
            res.json({ id: req.params.id, status: 'cancelled', message: 'Order cancelled successfully' });
        } else {
            res.status(400).json({ message: 'Cancellation failed. Order might not be pending.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Earnings (for delivery partners)
router.get('/partner/earnings', auth, async (req, res) => {
    try {
        if (req.user.user_type !== 'delivery_partner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const earnings = await Order.getEarnings(req.user.id);
        res.json(earnings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
