const express = require('express');
const router = express.Router();
const { addBookingEvent, getBookings } = require('../controller/bookingController');

router.post('/add', addBookingEvent);

router.get('/:id', getBookings);

// router.get('/:id', getEventById);

module.exports = router;
