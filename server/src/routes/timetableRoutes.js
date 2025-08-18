const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// Get all timetable events
router.get('/events', timetableController.getAllEvents);

// Get a single timetable event by ID
router.get('/events/:id', timetableController.getEventById);

// Create a new timetable event
router.post('/events', timetableController.createEvent);

// Update an existing timetable event
router.put('/events/:id', timetableController.updateEvent);

// Delete a timetable event
router.delete('/events/:id', timetableController.deleteEvent);

module.exports = router;