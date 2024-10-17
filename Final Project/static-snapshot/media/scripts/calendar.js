// Define an array to store events
const events = [];
 
// letiables to store event input fields and reminder list
const eventDateInput = document.getElementById("eventDate");
const eventTitleInput = document.getElementById("eventTitle");
const eventDescriptionInput = document.getElementById("eventDescription");
const reminderList = document.getElementById("reminderList");
 
// Counter to generate unique event IDs
let eventIdCounter = 1;
 
// Function to add events
function addEvent() {
    const date = eventDateInput.value;
    const title = eventTitleInput.value;
    const description = eventDescriptionInput.value;
 
    if (date && title) {
        // Create a unique event ID
        const eventId = eventIdCounter++;
 
        events.push({
            id: eventId,
            date: date,
            title: title,
            description: description
        });
        
        showCalendar(currentMonth, currentYear);
        eventDateInput.value = "";
        eventTitleInput.value = "";
        eventDescriptionInput.value = "";
        displayReminders();
    }
}
 
// Function to delete an event by ID
function deleteEvent(eventId) {
    // Find the index of the event with the given ID
    const eventIndex = events.findIndex((event) => event.id === eventId);
 
    if (eventIndex !== -1) {
        // Remove the event from the events array
        events.splice(eventIndex, 1);
        showCalendar(currentMonth, currentYear);
        displayReminders();
    }
}
 
// Function to display reminders
function displayReminders() {
    reminderList.innerHTML = "";
    for (const event of events) {
        const eventDate = new Date(event.date);
        if (
            eventDate.getMonth() === currentMonth &&
            eventDate.getFullYear() === currentYear
        ) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${event.title}</strong> - 
                ${event.description} on 
                ${eventDate.toLocaleDateString()}`;

            // Add a delete button for each reminder item
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-event";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteEvent(event.id);
            };

            listItem.appendChild(deleteButton);
            reminderList.appendChild(listItem);
        }
    }
}
 
// Function to generate a range of 
// years for the year select input
function generate_year_range(start, end) {
    let years = "";
    for (let year = start; year <= end; year++) {
        years += `<option value='${year}'>${year}</option>`;
    }
    return years;
}
 
// Initialize date-related letiables
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const selectYear = document.getElementById("year");
const selectMonth = document.getElementById("month");
 
createYear = generate_year_range(1970, 2050);
 
document.getElementById("year").innerHTML = createYear;
 
const calendar = document.getElementById("calendar");
 
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const days = [
    "Sun", "Mon", "Tue", "Wed",
    "Thu", "Fri", "Sat"];
 
const dataHead = days.map(day => `<th data-days='${day}'>${day}</th>`).join("");
document.getElementById("thead-month").innerHTML = `<tr>${dataHead}</tr>`;
 
const monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);
 
// Function to navigate to the next month
function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

// Function to navigate to the previous month
function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}
 
// Function to jump to a specific month and year
function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}
 
// Function to display the calendar
function showCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const tableBody = document.getElementById("calendar-body");
    tableBody.innerHTML = "";
    monthAndYear.innerHTML = `${months[month]} ${year}`;
    selectYear.value = year;
    selectMonth.value = month;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell, cellText;

            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = createCalendarCell(date, month, year);
                row.appendChild(cell);
                date++;
            }
        }
        tableBody.appendChild(row);
    }

    displayReminders();
}

// Function to create a calendar cell
function createCalendarCell(date, month, year) {
    const cell = document.createElement("td");
    cell.setAttribute("data-date", date);
    cell.setAttribute("data-month", month + 1);
    cell.setAttribute("data-year", year);
    cell.setAttribute("data-month_name", months[month]);
    cell.className = "date-picker";
    
    const link = document.createElement("a");
    link.href = `events.html?d=${date}`;
    link.target =`_blank`;
    link.innerHTML = `<span>${date}</span>`;
    link.classList.add("calendar-link");
    cell.appendChild(link); 

    if (isToday(date, month, year)) {
        cell.classList.add("date-picker", "selected");
    }

    if (hasEventOnDate(date, month, year)) {
        cell.classList.add("event-marker");
        cell.appendChild(createEventTooltip(date, month, year));
    }

    return cell;
}

// Function to check if a date is today
function isToday(date, month, year) {
    return (
        date === today.getDate() &&
        year === today.getFullYear() &&
        month === today.getMonth()
    );
}
 
// Function to create an event tooltip
function createEventTooltip(date, month, year) {
    const tooltip = document.createElement("div");
    tooltip.className = "event-tooltip";

    const eventsOnDate = getEventsOnDate(date, month, year);
    eventsOnDate.forEach(event => {
        const eventDate = new Date(event.date);
        const eventText = `<strong>${event.title}</strong> - ${event.description} on ${eventDate.toLocaleDateString()}`;
        const eventElement = document.createElement("p");
        eventElement.innerHTML = eventText;
        tooltip.appendChild(eventElement);
    });

    return tooltip;
}

function getAndCheckEventsOnDate(date, month, year) {
    const eventsOnDate = getEventsOnDate(date, month, year);
    return {
        eventsOnDate,
        hasEvents: eventsOnDate.length > 0,
    };
}
 
// Function to get events on a specific date
function getEventsOnDate(date, month, year) {
    const eventDate = new Date(year, month, date);
    return events.filter(event => {
        const eventDateObj = new Date(event.date);
        return eventDateObj.toDateString() === eventDate.toDateString();
    });
}
 
// Function to check if there are events on a specific date
function hasEventOnDate(date, month, year) {
    return getEventsOnDate(date, month, year).length > 0;
}
 
// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
 
// Call the showCalendar function initially to display the calendar
showCalendar(currentMonth, currentYear);