const express = require('express');
const router = express.Router();
const {
  getAllBookingEvents,
  getBookingEventsByUserId,
  getBookingEventsByRoomId,
  getBookingEventById,
  addBookingEvent,
  updateBookingEvent,
  updateBookingServiceStatus,
  updateBookingWatchedStatus,
  updateBookingDiscount,
  updateBookingPaid,
  deleteBookingEvent,
} = require('../controller/bookingEventController');

router.get('/events/:active', getAllBookingEvents);

router.get('/:roomId', getBookingEventsByRoomId);

router.get('/user/:userId', getBookingEventsByUserId);

router.get('/event/:eventId', getBookingEventById);

router.post('/add', addBookingEvent);

router.put('/:id', updateBookingEvent);

router.put('/service/:eventId/:serviceId', updateBookingServiceStatus);

router.put('/watched/:eventId', updateBookingWatchedStatus);

router.put('/discount/:eventId', updateBookingDiscount);

router.put('/paid/:eventId', updateBookingPaid);

router.delete('/:id', deleteBookingEvent);

module.exports = router;
