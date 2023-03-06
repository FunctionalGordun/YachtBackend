
require('dotenv').config();
// const telegramBot = require('node-telegram-bot-api');
// const { connectBot } = require('../bot/index');

process.env.NTBA_FIX_319 = 'test';

// Require our Telegram helper package
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN);

module.exports = async (request, response) => {
    try {
        // Create our new bot handler with the token
        // that the Botfather gave us
        // Use an environment variable so we don't expose it in our code
        // const bot = new TelegramBot(process.env.BOT_TOKEN);

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        bot.onText(/\/start/, async (msg) => {
          const chatId = msg.chat.id;
        
          await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party', mainInlineKeyboard);
        });

        bot.on('message', async (msg) => {
          const { chat, contact = null, text } = msg;
          const { id: chatId } = chat;
          bot.sendMessage(chatId, `ID ${chatId}`);
          if (text == '/admin' && isAdmin(chatId)) {
            bot.sendMessage(chatId, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
          }
        });

        // Ensure that this is a message being sent
        if (body.message) {
            // Retrieve the ID for this chat
            // and the text that the user sent
            const { chat: { id }, text } = body.message;

            // Create a message to send back
            // We can use Markdown inside this
            const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

            // Send our new message back in Markdown
            await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
        }
    }
    catch(error) {
        console.error('Error sending message');
        console.log(error.toString());
    }
    response.send('OK');
};