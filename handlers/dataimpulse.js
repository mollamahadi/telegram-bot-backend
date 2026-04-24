const { showPaymentMethods } = require("./payment");

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

async function handleDataImpulse(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

 

  /* ===================== DATAIMPULSE PACKAGE MENU ===================== */
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
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "dataimpulse_menu" }]
          ]
        }
      });
      return;
    }

    showPaymentMethods(bot, chatId, {
      name: "DataimPulse",
      package: pkg.label,
      price: pkg.price,
      back: "dataimpulse_menu"
    });
  }
}

module.exports = {
  handleDataImpulse
};