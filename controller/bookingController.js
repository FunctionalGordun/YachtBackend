const User = require('../models/User');
const Event = require('../models/Event');
// const bot = require('../bot/index');

const addBookingEvent = async (req, res) => {
  try {
    const {queryId, name, phone, eventId, visitors, source} = req.body;
    const visitorsLen = visitors.length
    const bookingUser = await User.find({ phone: phone});
    if (bookingUser && bookingUser.length !== 0) {
      const existingUser = bookingUser[0];
      existingUser.events = [...existingUser.events, { eventId, visitors }];
      await existingUser.save();
    } else {
      const newBookingUser = new User({name, phone, events: [{ eventId, visitors }], source});
      await newBookingUser.save();
    }

    const event = await Event.findById(eventId);
    event.avaliable = event.avaliable - visitorsLen;
    await event.save();
    // if (bot && queryId) {
    //   await bot.answerWebAppQuery(queryId, {
    //       type: 'article',
    //       id: queryId,
    //       title: 'Успешное бронирование',
    //       input_message_content: {
    //           message_text: `Success booking. ${visitors.length} visitors`
    //       }
    //   })
    // }
    res.status(200).send({
      message: `Success booking. ${visitors.length} visitors`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const users = await User.find({ "events.eventId": req.params.id });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteBookingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventId } = req.body;
    const user = await User.findById(id);
    const dbEvent = await Event.findById(eventId);
    if (user) {
      let userEvents = [...user.events]
      userEvents = userEvents.map(event => {
        if (event.eventId == eventId) {
          const visitorsLen = event.visitors.length;
          dbEvent.avaliable += visitorsLen;
          event.eventId = 'del'
        }
        return event;
      });
      console.log('USER', userEvents);
      user.events = userEvents;
      await dbEvent.save();
      await user.save();
      res.send({ message: 'Пользователь удален!' });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
  // Event.deleteOne({ _id: req.params.id }, (err) => {
  //   if (err) {
  //     res.status(500).send({
  //       message: err.message,
  //     });
  //   } else {
  //     res.status(200).send({
  //       message: 'Событие успешно удалено!',
  //     });
  //   }
  // });
};



module.exports = {
  addBookingEvent,
  getBookings,
  deleteBookingUser,
};