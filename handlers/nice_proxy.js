const { showPaymentMethods } = require("./payment");

/* ===================== NICE PROXY PACKAGES ===================== */
const nicePackages = {
  nice1: { label: "1 GB", price: "$0.80" },
  nice2: { label: "2 GB", price: "$1.60" },
  nice3: { label: "3 GB", price: "$2.40" },
  nice5: { label: "5 GB", price: "$3.99" },
  nice10: { label: "10 GB", price: "$7.99" },
  nice15: { label: "15 GB", price: "$11.99" },
  nice20: { label: "20 GB", price: "$15.99" }
};

async function handleNiceProxy(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "nice_proxy") {
    const entries = Object.entries(nicePackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      const row = entries.slice(i, i + 2).map(([key, item]) => ({
        text: `🔥 ${item.label} - ${item.price}`,
        callback_data: key
      }));

      buttons.push(row);
    }

    buttons.push([{ text: "⬅️ Back", callback_data: "ip_proxy" }]);

    bot.sendMessage(chatId, "🔥 Select Nice Proxy Package:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });

    return true;
  }

  if (nicePackages[data]) {
    const pkg = nicePackages[data];

    showPaymentMethods(bot, chatId, {
      name: "Nice Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "nice_proxy"
    });

    return true;
  }

  return false;
}

module.exports = {
  handleNiceProxy
};