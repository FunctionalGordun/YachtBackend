const User = require('../models/User');
const { bot } = require('../bot');

const addBookingEvent = async (req, res) => {
  try {
    const {queryId, name, phone, eventId, visitors} = req.body;
    const bookingUser = await User.find({ phone: phone});
    if (bookingUser && bookingUser.length !== 0) {
      const existingUser = bookingUser[0];
      existingUser.events = [...existingUser.events, { eventId, visitors }];
      await existingUser.save();
    } else {
      const newBookingUser = new User({name, phone, events: [{ eventId, visitors }]});
      await newBookingUser.save();
    }
    await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Успешное бронирование',
        input_message_content: {
            message_text: 'Вы забронировали'
        }
    })
    res.status(200).send({
      message: 'Бронирование успешно добавлено!',
      // id: newBookingEvent._id
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addBookingEvent,
};