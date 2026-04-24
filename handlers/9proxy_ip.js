const { showPaymentMethods } = require("./payment");

/* ===================== 9 PROXY IP PACKAGES ===================== */

const proxyPackages = {
  p25: { label: "25 IP", price: "$0.85" },
  p50: { label: "50 IP", price: "$1.69" },
  p100: { label: "100 IP", price: "$3.35" },
  p200: { label: "200 IP", price: "$6.49" },
  p300: { label: "300 IP", price: "$9.59" },
  p500: { label: "500 IP", price: "$14.99" },
  p1000: { label: "1000 IP", price: "$27.99" }
};

async function handleProxyIP(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  /* ===================== MENU ===================== */
  if (data === "order_9proxy_ip") {
 const entries = Object.entries(proxyPackages);

const buttons = [];

for (let i = 0; i < entries.length; i += 2) {
  const row = entries.slice(i, i + 2).map(([key, item]) => ({
    text: `🟢 ${item.label} - ${item.price}`,
    callback_data: key
  }));

  buttons.push(row);
}

    buttons.push([{ text: "⬅️ Back", callback_data: "ip_proxy" }]);

    bot.sendMessage(chatId, "🌍 Select 9 Proxy IP Package:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  }

  /* ===================== PACKAGE SELECT ===================== */
  if (proxyPackages[data]) {
    const pkg = proxyPackages[data];

    showPaymentMethods(bot, chatId, {
      name: "9 Proxy IP",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_ip"
    });
  }
}

module.exports = {
  handleProxyIP
};