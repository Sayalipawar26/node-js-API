const axios = require('axios');
const crypto = require('crypto');
const Order = require('../../models/Order');

// CCAvenue credentials
const merchantId = "3273648";
const accessCode = "AVCV59LB93AU52VCUA";
const encryptionKey = "9D4F812F2188E97D3304CD3DF5A4FA67";

// Function to encrypt data
const encryptData = (data, encryptionKey) => {
    const cipher = crypto.createCipher('aes-128-cbc', encryptionKey);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
};

// Controller function to make payment
exports.makePayment = async (req, res, next) => {
    const { order_id, amount } = req.body;

    // Validate request parameters
    if (!order_id || !amount) {
        return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Construct parameters for CCAvenue API
    const params = {
        order_id: order_id,
        amount: amount,
        // Add other required parameters here
    };

    // Add CCAvenue specific parameters
    params.merchant_id = merchantId;
    params.access_code = accessCode;

    // Encrypt the parameters
    const encryptedData = encryptData(params, encryptionKey);

    try {
        // Send payment request to CCAvenue
        const response = await axios.post('https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction', encryptedData);

        // Assuming payment is successful, create a new order record
        const newOrder = new Order({
            order_id,
            amount,
            // Other fields as needed
        });
        await newOrder.save();

        res.json(response.data);
    } catch (error) {
        next(error);
    }
};
