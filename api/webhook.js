
const telegramBot = require('node-telegram-bot-api');
const { connectBot } = require('../bot/index');
// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
    try {
      const bot = new telegramBot (process.env.BOT_TOKEN, {polling:true});
      const { body } = request;

      if (body.message) {
          const { chat: { id }, text } = body.message;
          const message = `Сообщение: *"${text}"*\n 👋🏻`;
          await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
          // bot.onText(/\/start/, async (msg) => {
          //   const chatId = msg.chat.id;
          
          //   await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот Yacht Party');
          // });
      }
    } catch(error) {
        console.error('Error sending message');
        console.log(error.toString());
    }
    response.send('OK');
};