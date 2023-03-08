const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const { isFull = false } = req?.query || {};
    var isTrueFull = isFull === 'true';
    const events = await Event.find(isTrueFull ? {} : { active: true }).sort({ _id: -1 });
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

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (event) {
      event.image = req.body.image;
      event.title = req.body.title;
      event.date = req.body.date;
      event.description = req.body.description;
      event.price = req.body.price;
      event.specialprice = req.body.specialprice;
      event.capacity = req.body.capacity;
      event.avaliable = req.body.avaliable;
      event.address = req.body.address;
      event.active = req.body.active;
      await event.save();
      res.send({ message: 'Событие обновлено!' });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(200).send({
      message: 'Событие успешно добавлена!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteEvent = (req, res) => {
  Event.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: 'Событие успешно удалено!',
      });
    }
  });
};

const hideEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (event) {
      event.active = req.body.status;
      await event.save();
      res.send({ message: 'Событие обновлено!' });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getEvents,
  getTGEvents,
  getEventById,
  updateEvent,
  addEvent,
  deleteEvent,
  hideEvent
};