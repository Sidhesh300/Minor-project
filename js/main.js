// ========================================
// COLLEGE EVENT MANAGEMENT SYSTEM
// JavaScript - Main.js
// ========================================

// ========================================
// DUMMY DATA
// ========================================

const dummyEvents = [
    {
        id: 1,
        name: "Annual Tech Symposium",
        description: "A comprehensive symposium covering latest technologies and innovations in the industry.",
        date: "2024-02-15",
        time: "10:00",
        venue: "Main Auditorium",
        capacity: 500,
        organizer: "IT Department",
        status: "upcoming",
        registeredCount: 350,
        registeredUsers: [1, 2],
        image: "assets/images/tech-event.svg",
        emoji: "💻"
    },
    {
        id: 2,
        name: "Sports Day 2024",
        description: "Annual sports competition featuring various games and athletic events.",
        date: "2024-02-20",
        time: "09:00",
        venue: "College Ground",
        capacity: 1000,
        organizer: "Sports Committee",
        status: "upcoming",
        registeredCount: 450,
        registeredUsers: [1],
        image: "assets/images/sports-event.svg",
        emoji: "🏆"
    },
    {
        id: 3,
        name: "Cultural Fest",
        description: "Showcase of cultural performances, music, dance, and traditional arts.",
        date: "2024-01-25",
        time: "18:00",
        venue: "Open Air Theatre",
        capacity: 800,
        organizer: "Cultural Club",
        status: "ongoing",
        registeredCount: 600,
        registeredUsers: [1, 2, 3],
        image: "assets/images/cultural-event.svg",
        emoji: "🎭"
    },
    {
        id: 4,
        name: "Seminar on AI & Machine Learning",
        description: "Expert-led seminar discussing latest trends in AI and ML applications.",
        date: "2024-01-10",
        time: "14:00",
        venue: "Lecture Hall-1",
        capacity: 300,
        organizer: "Computer Science Department",
        status: "completed",
        registeredCount: 250,
        registeredUsers: [1, 3],
        image: "assets/images/tech-event.svg",
        emoji: "🤖"
    },
    {
        id: 5,
        name: "Hackathon 2024",
        description: "24-hour coding competition where teams build innovative solutions.",
        date: "2024-03-01",
        time: "08:00",
        venue: "Computer Lab",
        capacity: 200,
        organizer: "Coding Club",
        status: "upcoming",
        registeredCount: 150,
        registeredUsers: [2],
        image: "assets/images/tech-event.svg",
        emoji: "💡"
    },
    {
        id: 6,
        name: "Guest Lecture by Industry Expert",
        description: "Learn about career opportunities and industry insights from professionals.",
        date: "2024-02-10",
        time: "11:00",
        venue: "Seminar Room",
        capacity: 150,
        organizer: "Placement Cell",
        status: "upcoming",
        registeredCount: 120,
        registeredUsers: [],
        image: "assets/images/event-placeholder.svg",
        emoji: "🎓"
    }
];

// ========================================
// LOAD UPCOMING EVENTS ON HOME PAGE
// ======================================== 

function loadUpcomingEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;

    const upcomingEvents = dummyEvents.filter(event => event.status === 'upcoming').slice(0, 6);
    
    eventsContainer.innerHTML = upcomingEvents.map(event => {
        const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="event-item">
                <div class="event-image">${event.emoji}</div>
                <div class="event-content">
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-title">${event.name}</div>
                    <div class="event-venue">📍 ${event.venue}</div>
                    <div class="event-capacity">👥 ${event.registeredCount}/${event.capacity} registered</div>
                    <a href="events.html" class="btn btn-primary" style="width: 100%; text-align: center;">View Details</a>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEvents();
});

// Original dummy users

const dummyUsers = [
    { id: 1, name: "Raj Kumar", email: "raj@college.edu", password: "student123", role: "student", registeredEvents: [1, 2, 3, 4] },
    { id: 2, name: "Priya Singh", email: "priya@college.edu", password: "student456", role: "student", registeredEvents: [1, 2, 3, 5] },
    { id: 3, name: "Dr. Sharma", email: "sharma@college.edu", password: "faculty123", role: "faculty", registeredEvents: [4] },
    { id: 4, name: "Admin User", email: "admin@college.edu", password: "admin123", role: "admin", registeredEvents: [] }
];

// ========================================
// STATE MANAGEMENT
// ========================================

let currentUser = null;
let events = [...dummyEvents];
let users = [...dummyUsers];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }

    // Initialize page-specific functionality
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }
    if (document.getElementById('registerForm')) {
        initRegisterPage();
    }
    if (document.body.classList.contains('dashboard-container')) {
        // Dashboard pages
        initDashboard();
        initEvents();
        initCreateEvent();
        initProfile();
    }

    // Logout buttons
    document.querySelectorAll('[id^="logoutBtn"]').forEach(btn => {
        btn.addEventListener('click', logout);
    });
});

// ========================================
// LOGIN PAGE
// ========================================

function initLoginPage() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorMessages();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const role = document.getElementById('loginRole').value;

        // Validation
        let isValid = true;
        
        if (!email) {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Please enter a valid email');
            isValid = false;
        }

        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }

        if (!role) {
            showError('roleError', 'Please select a role');
            isValid = false;
        }

        if (!isValid) return;

        // Find user
        const user = users.find(u => u.email === email && u.password === password && u.role === role);

        if (user) {
            currentUser = { ...user };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showSuccess('loginMessage', 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showError('loginMessage', 'Invalid email, password, or role. Please try again.');
        }
    });
}

// ========================================
// REGISTER PAGE
// ========================================

function initRegisterPage() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorMessages();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const role = document.getElementById('registerRole').value;

        // Validation
        let isValid = true;

        if (!name || name.length < 3) {
            showError('nameError', 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!email) {
            showError('regEmailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('regEmailError', 'Please enter a valid email');
            isValid = false;
        } else if (users.some(u => u.email === email)) {
            showError('regEmailError', 'Email already registered');
            isValid = false;
        }

        if (!password || password.length < 6) {
            showError('regPasswordError', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        if (!role) {
            showError('regRoleError', 'Please select a role');
            isValid = false;
        }

        if (!isValid) return;

        // Create new user
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            password: password,
            role: role,
            registeredEvents: []
        };

        users.push(newUser);
        currentUser = { ...newUser };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showSuccess('registerMessage', 'Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}

// ========================================
// DASHBOARD
// ========================================

function initDashboard() {
    if (!currentUser) return;

    updateUserGreeting();
    renderDashboard();
}

function renderDashboard() {
    const role = currentUser.role;

    // Hide all dashboards
    document.getElementById('studentDashboard') && (document.getElementById('studentDashboard').style.display = 'none');
    document.getElementById('facultyDashboard') && (document.getElementById('facultyDashboard').style.display = 'none');
    document.getElementById('adminDashboard') && (document.getElementById('adminDashboard').style.display = 'none');

    // Show sidebar menu based on role
    const adminMenus = document.querySelectorAll('[id^="adminMenu"]');
    const facultyMenus = document.querySelectorAll('[id^="facultyMenu"]');
    
    adminMenus.forEach(menu => menu.style.display = role === 'admin' ? 'block' : 'none');
    facultyMenus.forEach(menu => menu.style.display = role === 'faculty' ? 'block' : 'none');

    if (role === 'student') {
        renderStudentDashboard();
    } else if (role === 'faculty') {
        renderFacultyDashboard();
    } else if (role === 'admin') {
        renderAdminDashboard();
    }
}

function renderStudentDashboard() {
    const studentDashboard = document.getElementById('studentDashboard');
    if (!studentDashboard) return;
    
    studentDashboard.style.display = 'block';

    const registeredEvents = events.filter(e => e.registeredUsers.includes(currentUser.id));
    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const completedEvents = events.filter(e => e.status === 'completed');

    document.getElementById('studentRegisteredCount').textContent = registeredEvents.length;
    document.getElementById('upcomingCount').textContent = upcomingEvents.length;
    document.getElementById('completedCount').textContent = completedEvents.length;

    const eventsList = document.getElementById('studentEventsList');
    eventsList.innerHTML = '';

    if (registeredEvents.length === 0) {
        eventsList.innerHTML = '<p>You haven\'t registered for any events yet.</p>';
        return;
    }

    registeredEvents.forEach(event => {
        eventsList.appendChild(createEventListItem(event));
    });
}

function renderFacultyDashboard() {
    const facultyDashboard = document.getElementById('facultyDashboard');
    if (!facultyDashboard) return;
    
    facultyDashboard.style.display = 'block';

    const createdEvents = events.filter(e => e.organizer === currentUser.name);
    const totalRegistrations = createdEvents.reduce((sum, e) => sum + e.registeredCount, 0);

    document.getElementById('facultyCreatedCount').textContent = createdEvents.length;
    document.getElementById('totalRegistrations').textContent = totalRegistrations;

    const eventsList = document.getElementById('facultyEventsList');
    eventsList.innerHTML = '';

    if (createdEvents.length === 0) {
        eventsList.innerHTML = '<p>You haven\'t created any events yet.</p>';
        return;
    }

    createdEvents.forEach(event => {
        eventsList.appendChild(createEventListItem(event, true));
    });
}

function renderAdminDashboard() {
    const adminDashboard = document.getElementById('adminDashboard');
    if (!adminDashboard) return;
    
    adminDashboard.style.display = 'block';

    const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);

    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('adminTotalReg').textContent = totalRegistrations;

    const eventsList = document.getElementById('adminEventsList');
    eventsList.innerHTML = '';

    events.forEach(event => {
        eventsList.appendChild(createEventListItem(event, true));
    });
}

// ========================================
// EVENTS PAGE
// ========================================

function initEvents() {
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const modalClose = document.querySelector('.modal-close');

    if (statusFilter) {
        statusFilter.addEventListener('change', filterAndRenderEvents);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderEvents);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeEventModal);
    }

    if (!currentUser) return;
    updateUserGreeting();
    filterAndRenderEvents();
}

function filterAndRenderEvents() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';

    let filteredEvents = events.filter(event => {
        const matchStatus = !statusFilter || event.status === statusFilter;
        const matchSearch = event.name.toLowerCase().includes(searchInput) || 
                          event.organizer.toLowerCase().includes(searchInput) ||
                          event.venue.toLowerCase().includes(searchInput);
        return matchStatus && matchSearch;
    });

    const eventsGrid = document.getElementById('eventsGrid');
    const noEventsMessage = document.getElementById('noEventsMessage');

    if (!eventsGrid) return;

    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '';
        noEventsMessage.style.display = 'block';
        return;
    }

    noEventsMessage.style.display = 'none';
    eventsGrid.innerHTML = '';

    filteredEvents.forEach(event => {
        eventsGrid.appendChild(createEventCard(event));
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const statusColor = {
        upcoming: 'upcoming',
        ongoing: 'ongoing',
        completed: 'completed'
    };

    const registrationPercentage = Math.round((event.registeredCount / event.capacity) * 100);
    const isRegistered = currentUser && event.registeredUsers.includes(currentUser.id);

    const canRegister = currentUser && currentUser.role === 'student' && !isRegistered && event.status === 'upcoming';

    card.innerHTML = `
        <img src="${event.image}" alt="${event.name}" class="event-card-image">
        <div class="event-card-header">
            <h3>${event.name}</h3>
            <span class="event-status ${statusColor[event.status]}">${event.status}</span>
        </div>
        <div class="event-card-body">
            <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
            <p><strong>🕐 Time:</strong> ${event.time}</p>
            <p><strong>📍 Venue:</strong> ${event.venue}</p>
            <p><strong>👤 Organizer:</strong> ${event.organizer}</p>
            <p><strong>👥 Capacity:</strong> ${event.registeredCount}/${event.capacity} (${registrationPercentage}%)</p>
            <p><strong>📝 Description:</strong> ${event.description}</p>
        </div>
        <div class="event-card-footer">
            <button class="btn btn-primary view-event" data-id="${event.id}">View Details</button>
            ${canRegister ? `<button class="btn btn-success register-event" data-id="${event.id}">Register</button>` : ''}
            ${isRegistered ? `<span class="text-success">✓ Registered</span>` : ''}
        </div>
    `;

    // View details
    card.querySelector('.view-event').addEventListener('click', () => showEventModal(event));

    // Register button
    const registerBtn = card.querySelector('.register-event');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => registerForEvent(event.id));
    }

    return card;
}

function createEventListItem(event, showStats = false) {
    const item = document.createElement('div');
    item.className = 'event-card';

    const registrationPercentage = Math.round((event.registeredCount / event.capacity) * 100);
    const isRegistered = event.registeredUsers.includes(currentUser.id);

    let statsHTML = '';
    if (showStats) {
        statsHTML = `<p><strong>Registrations:</strong> ${event.registeredCount}/${event.capacity} (${registrationPercentage}%)</p>`;
    }

    item.innerHTML = `
        <div class="event-card-header">
            <h3>${event.name}</h3>
            <span class="event-status ${event.status}">${event.status}</span>
        </div>
        <div class="event-card-body">
            <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
            <p><strong>🕐 Time:</strong> ${event.time}</p>
            <p><strong>📍 Venue:</strong> ${event.venue}</p>
            <p><strong>👤 Organizer:</strong> ${event.organizer}</p>
            ${statsHTML}
        </div>
    `;

    return item;
}

function showEventModal(event) {
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalEventDetails');
    const modalActions = document.getElementById('modalActions');

    const isRegistered = currentUser && event.registeredUsers.includes(currentUser.id);
    const canRegister = currentUser && currentUser.role === 'student' && !isRegistered && event.status === 'upcoming';

    const registrationPercentage = Math.round((event.registeredCount / event.capacity) * 100);

    let actionsHTML = '';
    if (canRegister) {
        actionsHTML = `<button class="btn btn-success" onclick="registerForEvent(${event.id})">Register for Event</button>`;
    } else if (isRegistered) {
        actionsHTML = '<span class="text-success"><strong>✓ You are registered for this event</strong></span>';
    }

    modalContent.innerHTML = `
        <h2>${event.name}</h2>
        <p><strong>Description:</strong></p>
        <p>${event.description}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e2e8f0;">
        <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
        <p><strong>🕐 Time:</strong> ${event.time}</p>
        <p><strong>📍 Venue:</strong> ${event.venue}</p>
        <p><strong>👤 Organizer:</strong> ${event.organizer}</p>
        <p><strong>👥 Registrations:</strong> ${event.registeredCount}/${event.capacity} (${registrationPercentage}%)</p>
    `;

    modalActions.innerHTML = actionsHTML || '';

    modal.style.display = 'flex';

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEventModal();
        }
    });
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
}

function registerForEvent(eventId) {
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.registeredUsers.includes(currentUser.id)) {
        alert('You are already registered for this event');
        return;
    }

    if (event.registeredCount >= event.capacity) {
        alert('This event is full');
        return;
    }

    // Register user
    event.registeredUsers.push(currentUser.id);
    event.registeredCount++;
    currentUser.registeredEvents.push(eventId);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    alert('Successfully registered for ' + event.name);
    closeEventModal();
    filterAndRenderEvents();
}

// ========================================
// CREATE EVENT PAGE
// ========================================

function initCreateEvent() {
    if (!currentUser) return;

    const form = document.getElementById('createEventForm');
    if (!form) return;

    // Only allow faculty and admin
    if (currentUser.role !== 'faculty' && currentUser.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    updateUserGreeting();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorMessages();

        const name = document.getElementById('eventName').value.trim();
        const description = document.getElementById('eventDescription').value.trim();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const venue = document.getElementById('eventVenue').value.trim();
        const capacity = parseInt(document.getElementById('eventCapacity').value);
        const organizer = document.getElementById('eventOrganizer').value.trim();

        // Validation
        let isValid = true;

        if (!name || name.length < 3) {
            showError('eventNameError', 'Event name must be at least 3 characters');
            isValid = false;
        }

        if (!description || description.length < 10) {
            showError('descriptionError', 'Description must be at least 10 characters');
            isValid = false;
        }

        if (!date) {
            showError('dateError', 'Date is required');
            isValid = false;
        }

        if (!time) {
            showError('timeError', 'Time is required');
            isValid = false;
        }

        if (!venue || venue.length < 3) {
            showError('venueError', 'Venue must be at least 3 characters');
            isValid = false;
        }

        if (!capacity || capacity < 1) {
            showError('capacityError', 'Capacity must be at least 1');
            isValid = false;
        }

        if (!organizer || organizer.length < 3) {
            showError('organizerError', 'Organizer name must be at least 3 characters');
            isValid = false;
        }

        if (!isValid) return;

        // Determine event status
        const eventDate = new Date(date + 'T' + time);
        const now = new Date();
        let status = 'upcoming';
        if (eventDate < now) {
            status = 'completed';
        }

        // Create new event
        const newEvent = {
            id: events.length + 1,
            name: name,
            description: description,
            date: date,
            time: time,
            venue: venue,
            capacity: capacity,
            organizer: organizer,
            status: status,
            registeredCount: 0,
            registeredUsers: []
        };

        events.push(newEvent);
        showSuccess('createEventMessage', 'Event created successfully!');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}

// ========================================
// PROFILE PAGE
// ========================================

function initProfile() {
    if (!currentUser) return;

    updateUserGreeting();
    loadProfileData();
    initProfileModals();
}

function loadProfileData() {
    const registeredEventsCount = currentUser.registeredEvents.length;
    const createdEventsCount = events.filter(e => e.organizer === currentUser.name).length;

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

    document.getElementById('detailName').textContent = currentUser.name;
    document.getElementById('detailEmail').textContent = currentUser.email;
    document.getElementById('detailRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    document.getElementById('memberSince').textContent = new Date().toLocaleDateString();

    document.getElementById('profileEventCount').textContent = registeredEventsCount;
    document.getElementById('profileCreatedCount').textContent = createdEventsCount;
}

function initProfileModals() {
    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }

    // Change Password Button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openChangePasswordModal);
    }

    // Delete Account Button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }

    // Close modal buttons
    document.querySelectorAll('.close-modal, .modal-close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Edit Profile Form
    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditProfile);
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
    }

    // Change Password Form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handleChangePassword);
    }
}

function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function handleEditProfile(e) {
    e.preventDefault();
    
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();

    if (!newName || newName.length < 3) {
        alert('Name must be at least 3 characters');
        return;
    }

    if (!isValidEmail(newEmail)) {
        alert('Invalid email');
        return;
    }

    // Update user
    currentUser.name = newName;
    currentUser.email = newEmail;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...currentUser };
    }

    alert('Profile updated successfully');
    document.getElementById('editProfileModal').style.display = 'none';
    loadProfileData();
}

function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect');
        return;
    }

    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
    }

    // Update password
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...currentUser };
    }

    alert('Password changed successfully');
    document.getElementById('changePasswordModal').style.display = 'none';
    document.getElementById('changePasswordForm').reset();
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
        }
        localStorage.removeItem('currentUser');
        alert('Account deleted successfully');
        window.location.href = 'index.html';
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    updateUserGreeting();
}

function updateUserGreeting() {
    if (!currentUser) return;
    
    const greetings = document.querySelectorAll('[id^="userGreeting"]');
    greetings.forEach(greeting => {
        greeting.textContent = `Hi, ${currentUser.name}`;
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'message-container success';
        element.style.display = 'block';
    }
}

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    document.querySelectorAll('.message-container').forEach(el => {
        el.textContent = '';
        el.className = 'message-container';
        el.style.display = 'none';
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// ========================================
// CLOSE MODALS ON ESCAPE KEY
// ========================================

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// ========================================
// CLOSE MODALS ON BACKGROUND CLICK
// ========================================

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});
