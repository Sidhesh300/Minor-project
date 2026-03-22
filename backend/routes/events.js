const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    registerForEvent,
    deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createEventSchema } = require('../schemas');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('admin', 'faculty'), validate(createEventSchema), createEvent);

router.route('/:id')
    .get(getEvent)
    .delete(protect, authorize('admin', 'faculty'), deleteEvent);

router.post('/:id/register', protect, authorize('student', 'user'), registerForEvent);

module.exports = router;
