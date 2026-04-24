const { showMainMenu } = require("./menu");

async function handleSupport(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "back_main") {
    showMainMenu(bot, chatId);
  }

  if (data === "report") {
    bot.sendMessage(chatId, "📢 Please contact support.", {
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Back", callback_data: "back_main" }]]
      }
    });
  }

  if (data === "learn") {
    bot.sendMessage(chatId, "📚 Learning section coming soon.", {
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Back", callback_data: "back_main" }]]
      }
    });
  }

  if (data === "join_channel") {
    bot.sendMessage(chatId, "📣 Join our Channels:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Channel 1", url: process.env.CHANNEL_URL_1 }],
          [{ text: "📢 Channel 2", url: process.env.CHANNEL_URL_2 }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }

  if (data === "hotline") {
    bot.sendMessage(chatId, "☎️ Contact Support:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "👤 Support 1", url: process.env.SUPPORT_URL_1 }],
          [{ text: "👤 Support 2", url: process.env.SUPPORT_URL_2 }],
          [{ text: "⬅️ Back", callback_data: "back_main" }]
        ]
      }
    });
  }
}

module.exports = { handleSupport };