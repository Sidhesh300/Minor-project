const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'faculty', 'admin']).optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['student', 'faculty', 'admin']).optional(),
  })
});

const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Event name must be at least 3 characters').optional(),
    title: z.string().min(3).optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    venue: z.string().min(3, 'Venue must be at least 3 characters').optional(),
    location: z.string().min(3).optional(),
    capacity: z.union([z.string(), z.number()]),
    organizer: z.string().min(3, 'Organizer name must be at least 3 characters'),
  }).refine(data => data.name || data.title, {
    message: "Either name or title is required",
    path: ["name"]
  }).refine(data => data.venue || data.location, {
    message: "Either venue or location is required",
    path: ["venue"]
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  createEventSchema
};
