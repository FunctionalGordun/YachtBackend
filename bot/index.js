const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot (token, {polling:true});

const { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA } = require('./constants/constants')
const { getTGEvents } = require('../controller/eventController');
const { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard } = require('./utils');

const connectBot = async () => {
  try {

    bot.setMyCommands([
      {command: '/start', description: 'Приветствие'},
      {command: '/events', description: 'Список мероприятий'},
      {command: '/yacht', description: 'Яхта'},
    ])

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
    
      await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party', mainInlineKeyboard);
    });


let eventStatus = null
    bot.on('message', async (msg) => {
      const { chat, contact = null, text } = msg;
      const { id: chatId } = chat;

      if (contact) {
        const { phone_number, first_name, last_name, user_id } = contact;
        bot.sendMessage(chatId, `Вы отправили свой телефон ${phone_number}`);
      }
      if (text == 'tete') {
        bot.sendMessage(chatId, `TETETE ${eventStatus}`).then(res => {
          console.log("RES", res)
        })
        eventStatus = 'tete'
      } else if (text == 'ooo') {
        bot.sendMessage(chatId, `OOO ${eventStatus}`)
        eventStatus = 'ooo'
      }

      if (text == '/admin' && isAdmin(chatId)) {
        bot.sendMessage(chatId, `Возможности администратора`, { reply_markup: getAdminKeyboard()});
      }

      // bot.sendMessage(chatId, `admin ${chatId}`);
      // if (isAdmin(chatId)) {
      //   bot.sendMessage(chatId, `Вы админ`);
      //   bot.sendLocation(chatId, 25.091951, 55.141493)
      //   bot.sendMessage(chatId, 'Бронируй нахуй', bookingKeyboard)
      // }

      // if(msg?.web_app_data?.data) {
      //   try {
      //       const data = JSON.parse(msg?.web_app_data?.data)
      //       console.log(data)
      //       await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
      //   } catch (e) {
      //       console.log(e);
      //   }
      // }
    });



    bot.on('callback_query', async (msg) => {
      const { data, message } = msg;
      const { id: chatId } = message.chat;

      switch (data) {
        case CALLBACK_DATA.showEvent.callback_data:
          getTGEvents().then(res => {
            if (res) {
              res.map(async (event) => {
                await bot.sendPhoto(
                  chatId,
                  'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg',
                  { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString(), isAdmin(chatId)) }
                )
              })
            }
          }).catch(err => console.log('error', err))
         break;
        case CALLBACK_DATA.yachts.callback_data:
         return bot.sendMessage(chatId, 'Яхты яхты');
         break;
      }
    })
  } catch(err) {
    console.log('BOT failed!', err.message);
  }
}

                // await bot.sendMediaGroup(
                //   chatId,
                //   [{"type": "photo", "media": 'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg'},
                //   {"type": "photo", "media": 'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg'},
                //   {"type": "photo", "media": 'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg'}],
                //   { caption: getEventMessage(event)
                // })

module.exports = { connectBot, bot };