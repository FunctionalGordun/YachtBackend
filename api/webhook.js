
require('dotenv').config();
// const TelegramBot = require('node-telegram-bot-api');
const bot = require('../config/bot');
const { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard } = require('../bot/utils');
const { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA } = require('../bot/constants/constants')
const fetch = require('node-fetch');
process.env.NTBA_FIX_319 = 'test';

// const bot = new TelegramBot(process.env.BOT_TOKEN);

module.exports = async (request, response) => {
    try {
        const { body } = request;
        const { message, callback_query } = body;

        console.log(body)
        if (message) {
            const { chat: { id }, text } = message;

          if (text == '/start') {
            await bot.sendMessage(id, 'Здравствуйте! \n Это бот Yacht Party', mainInlineKeyboard);
          }
          if (text == '/admin' && isAdmin(id)) {
            bot.sendMessage(id, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
          }
        }

        if (callback_query) {
          const { data: callBackData, message } = callback_query;
          const tmp = callBackData.split(':');
          const data = tmp[0];

          const { chat: { id }, text } = message;

          if (data == CALLBACK_DATA.showEvent.callback_data) {
            const response = await fetch("https://yacht-backend.vercel.app/api/events/");
            if (response.ok) {
              const events = await response.json();
              events.map(async (event) => {
                  await bot.sendPhoto(
                    id,
                    event.image,
                    { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString(), isAdmin(id), event?.latitude, event?.longitude)}
                  )
                })
                return ;
            } else {
              return bot.sendMessage(id, 'События не найдены');
            }
          }
        } else if (data == 'location') {
          if (tmp[1] && tmp[2])
            return await bot.sendLocation(id, Number(tmp[1]), Number(tmp[2]));
          else
            return await bot.sendMessage(id, 'Не удалось загрузить координаты события');
        }
    }
    catch(error) {
        console.error('Error sending message');
        console.log(error.toString());
    }
    response.send('OK');
};