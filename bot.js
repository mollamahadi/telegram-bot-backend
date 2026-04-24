require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const http = require("http");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const BINANCE_QR_PATH = "./binance_qr.jpg";

/* ===================== TEMP PAYMENT STORAGE ===================== */
const pendingPayments = {};

/* ===================== DATAIMPULSE PACKAGES ===================== */
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

/* ===================== MAIN MENU ===================== */
function showMainMenu(chatId) {
  bot.sendMessage(chatId, "🚀 Welcome to Global Verified Shop\nSelect an option:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📢 Report", callback_data: "report" },
          { text: "📚 Learn", callback_data: "learn" }
        ],
        [
          { text: "📣 Join Channel", callback_data: "join_channel" },
          { text: "☎️ HotLine", callback_data: "hotline" }
        ],
        [
          { text: "🌐 IP/Proxy", callback_data: "ip_proxy" },
          { text: "🔐 BUY VPN", callback_data: "buy_vpn" }
        ],
        [
          { text: "⭐ Premium Subscription", callback_data: "premium_subscription" }
        ],
        [
          { text: "🛍 Open Shop", web_app: { url: process.env.SHOP_URL } }
        ]
      ]
    }
  });
}

/* ===================== START ===================== */
bot.onText(/\/start/, (msg) => {
  showMainMenu(msg.chat.id);
});

/* ===================== SCREENSHOT UPLOAD HANDLER ===================== */
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const payment = pendingPayments[chatId];

  if (!payment || !payment.waitingForScreenshot) {
    return;
  }

  const photos = msg.photo;
  const bestPhoto = photos[photos.length - 1];

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
});

/* ===================== BUTTON HANDLER ===================== */
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const user = query.from;

  /* ===== BACK ===== */
  if (data === "back_main") {
    showMainMenu(chatId);
  }

  /* ===== REPORT ===== */
  if (data === "report") {
    bot.sendMessage(chatId, "📢 Please contact support.", {
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Back", callback_data: "back_main" }]]
      }
    });
  }

  /* ===== LEARN ===== */
  if (data === "learn") {
    bot.sendMessage(chatId, "📚 Learning section coming soon.", {
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Back", callback_data: "back_main" }]]
      }
    });
  }

  /* ===== CHANNEL ===== */
  if (data === "join_channel") {
    bot.sendMessage(chatId, "📣 Join our Channels:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Channel 1", url: process.env.CHANNEL_URL_1 }],
          [{ text: "📢 Channel 2", url: process.env.CHANNEL_URL_2 }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  /* ===== SUPPORT ===== */
  if (data === "hotline") {
    bot.sendMessage(chatId, "☎️ Contact Support:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "👤 Support 1", url: process.env.SUPPORT_URL_1 }],
          [{ text: "👤 Support 2", url: process.env.SUPPORT_URL_2 }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  /* ===================== IP / PROXY MENU ===================== */
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

  /* ===================== DATAIMPULSE MENU ===================== */
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

  /* ===================== DATAIMPULSE PACKAGE SELECT ===================== */
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

  /* ===================== BINANCE PAYMENT ===================== */
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

  /* ===================== NAGAD PAYMENT ===================== */
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

  /* ===================== PAYMENT DONE → ADMIN NOTIFICATION ===================== */
  if (data.startsWith("payment_done_")) {
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

  /* ===================== VPN MENU ===================== */
  if (data === "buy_vpn") {
    bot.sendMessage(chatId, "🔐 Select VPN:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🌍 Express VPN", callback_data: "order_express_vpn" }],
          [{ text: "🛡 Hotspot Shield", callback_data: "order_hotspot" }],
          [{ text: "🚀 IP Vanish", callback_data: "order_ipvanish" }],
          [{ text: "🥔 Potato VPN", callback_data: "order_potato" }],
          [{ text: "👻 Cyber Ghost", callback_data: "order_cyberghost" }],
          [{ text: "🔒 Avast VPN", callback_data: "order_avast" }],
          [{ text: "⚡ Proton VPN", callback_data: "order_proton" }],
          [{ text: "🔐 PIA VPN", callback_data: "order_pia" }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  /* ===================== PREMIUM SUBSCRIPTION ===================== */
  if (data === "premium_subscription") {
    bot.sendMessage(chatId, "⭐ Premium Subscription:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🤖 ChatGPT Plus", callback_data: "order_chatgpt" }],
          [{ text: "🎨 Canva Pro", callback_data: "order_canva" }],
          [{ text: "🎬 CapCut Pro", callback_data: "order_capcut" }],
          [{ text: "📺 YouTube Premium", callback_data: "order_youtube" }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  bot.answerCallbackQuery(query.id).catch(() => {});
});

console.log("Bot running...");

/* ===================== RENDER SERVER ===================== */
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("Bot is running");
  })
  .listen(PORT);