async function handleVpn(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

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
}

module.exports = { handleVpn };