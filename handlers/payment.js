const fs = require("fs");

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const BINANCE_QR_PATH = "./binance_qr.jpg";

const pendingPayments = {};

function showPaymentMethods(bot, chatId, product) {
  pendingPayments[chatId] = {
    product,
    waitingForScreenshot: false,
    screenshotFileId: null
  };

  bot.sendMessage(
    chatId,
    `✅ Selected Product\n\n` +
      `📦 Product: ${product.name}\n` +
      `📦 Package: ${product.package}\n` +
      `💰 Price: ${product.price}\n\n` +
      `Please choose payment method:`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🟡 Binance", callback_data: "pay_binance" }],
          [{ text: "🟣 Nagad Merchant", callback_data: "pay_nagad" }],
          [{ text: "⬅️ Back", callback_data: product.back }]
        ]
      }
    }
  );
}

async function handlePaymentMethod(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data !== "pay_binance" && data !== "pay_nagad") return;

  const payment = pendingPayments[chatId];

  if (!payment || !payment.product) {
    bot.sendMessage(chatId, "⚠️ Please select a product first.");
    return;
  }

  const product = payment.product;
  const method = data === "pay_binance" ? "Binance" : "Nagad Merchant";

  pendingPayments[chatId].method = method;
  pendingPayments[chatId].waitingForScreenshot = true;

  if (method === "Binance") {
    const msg =
      `🟡 Binance Payment\n\n` +
      `📦 Product: ${product.name}\n` +
      `📦 Package: ${product.package}\n` +
      `💰 Amount: ${product.price}\n\n` +
      `🆔 Binance ID: 420284061\n\n` +
      `Payment complete হলে এখানে payment screenshot upload করুন।`;

    if (fs.existsSync(BINANCE_QR_PATH)) {
      await bot.sendPhoto(chatId, BINANCE_QR_PATH, { caption: msg });
    } else {
      await bot.sendMessage(chatId, msg);
    }
  }

  if (method === "Nagad Merchant") {
    await bot.sendMessage(
      chatId,
      `🟣 Nagad Merchant Payment\n\n` +
        `📦 Product: ${product.name}\n` +
        `📦 Package: ${product.package}\n` +
        `💰 Amount: ${product.price}\n\n` +
        `📱 Nagad Merchant Number:\n+8801611237099\n\n` +
        `Payment complete হলে এখানে payment screenshot upload করুন।`
    );
  }
}

async function handlePaymentScreenshot(bot, msg) {
  const chatId = msg.chat.id;
  const payment = pendingPayments[chatId];

  if (!payment || !payment.waitingForScreenshot) return;

  const bestPhoto = msg.photo[msg.photo.length - 1];

  pendingPayments[chatId].screenshotFileId = bestPhoto.file_id;
  pendingPayments[chatId].waitingForScreenshot = false;

  const product = payment.product;

  bot.sendMessage(
    chatId,
    `✅ Screenshot received!\n\n` +
      `📦 Product: ${product.name}\n` +
      `📦 Package: ${product.package}\n` +
      `💰 Amount: ${product.price}\n` +
      `💳 Method: ${payment.method}\n\n` +
      `Now click Payment Done.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Payment Done", callback_data: "payment_done" }],
          [{ text: "⬅️ Back", callback_data: product.back }]
        ]
      }
    }
  );
}

async function handlePaymentDone(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const user = query.from;

  if (data !== "payment_done") return;

  const payment = pendingPayments[chatId];

  if (!payment || !payment.screenshotFileId) {
    bot.sendMessage(chatId, "⚠️ আগে payment screenshot upload করুন।");
    return;
  }

  const product = payment.product;

  const customerName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const username = user.username ? `@${user.username}` : "No username";

  bot.sendMessage(
    chatId,
    `✅ Payment submitted successfully!\n\n` +
      `📦 Product: ${product.name}\n` +
      `📦 Package: ${product.package}\n` +
      `💰 Amount: ${product.price}\n` +
      `💳 Method: ${payment.method}\n\n` +
      `Admin will verify your payment soon.`,
    {
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Back to Main Menu", callback_data: "back_main" }]]
      }
    }
  );

  const adminCaption =
    `🛒 New Order Received!\n` +
    `📦 Product: ${product.name}\n` +
    `📦 Package: ${product.package}\n` +
    `💰 Payment Amount: ${product.price}\n` +
    `💳 Payment Method: ${payment.method}\n\n` +
    `👤 Customer: ${customerName}\n` +
    `🔗 Username: ${username}\n` +
    `🆔 Telegram ID: ${user.id}`;

  if (ADMIN_CHAT_ID) {
    await bot.sendPhoto(ADMIN_CHAT_ID, payment.screenshotFileId, {
      caption: adminCaption
    });
  }

  delete pendingPayments[chatId];
}

module.exports = {
  showPaymentMethods,
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone
};