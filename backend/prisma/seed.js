const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const dummyUsers = [
    { name: "Raj Kumar", email: "raj@college.edu", password: "student123", role: "student" },
    { name: "Priya Singh", email: "priya@college.edu", password: "student456", role: "student" },
    { name: "Dr. Sharma", email: "sharma@college.edu", password: "faculty123", role: "faculty" },
    { name: "Admin User", email: "admin@college.edu", password: "admin123", role: "admin" }
];

const dummyEvents = [
    {
        title: "Annual Tech Symposium",
        description: "A comprehensive symposium covering latest technologies and innovations in the industry.",
        date: "2024-02-15",
        time: "10:00",
        location: "Main Auditorium",
        capacity: 500,
        organizer: "IT Department",
        status: "upcoming",
        image: "assets/images/tech-event.svg",
    },
    {
        title: "Sports Day 2024",
        description: "Annual sports competition featuring various games and athletic events.",
        date: "2024-02-20",
        time: "09:00",
        location: "College Ground",
        capacity: 1000,
        organizer: "Sports Committee",
        status: "upcoming",
        image: "assets/images/sports-event.svg",
    },
    {
        title: "Cultural Fest",
        description: "Showcase of cultural performances, music, dance, and traditional arts.",
        date: "2024-01-25",
        time: "18:00",
        location: "Open Air Theatre",
        capacity: 800,
        organizer: "Cultural Club",
        status: "ongoing",
        image: "assets/images/cultural-event.svg",
    },
    {
        title: "Seminar on AI & Machine Learning",
        description: "Expert-led seminar discussing latest trends in AI and ML applications.",
        date: "2024-01-10",
        time: "14:00",
        location: "Lecture Hall-1",
        capacity: 300,
        organizer: "Computer Science Department",
        status: "completed",
        image: "assets/images/tech-event.svg",
    }
];

async function main() {
    console.log('Start seeding...');
    
    // Seed users
    for (const u of dummyUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
            },
        });
    }

    // Seed events
    for (const e of dummyEvents) {
        // Just create them since upsert without unique fields other than id is hard
        // Delete all first just in case
        await prisma.event.create({
            data: e
        });
    }
    
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
