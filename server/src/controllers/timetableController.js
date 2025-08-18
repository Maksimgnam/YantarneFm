const TimetableEvent = require('../models/TimetableEvent');

// Get all timetable events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await TimetableEvent.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching timetable events:', error);
    res.status(500).json({ message: 'Failed to fetch timetable events' });
  }
};

// Create a new timetable event
exports.createEvent = async (req, res) => {
  try {
    const { title, start_time, end_time, days, date, color } = req.body;
    
    if (!title || !start_time || !end_time) {
      return res.status(400).json({ message: 'Title, start time and end time are required' });
    }
    
    const newEvent = new TimetableEvent({
      title,
      start_time,
      end_time,
      days: days || [],
      date: date || null,
      color: color || '#6FA9F5'
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating timetable event:', error);
    res.status(500).json({ message: 'Failed to create timetable event' });
  }
};

// Update an existing timetable event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start_time, end_time, days, date, color } = req.body;
    
    const updatedEvent = await TimetableEvent.findByIdAndUpdate(
      id,
      { title, start_time, end_time, days, date, color },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Timetable event not found' });
    }
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating timetable event:', error);
    res.status(500).json({ message: 'Failed to update timetable event' });
  }
};

// Delete a timetable event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEvent = await TimetableEvent.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Timetable event not found' });
    }
    
    res.status(200).json({ message: 'Timetable event deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable event:', error);
    res.status(500).json({ message: 'Failed to delete timetable event' });
  }
};

// Get a single timetable event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await TimetableEvent.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Timetable event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching timetable event:', error);
    res.status(500).json({ message: 'Failed to fetch timetable event' });
  }
};