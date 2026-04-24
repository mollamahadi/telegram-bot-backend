require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const { showMainMenu } = require("./handlers/menu");
const { handleSupport } = require("./handlers/support");
const { handleVpn } = require("./handlers/vpn");
const { handleSubscription } = require("./handlers/subscription");
const { handleDataImpulse } = require("./handlers/dataimpulse");
const { handleProxyIP } = require("./handlers/9proxy_ip");
const { handleIPProxy } = require("./handlers/ip_proxy");
const { handleProxyGB } = require("./handlers/9proxy_gb");
const { handleSwiftProxy } = require("./handlers/swift_proxy");
const { handleNiceProxy } = require("./handlers/nice_proxy");

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
 console.log("GLOBAL CLICK:", query.data);


  if (await handleSupport(bot, query)) return;
  if (await handleIPProxy(bot, query)) return;
  if (await handleDataImpulse(bot, query)) return;
  if (await handleProxyIP(bot, query)) return;
  if (await handleProxyGB(bot, query)) return;
  if (await handleSwiftProxy(bot, query)) return;
  if (await handleNiceProxy(bot, query)) return;
  if (await handlePaymentMethod(bot, query)) return;
  if (await handlePaymentDone(bot, query)) return;
  if (await handleVpn(bot, query)) return;
  if (await handleSubscription(bot, query)) return;
  

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