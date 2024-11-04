// Initialize an array to store events
let events = [];

// Function to add an event
function addEvent() {
  const eventName = document.getElementById("Name of event").value;
  const eventDate = document.getElementById("Date of event").value;

  if (!eventName || !eventDate) {
    alert("Please enter both event name and date!");
    return;
  }

  // Create an event object and add it to the events array
  const event = { name: eventName, date: new Date(eventDate).getTime() };
  events.push(event);

  // Save events to local storage
  localStorage.setItem("events", JSON.stringify(events));

  // Clear the input fields
  document.getElementById("Name of event").value = "";
  document.getElementById("Date of event").value = "";

  // Display the updated list of events
  displayCountdowns();
}

// Function to calculate the time left for an event
function getTimeLeft(eventDate) {
  const now = new Date().getTime();
  const timeLeft = eventDate - now;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, timeLeft };
}

// Function to display countdowns for all events
function displayCountdowns() {
  const countdownDisplay = document.getElementById("countdown-display");
  countdownDisplay.innerHTML = "";

  events.forEach((event, index) => {
    const { days, hours, minutes, seconds, timeLeft } = getTimeLeft(event.date);

    const eventElement = document.createElement("div");
    eventElement.className = "countdown-item";

    // Check if the countdown has ended
    if (timeLeft <= 0) {
      eventElement.innerHTML = `
        <div class="card text-center border-primary">
          <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p>Event has started!</p>
            <button onclick="deleteEvent(${index})" class="btn btn-danger">Delete</button>
          </div>
        </div>
      `;

      // Send notification if the event has reached the allocated time
      if (Notification.permission === "granted") {
        new Notification("Event Countdown", {
          body: `The event "${event.name}" is happening now!`
        });
      }
    } else {
      eventElement.innerHTML = `
        <div class="card text-center border-primary">
          <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p>${days}d ${hours}h ${minutes}m ${seconds}s</p>
            <button onclick="deleteEvent(${index})" class="btn btn-danger">Delete</button>
          </div>
        </div>
      `;
    }

    countdownDisplay.appendChild(eventElement);
  });
}

// Function to delete an event
function deleteEvent(index) {
  // Remove the event from the array
  events.splice(index, 1);

  // Update local storage with the modified events array
  localStorage.setItem("events", JSON.stringify(events));

  // Refresh the countdown display
  displayCountdowns();
}

// Load events from localStorage on page load
window.onload = function() {
  const savedEvents = localStorage.getItem("events");
  if (savedEvents) {
    events = JSON.parse(savedEvents);
    displayCountdowns();
  }

  // Start countdown updates every second
  setInterval(displayCountdowns, 1000);
};

// Request notification permission if not already granted
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
