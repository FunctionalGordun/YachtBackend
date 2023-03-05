const User = require('../models/User');

const addBookingEvent = async (req, res) => {
  try {
    const {name, phone, eventId, visitors} = req.body;
    const bookingUser = await User.find({ phone: phone});
    if (bookingUser && bookingUser.length !== 0) {
      const existingUser = bookingUser[0];
      existingUser.events = [...existingUser.events, { eventId, visitors }];
      await existingUser.save();
    } else {
      const newBookingUser = new User({name, phone, events: [{ eventId, visitors }]});
      await newBookingUser.save();
    }
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