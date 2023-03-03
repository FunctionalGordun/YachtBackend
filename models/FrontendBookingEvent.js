const mongoose = require('mongoose');
const BookingCustomer = require('../models/BookingCustomer');

const frontendBookingEventSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  rooms: {
    type: String,
    required: true,
  },
  user: {
    type: BookingCustomer,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  pets: {
    type: [{
      petId: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: false,
      },
      services: {
        type: [{
          id: {
            type: String,
            required: true,
          },
          typeId: {
            type: String,
            required: false,
          },
          status: {
            type: Boolean,
            required: false,
          },
          amount: {
            type: Number,
            required: false,
          }
        }
        ],
        required: false,
      }
    }],
    required: true,
  },
  transfer: {
    type: {
      status: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      price: {
        type: String,
        required: false,
      },
      way: {
        type: String,
        required: false,
      },
      coords: {
        type: String,
        required: false,
      },
      time: {
        type: String,
        required: false,
      },
    },
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  paid_status: {
    type: String,
    required: false,
  },
  payment_method: {
    type: String,
    required: false,
  },
  total_price: {
    type: String,
    required: false,
  },
  paid_price: {
    type: String,
    required: false,
  },
  discount: {
    type: String,
    required: false,
  },
  watched_status: {
    type: String,
    required: false,
  },
});

const FrontendBookingEvent = mongoose.model('FrontendBookingEvent', frontendBookingEventSchema);

module.exports = FrontendBookingEvent;
