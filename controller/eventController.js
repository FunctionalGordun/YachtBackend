const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    // const { start, end } = req.params;
    const events = await Event.find({}).sort({ _id: -1 });
    res.send(events);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getTGEvents = async () => {
  try {
    const events = await Event.find({}).sort({ _id: -1 });
    return events
  } catch (err) {
    console.log('Не удалось получить события TELEGRAM')
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.send(event);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getEvents,
  getTGEvents,
  getEventById
};