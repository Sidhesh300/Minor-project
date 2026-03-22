const prisma = require('../config/db');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: { registeredUsers: true },
            orderBy: { createdAt: 'desc' }
        });
        
        // Map Prisma format to match what frontend expects (e.g. registeredCount and mapping registeredUsers to simple IDs)
        const formattedEvents = events.map(event => ({
            ...event,
            _id: event.id, // For backward compatibility
            name: event.title,
            venue: event.location,
            registeredCount: event.registeredUsers.length,
            registeredUsers: event.registeredUsers.map(u => u.id)
        }));

        res.status(200).json({ success: true, count: events.length, data: formattedEvents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: { registeredUsers: true }
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const formattedEvent = {
            ...event,
            _id: event.id,
            name: event.title,
            venue: event.location,
            registeredCount: event.registeredUsers.length,
            registeredUsers: event.registeredUsers.map(u => u.id)
        };

        res.status(200).json({ success: true, data: formattedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin|Faculty
exports.createEvent = async (req, res) => {
    try {
        // Prepare the payload for prisma
        const { name, title, capacity, venue, location, ...rest } = req.body;
        
        // Map frontend back to backend schema
        const eventTitle = title || name;
        const eventLocation = location || venue;

        const event = await prisma.event.create({
            data: {
                title: eventTitle,
                location: eventLocation,
                capacity: parseInt(capacity),
                ...rest
            }
        });

        res.status(201).json({ 
            success: true, 
            data: { 
                ...event, 
                _id: event.id, 
                name: event.title, 
                venue: event.location 
            } 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: { registeredUsers: true }
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if user is already registered
        const isRegistered = event.registeredUsers.some(u => u.id === req.user.id);
        if (isRegistered) {
            return res.status(400).json({ success: false, message: 'User already registered for this event' });
        }

        // Check capacity
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }

        // Add user to event via implicit many-to-many
        await prisma.event.update({
            where: { id: req.params.id },
            data: {
                registeredUsers: {
                    connect: { id: req.user.id }
                }
            }
        });

        res.status(200).json({ success: true, message: 'Successfully registered for event' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
    try {
        const eventExists = await prisma.event.findUnique({ where: { id: req.params.id } });
        if (!eventExists) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        await prisma.event.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
