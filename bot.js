require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const { showMainMenu } = require("./handlers/menu");
const { handleSupport } = require("./handlers/support");
const { handleVpn } = require("./handlers/vpn");
const { handleSubscription } = require("./handlers/subscription");
const { handleDataImpulse } = require("./handlers/dataimpulse");
const { handleProxyIP } = require("./handlers/9proxy_ip");

const {
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone
} = require("./handlers/payment");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

/* ===================== START ===================== */
bot.onText(/\/start/, (msg) => {
  showMainMenu(bot, msg.chat.id);
});

/* ===================== SCREENSHOT / PHOTO HANDLER ===================== */
bot.on("photo", async (msg) => {
  await handlePaymentScreenshot(bot, msg);
});

/* ===================== BUTTON HANDLER ===================== */
bot.on("callback_query", async (query) => {
  await handleSupport(bot, query);
  await handleDataImpulse(bot, query);
  await handlePaymentMethod(bot, query);
  await handlePaymentDone(bot, query);
  await handleVpn(bot, query);
  await handleSubscription(bot, query);

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