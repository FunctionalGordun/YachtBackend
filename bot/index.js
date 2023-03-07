const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot (token, {polling:true});
const { getTGEvents } = require('../controller/eventController');
const { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard, getMainInlineKeyboard, CALLBACK_DATA } = require('./utils');

const connectBot = async () => {
  try {

    bot.setMyCommands([
      {command: '/start', description: 'Приветствие'},
      {command: '/events', description: 'Список мероприятий'},
    ])

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
    
      await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party', {reply_markup: getMainInlineKeyboard()});
    });
  
    bot.onText(/\/admin/, async (msg) => {
      const chatId = msg.chat.id;
    
      await  bot.sendMessage(chatId, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
    });

    bot.onText(/\/events/, async (msg) => {
      const chatId = msg.chat.id;

      getTGEvents().then(res => {
        if (res) {
          res.map(async (event) => {
            await bot.sendPhoto(
              chatId,
              event.image,
              { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString(), isAdmin(chatId), event?.address?.latitude, event?.address?.longitude)}
              )
          })
        }
      }).catch(err => {
        return bot.sendMessage(chatId, 'События не найдены');
      })
    });

    bot.on('message', async (msg) => {
      const { chat, contact = null, text } = msg;
      const { id: chatId } = chat;

      if (contact) {
        const { phone_number, first_name, last_name, user_id } = contact;
        bot.sendMessage(chatId, `Вы отправили свой телефон ${phone_number}`);
      }
    });



    bot.on('callback_query', async (msg) => {
      const { data: callBackData, message } = msg;
      const { id: chatId } = message.chat;
      const tmp = callBackData.split(':');
      const data = tmp[0];

      switch (data) {
        case CALLBACK_DATA.showEvent.callback_data:
          getTGEvents().then(res => {
            if (res) {
              res.map(async (event) => {
                await bot.sendPhoto(
                  chatId,
                  event.image,
                  { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString(), isAdmin(chatId), event?.address?.latitude, event?.address?.longitude)}
                  )
              })
            }
          }).catch(err => {
            return bot.sendMessage(chatId, 'События не найдены');
          })
         break;
          case 'location':
            if (tmp[1] && tmp[2])
            return await bot.sendLocation(chatId, Number(tmp[1]), Number(tmp[2]));
          else
            return await bot.sendMessage(chatId, 'Не удалось загрузить координаты события');
         break;
      }
    })
  } catch(err) {
    console.log('BOT failed!', err.message);
  }
}
module.exports = { connectBot, bot };