// =========================================================================
// Supabase client initialization with your keys
// =========================================================================
const SUPABASE_URL = 'https://poqklvtyihmrnldrusas.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcWtsdnR5aWhtcm5sZHJ1c2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDkzMjYsImV4cCI6MjA3Mjc4NTMyNn0.7niWoQv8dBo1dgC3e9TJooxfHuJ2oW_FLCoP5kKbQCg';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// =========================================================================

const bookingButtons = document.querySelectorAll('.book-btn');
const modal = document.getElementById('bookingModal');
const modalTitle = document.getElementById('modal-title');
const closeModalBtn = document.getElementById('close-modal');
const confirmationMessage = document.getElementById('confirmationMessage');

const calendarContainer = document.getElementById('calendar-container');
const currentMonthYearEl = document.getElementById('current-month-year');
const calendarDaysGrid = document.getElementById('calendar-days-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const timeSlotsContainer = document.getElementById('time-slots-container');
const timeSlotsGrid = document.getElementById('time-slots-grid');
const selectedDateDisplay = document.getElementById('selected-date-display');

const messageBox = document.getElementById('message-box');
const messageBoxContent = document.getElementById('message-box-content');
const closeMessageBoxBtn = document.getElementById('close-message-box');

let selectedService = '';
let selectedDate = null;
let currentDate = new Date();

let bookedSlots = new Set(); // This will store booked times from the database

// Function to fetch all bookings from Supabase and update the bookedSlots set
async function fetchAllBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*');

    if (error) {
        console.error('Error fetching all bookings:', error);
        return;
    }

    bookedSlots = new Set();
    data.forEach(booking => {
        const dateTimeString = `${booking.date}T${booking.time.replace(/ /g, '')}`;
        bookedSlots.add(dateTimeString);
    });
}

function renderCalendar() {
    calendarDaysGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthYearEl.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        calendarDaysGrid.appendChild(emptyDiv);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= lastDay; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day');

        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        // Skip Tuesday (dayOfWeek 2) and past days
        if (dayOfWeek === 2 || date < today) {
            dayDiv.classList.add('unavailable-day');
            continue;
        }

        dayDiv.classList.add('available-day');
        dayDiv.addEventListener('click', () => {
            const previouslySelected = document.querySelector('.selected-day');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected-day');
            }

            dayDiv.classList.add('selected-day');
            selectedDate = date;
            showTimeSlots();
        });
        calendarDaysGrid.appendChild(dayDiv);
    }
}

function showTimeSlots() {
    calendarContainer.classList.remove('opacity-100');
    calendarContainer.classList.add('opacity-0');

    setTimeout(() => {
        calendarContainer.style.display = 'none';
        timeSlotsContainer.style.display = 'block';

        selectedDateDisplay.textContent = selectedDate.toDateString();
        timeSlotsGrid.innerHTML = '';

        const startTime = 10 * 60; // 10 AM
        const endTime = 19 * 60; // 7 PM
        const interval = 30;

        for (let time = startTime; time < endTime; time += interval) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            const dateISO = selectedDate.toISOString().split('T')[0];
            const bookingId = `${dateISO}T${timeString}`;

            const isBooked = bookedSlots.has(bookingId);

            const button = document.createElement('button');
            button.textContent = formattedTime;
            button.className = 'py-2 px-4 text-white rounded-full transition-colors';
            
            if (isBooked) {
                button.classList.add('bg-gray-700', 'cursor-not-allowed');
                button.disabled = true;
            } else {
                button.classList.add('bg-green-600', 'hover:bg-green-500');
                button.addEventListener('click', () => {
                    handleBooking(formattedTime);
                });
            }
            timeSlotsGrid.appendChild(button);
        }

        timeSlotsContainer.classList.remove('opacity-0');
        timeSlotsContainer.classList.add('opacity-100');
    }, 500);
}

async function handleBooking(time) {
    const bookingData = {
        service: selectedService,
        date: selectedDate.toISOString().split('T')[0], // format date as 'YYYY-MM-DD'
        time: time,
    };

    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData]);

    if (error) {
        console.error('Error saving booking:', error);
        showMessageBox('There was an error confirming your booking. Please try again.');
    } else {
        console.log('Booking confirmed:', data);
        showConfirmationMessage(`Booking for "${selectedService}" on ${selectedDate.toLocaleDateString()} at ${time} confirmed!`);
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Refresh booked slots after a successful booking
        await fetchAllBookings();
    }
}

function showConfirmationMessage(message) {
    confirmationMessage.textContent = message;
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
    }, 3000);
}

function showMessageBox(message) {
    messageBoxContent.textContent = message;
    messageBox.style.display = 'block';
}

bookingButtons.forEach(button => {
    button.addEventListener('click', async () => {
        selectedService = button.dataset.service;
        modalTitle.textContent = `Book ${selectedService}`;

        await fetchAllBookings(); // Fetch all booked slots before rendering the calendar

        calendarContainer.style.display = 'block';
        calendarContainer.classList.remove('opacity-0');
        calendarContainer.classList.add('opacity-100');
        timeSlotsContainer.style.display = 'none';

        renderCalendar();
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

closeMessageBoxBtn.addEventListener('click', () => {
    messageBox.style.display = 'none';
});
