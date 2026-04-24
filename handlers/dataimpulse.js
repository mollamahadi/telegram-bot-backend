const fs = require("fs");

const BINANCE_QR_PATH = "./binance_qr.jpg";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

const pendingPayments = {};

const dataImpulsePackages = {
  di_5: { label: "5 GB", price: "$$3.5", available: false },
  di_6: { label: "6 GB", price: "$$3.8", available: false },
  di_6_5: { label: "6.5 GB", price: "$4", available: false },
  di_7_5: { label: "7.5 GB", price: "$5", available: true },
  di_8: { label: "8 GB", price: "$5.25", available: false },
  di_8_5: { label: "8.5 GB", price: "$5.50", available: false },
  di_10: { label: "10 GB", price: "$$6.5", available: false },
  di_12_5: { label: "12.5 GB", price: "$8.00", available: false },
  di_15: { label: "15 GB", price: "$$9.5", available: false },
  di_16: { label: "16 GB", price: "$$9.4", available: false },
  di_17_5: { label: "17.5 GB", price: "$11.00", available: false },
  di_20: { label: "20 GB", price: "$$12.5", available: false },
  di_25: { label: "25 GB", price: "$15.00", available: true },
  di_30: { label: "30 GB", price: "$$16.75", available: false },
  di_50: { label: "50 GB", price: "$29", available: false },
  di_100: { label: "100 GB", price: "Contact Support", available: true }
};

async function handleDataImpulse(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "ip_proxy") {
    bot.sendMessage(chatId, "🌐 Select IP/Proxy:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⚡ DataimPulse", callback_data: "dataimpulse_menu" }],
          [{ text: "🌍 9proxy IP", callback_data: "order_9proxy_ip" }],
          [{ text: "📦 9proxy GB", callback_data: "order_9proxy_gb" }],
          [{ text: "🔥 Nice Proxy", callback_data: "order_nice_proxy" }],
          [{ text: "🚀 Swift Proxy", callback_data: "order_swift_proxy" }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  if (data === "dataimpulse_menu") {
    const packageButtons = Object.entries(dataImpulsePackages).map(([key, item]) => [
      {
        text: item.available ? `${item.label} ✅` : `${item.label} ❌`,
        callback_data: key
      }
    ]);

    packageButtons.push([{ text: "⬅️ Back", callback_data: "ip_proxy" }]);

    bot.sendMessage(chatId, "⚡ Select DataimPulse GB Package:", {
      reply_markup: {
        inline_keyboard: packageButtons
      }
    });
  }

  if (dataImpulsePackages[data]) {
    const pkg = dataImpulsePackages[data];

    if (!pkg.available) {
      bot.sendMessage(chatId, `❌ DataimPulse ${pkg.label} Stock Out`, {
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Back", callback_data: "dataimpulse_menu" }]]
        }
      });
    } else {
      bot.sendMessage(
        chatId,
        `✅ DataimPulse ${pkg.label} Available\n💰 Price: ${pkg.price}\n\nPlease choose payment method:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🟡 Binance", callback_data: `pay_binance_${data}` }],
              [{ text: "🟣 Nagad Merchant", callback_data: `pay_nagad_${data}` }],
              [{ text: "⬅️ Back", callback_data: "dataimpulse_menu" }]
            ]
          }
        }
      );
    }
  }

  if (data.startsWith("pay_binance_")) {
    const pkgKey = data.replace("pay_binance_", "");
    const pkg = dataImpulsePackages[pkgKey];

    pendingPayments[chatId] = {
      pkgKey,
      method: "Binance",
      waitingForScreenshot: true,
      screenshotFileId: null
    };

    const msg =
      `🟡 Binance Payment\n\n` +
      `📦 Product: DataimPulse ${pkg.label}\n` +
      `💰 Amount: ${pkg.price}\n\n` +
      `🆔 Binance ID: 420284061\n\n` +
      `Payment complete হলে এখানে payment screenshot upload করুন।`;

    if (fs.existsSync(BINANCE_QR_PATH)) {
      await bot.sendPhoto(chatId, BINANCE_QR_PATH, { caption: msg });
    } else {
      await bot.sendMessage(chatId, msg);
    }
  }

  if (data.startsWith("pay_nagad_")) {
    const pkgKey = data.replace("pay_nagad_", "");
    const pkg = dataImpulsePackages[pkgKey];

    pendingPayments[chatId] = {
      pkgKey,
      method: "Nagad Merchant",
      waitingForScreenshot: true,
      screenshotFileId: null
    };

    bot.sendMessage(
      chatId,
      `🟣 Nagad Merchant Payment\n\n` +
        `📦 Product: DataimPulse ${pkg.label}\n` +
        `💰 Amount: ${pkg.price}\n\n` +
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

  const pkg = dataImpulsePackages[payment.pkgKey];

  bot.sendMessage(
    chatId,
    `✅ Screenshot received!\n\n📦 Product: DataimPulse ${pkg.label}\n💰 Amount: ${pkg.price}\n💳 Method: ${payment.method}\n\nNow click Payment Done.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Payment Done", callback_data: `payment_done_${payment.pkgKey}` }],
          [{ text: "⬅️ Back", callback_data: payment.pkgKey }]
        ]
      }
    }
  );
}

async function handlePaymentDone(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const user = query.from;

  if (!data.startsWith("payment_done_")) return;

  const pkgKey = data.replace("payment_done_", "");
  const payment = pendingPayments[chatId];
  const pkg = dataImpulsePackages[pkgKey];

  if (!payment || !payment.screenshotFileId) {
    bot.sendMessage(chatId, "⚠️ আগে payment screenshot upload করুন।");
    return;
  }

  const customerName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const username = user.username ? `@${user.username}` : "No username";

  bot.sendMessage(
    chatId,
    `✅ Payment submitted successfully!\n\n` +
      `📦 Product: DataimPulse ${pkg.label}\n` +
      `💰 Amount: ${pkg.price}\n` +
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
    `📦 Product: DataimPulse\n` +
    `📦 Package: ${pkg.label}\n` +
    `💰 Payment Amount: ${pkg.price}\n` +
    `💳 Payment Method: ${payment.method}\n\n` +
    `👤 Customer: ${customerName}\n` +
    `🔗 Username: ${username}\n` +
    `🆔 Telegram ID: ${user.id}`;

  if (ADMIN_CHAT_ID) {
    bot.sendPhoto(ADMIN_CHAT_ID, payment.screenshotFileId, {
      caption: adminCaption
    });
  }

  delete pendingPayments[chatId];
}

module.exports = {
  handleDataImpulse,
  handlePaymentScreenshot,
  handlePaymentDone
};