const request = require('supertest');
const app = require('../server');
const prisma = require('../config/db');

describe('College Event API', () => {
    let userToken;
    let adminToken;
    let eventId;

    beforeAll(async () => {
        await prisma.event.deleteMany();
        await prisma.user.deleteMany();

        // Register Admin
        const adminRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin Tester',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
        adminToken = adminRes.body.token;

        // Register Student
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Student Tester',
                email: 'student@test.com',
                password: 'password123',
                role: 'student'
            });
        userToken = userRes.body.token;
    });

    afterAll(async () => {
        await prisma.event.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('should create a new event when admin', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Test Event',
                description: 'A description that is long enough.',
                date: '2024-05-01',
                time: '10:00',
                capacity: 100,
                location: 'Test Venue',
                organizer: 'Test Org'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Test Event');
        eventId = res.body.data._id;
    });

    it('should fail to create event when student', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: 'Student Event',
                description: 'A description that is long enough.',
                date: '2024-05-01',
                time: '10:00',
                capacity: 10,
                location: 'Test Venue',
                organizer: 'Test Org'
            });
        
        expect(res.statusCode).toEqual(403);
    });

    it('should get all events', async () => {
        const res = await request(app).get('/api/events');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should allow student to register for an event', async () => {
        const res = await request(app)
            .post(`/api/events/${eventId}/register`)
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
