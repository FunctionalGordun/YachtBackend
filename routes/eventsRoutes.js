const express = require('express');
const router = express.Router();
const { getEvents, getEventById, updateEvent, addEvent, deleteEvent } = require('../controller/eventController');

router.get('/', getEvents);

router.get('/:id', getEventById);


router.put('/upd/:id', updateEvent);

router.post('/add', addEvent);

//delete a category
router.patch('/:id', deleteEvent);

// router.post('/payment', getPayment);

// router.post('/grooming', addFrontendGroomingEvent);

module.exports = router;
