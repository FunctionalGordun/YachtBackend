const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  specialprice: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  avaliable: {
    type: Number,
    required: true,
  },
  address: {
    type: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
