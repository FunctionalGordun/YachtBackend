const express = require('express');
const router = express.Router();
const { getEvents, getEventById, updateEvent, addEvent, deleteEvent, hideEvent } = require('../controller/eventController');

router.get('/', getEvents);

router.get('/:id', getEventById);


router.put('/upd/:id', updateEvent);

router.post('/add', addEvent);

// router.patch('/:id', deleteEvent);

router.put('/hide/:id', hideEvent);

// router.post('/payment', getPayment);

// router.post('/grooming', addFrontendGroomingEvent);

module.exports = router;
