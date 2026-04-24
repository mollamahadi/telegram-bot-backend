function showMainMenu(bot, chatId) {
  bot.sendMessage(chatId, "🚀 Welcome to Global Verified Shop\nSelect an option:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🌐 IP/Proxy", callback_data: "ip_proxy" },
          { text: "🔐 BUY VPN", callback_data: "buy_vpn" }
        ],

         [
          { text: "📣 Join Channel", callback_data: "join_channel" },
          { text: "☎️ HotLine", callback_data: "hotline" }
        ],
        
         [
          { text: "⭐ Premium Subscription", callback_data: "premium_subscription" }
        ],
       
        
        [
          { text: "📢 Report", callback_data: "report" },
          { text: "📚 Learn", callback_data: "learn" }
        ],

       
        [
          { text: "🛍 Open Shop", web_app: { url: process.env.SHOP_URL } }
        ]
      ]
    }
  });
}

module.exports = { showMainMenu };