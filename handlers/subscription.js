async function handleSubscription(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

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
}

module.exports = { handleSubscription };