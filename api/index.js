require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const expressWinston = require('express-winston')
// const { requestLogger, logger } = require('../logger')

const connectDB = require('../config/db');
const connectBot = require('../bot/index');
const frontendRoutes = require('../routes/frontendRoutes');
const eventsRoutes = require('../routes/eventsRoutes');

// connectBot();

connectDB();
const app = express();

// error logging
// app.use(expressWinston.logger({
//   winstonInstance: requestLogger,
//   statusLevels: true
// }))

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
app.enable('trust proxy');

app.use(express.json({ limit: '4mb' }));

const corsOptions = {
  // origin: ['http://localhost:3000', 'https://zoonyanya.ru', 'https://zoonyanya-admin.vercel.app'],
  credentials: true,
}
app.use(cors(corsOptions));

//root route
app.get('/', (req, res) => {
  res.send('App works properly!');
});

app.use('/api/events/', eventsRoutes);

// роуты фронтенда
app.use('/api/frontend/', frontendRoutes);
app.use('/api/frontend/grooming/', frontendRoutes);

//test reset
app.get('/error', (req, res) => {
  throw new Error('This is a custom error')
})

// Use winston error handling middleware
// app.use(expressWinston.errorLogger({
//   winstonInstance: logger
// }))

// Use express's default error handling middleware
// app.use((err, req, res, next) => {
//   if (res.headersSent) return next(err);
//   res.status(400).json({ err: err });
// });

const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot (token, {polling:true});

const { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA } = require('../bot/constants/constants')
const { getTGEvents } = require('../controller/eventController');
const { isAdmin, getEventMessage, getEventInlineKeyboard } = require('../bot/utils');

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
bot.on('message', (msg) => {
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

  // bot.sendMessage(chatId, `admin ${chatId}`);
  if (isAdmin(chatId)) {
    bot.sendMessage(chatId, `Вы админ`);
  }
});


bot.on('callback_query', async (msg) => {
  const { data, message } = msg;
  const { id: chatId } = message.chat;

  switch (data) {
    case CALLBACK_DATA.showEvent.callback_data:
      getTGEvents().then(res => {
        if (res) {
          res.map(async (event) => {
            console.log('EVENT', event, event._id.toString())
            await bot.sendPhoto(
              chatId,
              'https://res.cloudinary.com/zoonyanya/image/upload/v1666294757/cld-sample-2.jpg',
              { caption: getEventMessage(event), reply_markup: getEventInlineKeyboard(event._id.toString()) }
            )
          })
        }
      }).catch(err => console.log('error', err))
    //  return bot.sendMessage(chatId, 'Бронируй нахуй', bookingKeyboard);
     break;
    case CALLBACK_DATA.yachts.callback_data:
     return bot.sendMessage(chatId, 'Яхты яхты');
     break;
  }
})

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
