const { showPaymentMethods } = require("./payment");

/* ===================== SWIFT PROXY PACKAGES ===================== */
const swiftPackages = {
  sw1: { label: "1 GB", price: "$1.10" },
  sw2: { label: "2 GB", price: "$2.20" },
  sw3: { label: "3 GB", price: "$3.30" },
  sw5: { label: "5 GB", price: "$5.49" },
  sw10: { label: "10 GB", price: "$10.80" },
  sw15: { label: "15 GB", price: "$16.00" },
  sw20: { label: "20 GB", price: "$21.0" }
};

async function handleSwiftProxy(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
    console.log("SWIFT CLICK:", data); 

  if (data === "swift_proxy") {
    const entries = Object.entries(swiftPackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      const row = entries.slice(i, i + 2).map(([key, item]) => ({
        text: `🚀 ${item.label} - ${item.price}`,
        callback_data: key
      }));

      buttons.push(row);
    }

    buttons.push([{ text: "⬅️ Back", callback_data: "ip_proxy" }]);

    bot.sendMessage(chatId, "🚀 Select Swift Proxy Package:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  }

  if (swiftPackages[data]) {
    const pkg = swiftPackages[data];

    showPaymentMethods(bot, chatId, {
      name: "Swift Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "swift_proxy"
    });
  }
}

module.exports = {
  handleSwiftProxy
};