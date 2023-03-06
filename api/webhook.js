
const telegramBot = require('node-telegram-bot-api');
const { connectBot } = require('../bot/index');
// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
    try {
      const bot = new telegramBot (process.env.BOT_TOKEN, {polling:true});

      bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
      
        await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party', mainInlineKeyboard);
      });
      // const { body } = request;

      // Ensure that this is a message being sent
      // if (body.message) {
      //     // Retrieve the ID for this chat
      //     // and the text that the user sent
      //     const { chat: { id }, text } = body.message;

      //     // Create a message to send back
      //     // We can use Markdown inside this
      //     const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

      //     // Send our new message back in Markdown
      //     await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
      //   bot.onText(/\/start/, async (msg) => {
      //     const chatId = msg.chat.id;
        
      //     await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party');
      //   });
      }

      // bot.onText(/\/start/, async (msg) => {
      //   const chatId = msg.chat.id;
      
      //   await bot.sendMessage(chatId, 'Здравствуйте! \n Это бот района Yacht Party');
      // });
    }
    catch(error) {
        // If there was an error sending our message then we 
        // can log it into the Vercel console
        console.error('Error sending message');
        console.log(error.toString());
    }
    
    // Acknowledge the message with Telegram
    // by sending a 200 HTTP status code
    response.send('OK');
};