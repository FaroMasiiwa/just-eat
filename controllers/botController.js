const Menu                                  = require('../models/Menu');
const Order                                 = require('../models/Order');
const {formatMoney}                          = require('../utils/utils')
const payStackClient                        = require('../config/paystackClient');
const { initializePayment, verifyPayment }  = require('../services/paystackService');

/*
 * Retrieve pending order
 */
async function getOrCreateOrder(sessionId) {
  let order = await Order.findOne({ sessionId, status: 'pending' });
  if (!order) order = new Order({ sessionId, items: [], total: 0 });
  return order;
}


/*
 * Adding Item
 */
async function handleAddItem(sessionId, userInput) {
  if (userInput.length < 3) return 'Invalid input. Format: <item_number> <option> <qty>';

  const menuIndex = parseInt(userInput[0]) - 1; 
  const option = userInput[1];
  const qty = parseInt(userInput[2]);


  if (isNaN(menuIndex) || isNaN(qty) || qty <= 0) return 'Invalid item number or quantity.';

  const menu = await Menu.find();
  const item = menu[menuIndex];
  if (!item || !item.options.includes(option)) return 'Invalid item or option.';

  const order = await getOrCreateOrder(sessionId);

  // Add item to order
  order.items.push({ menuId: item._id, name: item.name, option, qty, price: item.price });

  // Update total
  order.total = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);

  await order.save();
  return `${item.name} (${option}) x${qty} added. Total: ${formatMoney(order.total)}`;
}


/**
 * Process incoming chatbot messages
 */
async function processMessage(sessionId, message) {
  const msg = message.trim();
  const pendingOrder = await Order.findOne({ sessionId, status: 'pending' });

  switch (msg) {
    case '1': // Place Order
      const menu = await Menu.find();
      return `Menu:\n${menu.map((i, idx) =>
        `${idx + 1}. ${i.name} - ${formatMoney(i.price)} [${i.options.join('/')}]`
      ).join('\n')}`;
      

    case '97': // View Current order
      if (!pendingOrder) return 'No active order.';
      return `Current Order:\n${pendingOrder.items.map(i =>
        `${i.name} (${i.option}) x${i.qty}`
      ).join('\n')}\nTotal: ${formatMoney(pendingOrder.total)}`;

    case '98': // View Order history
      const history = await Order.find({ sessionId, status: { $in: ['paid', 'cancelled'] } });
      if (!history.length) return 'No past orders.';
      return `Order History:\n${history.map(o =>
        `${o._id} - ${o.status} - ${formatMoney(o.total)}`
      ).join('\n')}`;

    case '99': // Checkout
      if (!pendingOrder || pendingOrder.items.length === 0) return 'No order to place!';

      try {
        const email = `guest_${sessionId}@example.com`;
        const paymentResp = await initializePayment(pendingOrder.total, email, `${process.env.BASE_URL}/paystack/callback`);

        if (paymentResp.status) {
          pendingOrder.paymentRef = paymentResp.data.reference;
          await pendingOrder.save();
          // Return Paystack URL to frontend
          return { paystackUrl: paymentResp.data.authorization_url };
        }

        return 'Payment initialization failed.';
      } catch (err) {
        console.error(err);
        return 'Error initializing payment.';
      }

    case '0': // Cancel order
      if (!pendingOrder) return 'No active order.';
      pendingOrder.status = 'cancelled';
      await pendingOrder.save();
      return 'Order canceled!';

    default: // Add item to order
      const parts = msg.split(' ');
      return handleAddItem(sessionId, parts);
  }
}

module.exports = { processMessage };