const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


// 🔹 POST : Add New Order
exports.addOrder = async (req, res) => {
    try {
        const { products, total, shippingAddress, paymentMethod } = req.body;
        const newOrder = new Order({ products, total, shippingAddress, paymentMethod, user: req.user.id });
        await newOrder.save();
        res.status(201).json({ msg: 'Order placed successfully 🛒', newOrder });
    } catch (error) {
        res.status(400).json({ msg: "Couldn't place the order 🫤" });
    }
};

//🔹 GET : All Orders List
exports.allOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate({
            path: 'user',
            model:'user',
            select:'name'
    })
        .populate({
            path:'products.product',
            model: 'product',
            select: 'name price'
        });

        if (orders.length === 0) {
            res.status(404).json({ msg: "There are no orders yet 🤔"});
        }
        res.status(200).json({ msg: 'Users orders list found successfully 🫡', orders});
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ msg: "Couldn't find the users orders list"});
    }
};

//🔹 GET : User Orders List
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
        .populate({
            path:'products.product',
            model: 'product',
            select: 'name price'
        });
        console.log(orders)
        

        if (orders.length === 0) {
           return res.status(404).json({ msg: "You didn't place any order yet 🫤"});
        };

        // res.status(200).json({ msg: 'My orders list fetched successfully 📋', orders})

        res.status(200).json(orders);


    } catch (error) {
        console.error(error.message)
        res.status(400).json({ msg: "Couldn't find the orders list 🙁", error: error.message });
    }
};

//🔹 GET : One Order
exports.oneOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        .populate({
            path:'products.product',
            model: 'product',
            select: 'name price'
        });
        
        if (!order) {
            res.status(404).json({ msg: 'Order not found 🫤'})
        };

        if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
            res.status(403).json({ msg: 'Access denied 😐'})
        };

        res.status(200).json({ msg: 'Order fetched successfully 📦', order })
    } catch (error) {
        res.status(400).json({ msg: "Couldn't find the order 🙁"})
    }
};

//🔹 PUT : Update Order Status
exports.updateStatus = async (req, res) => {
   
    try {
        
        const { id } = req.params;
        const { status } = req.body;
         console.log('✅ Body reçu dans updateStatus :', req.body);
        const validStatus = ['In preparation', 'Shipped', 'Delivered'];
 
        if (!validStatus.includes(status)) {
            
            return res.status(400).json({ msg: 'Invalid status 🛑'})
            
        };

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found 🫤'})
        }; 

        if (!req.user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied 😐'})
        };

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(id)
        .populate({
            path: 'user',
            model:'user',
            select:'name'
    })
        .populate({
            path:'products.product',
            model: 'product',
            select: 'name price'
        });

        res.status(200).json({ msg: `Order status updated to ${status} successfully 🫡`, order: updatedOrder })
    } catch (error) {
        console.error(error)
        res.status(400).json({ msg: "Couldn't update the order status 🙁"})
    }
};