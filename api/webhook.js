
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard } = require('../bot/utils');
const { getTGEvents } = require('../controller/eventController');
const { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA } = require('../bot/constants/constants')

process.env.NTBA_FIX_319 = 'test';

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
          console.log('MESSAGE')
          const { chat, contact = null, text } = msg;
          const { id: chatId } = chat;

          bot.sendMessage(chatId, `ID ${chatId}`);

          if (text == '/admin' && isAdmin(chatId)) {
            bot.sendMessage(chatId, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
          }
        });

        if (body.message) {
            console.log('body.message', body.message)
            const { chat: { id }, text } = body.message;

            if (text == '/admin' && isAdmin(id)) {
              bot.sendMessage(id, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
            }
            if (text == '/start') {
              await bot.sendMessage(id, 'Здравствуйте! \n Это бот района Yacht Party', mainInlineKeyboard);
            }
            const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;
            await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
        }
    }
    catch(error) {
        console.error('Error sending message');
        console.log(error.toString());
    }
    response.send('OK');
};