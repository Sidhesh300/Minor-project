require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');

dotenv.config();

const events = [
    {
        title: "Hackathon 2024",
        description: "A 24-hour coding challenge for students to solve real-world problems.",
        date: "2024-11-15T09:00:00",
        location: "Main Auditorium",
        category: "Technical",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
        price: 0,
        capacity: 100,
        organizer: "Computer Science Dept"
    },
    {
        title: "Annual Cultural Fest",
        description: "A celebration of music, dance, and arts with performances by students.",
        date: "2024-12-05T17:00:00",
        location: "College Grounds",
        category: "Cultural",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000",
        price: 200,
        capacity: 500,
        organizer: "Student Council"
    },
    {
        title: "AI & ML Workshop",
        description: "Hands-on workshop on Artificial Intelligence and Machine Learning basics.",
        date: "2024-10-20T10:00:00",
        location: "Lab room 302",
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
        price: 100,
        capacity: 50,
        organizer: "IEEE Branch"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Event.deleteMany();

        // Create an admin user
        const admin = await User.create({
            name: "Admin User",
            email: "admin@college.edu",
            password: "password123",
            role: "admin"
        });
        console.log('Admin user created');

        // Create standard user
        await User.create({
            name: "John Doe",
            email: "john@student.edu",
            password: "password123",
            role: "user"
        });
        console.log('Test user created');

        // Create initial events
        await Event.insertMany(events);
        console.log('Initial events seeded');

        console.log('Data Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
