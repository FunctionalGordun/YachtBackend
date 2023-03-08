const express = require('express');
const router = express.Router();
const { addBookingEvent, getBookings, deleteBookingUser } = require('../controller/bookingController');

router.post('/add', addBookingEvent);

router.get('/:id', getBookings);

router.put('/:id', deleteBookingUser);

// router.get('/:id', getEventById);

module.exports = router;
