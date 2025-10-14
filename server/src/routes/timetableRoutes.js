const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');


router.get('/events', timetableController.getAllEvents);


router.get('/events/:id', timetableController.getEventById);


router.post('/events', timetableController.createEvent);


router.put('/events/:id', timetableController.updateEvent);

router.delete('/events/:id', timetableController.deleteEvent);

module.exports = router;