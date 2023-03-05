const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    events: {
      type: [{
        eventId: {
          type: String,
          required: true,
        },
        visitors: {
          type: [String],
          required: true,
        }
      }],
      required: false,
    },
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
