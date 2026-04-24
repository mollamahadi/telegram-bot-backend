if (data === "ip_proxy") {
  bot.sendMessage(chatId, "🌐 Select IP/Proxy:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚡ DataImpulse", callback_data: "dataimpulse" },
          { text: "🌍 9proxy IP", callback_data: "order_9proxy_ip" }
        ],
        [
          { text: "📦 9proxy GB", callback_data: "order_9proxy_gb" },
          { text: "🔥 Nice Proxy", callback_data: "nice_proxy" }
        ],
        [
          { text: "🚀 Swift Proxy", callback_data: "swift_proxy" }
        ],
        [
          { text: "⬅ Back", callback_data: "back_main" }
        ]
      ]
    }
  });
}