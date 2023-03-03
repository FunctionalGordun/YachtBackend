const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controller/eventController');

router.get('/', getEvents);

router.get('/:id', getEventById);

// router.post('/payment', getPayment);

// router.post('/grooming', addFrontendGroomingEvent);

module.exports = router;
