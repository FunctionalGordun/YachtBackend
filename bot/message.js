// const telegramBot = require('node-telegram-bot-api');
// require('dotenv').config();

// const token = process.env.BOT_TOKEN;
// const bot = new telegramBot (token, {polling:true});

// const connectBot = async () => {
//   try {
//     bot.onText(/\/start/, (msg) => {
//       const chatId = msg.chat.id;
    
//       const kb1 = {
//         reply_markup: {
//           inline_keyboard: keyboard1
//         }
//       }
    
//       bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Куркино❤️ \n 🧭Сейчас я смогу помочь найти участок для голосования по месту жительства. \n 💡Также можете узнать информацию про наших кандидатов команды жителей Куркино. \n 📌 По всем вопросам - обращайтесь в наш общий чат. \n https://t.me/UE8QyXL3QS5iZDcy', kb1);
//     });
    
//     bot.on('message', (msg) => {
//       const chatId = msg.chat.id;
//       const userText = msg.text;
//       let text = '';
    
//       bot.sendMessage(chatId, `Idi nahuy ${userText}`);
//     });
//   } catch(err) {
//     console.log('BOT failed!', err.message);
//   }
// }

// module.exports = connectBot;