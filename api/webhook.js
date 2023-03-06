
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard } = require('../bot/utils');
const { getTGEvents } = require('../controller/eventController');
const { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA } = require('../bot/constants/constants')

process.env.NTBA_FIX_319 = 'test';

const bot = new TelegramBot(process.env.BOT_TOKEN);

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
          const { data, message } = callback_query;
          const { chat: { id }, text } = message;

          console.log('DATA', data)
          switch (data) {
            case CALLBACK_DATA.showEvent.callback_data:
              console.log('load event')
              fetch('https://yacht-backend.vercel.app/api/events/').then(res => {
                if (res) {
                  console.log('RES', res)
                  res.map(async (event) => {
                    await bot.sendPhoto(
                      id,
                      'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg',
                      { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString(), isAdmin(id)) }
                    )
                  })
                }
              }).catch(err => console.log('error', err))
             break;
            case CALLBACK_DATA.yachts.callback_data:
             return bot.sendMessage(id, 'Яхты яхты');
             break;
          }
        }
    }
    catch(error) {
        console.error('Error sending message');
        console.log(error.toString());
    }
    response.send('OK');
};