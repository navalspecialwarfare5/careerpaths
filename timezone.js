// Show/Hide the timezone widget when the toggle button is clicked
document.getElementById('timezone-toggle').addEventListener('click', function() {
    const widget = document.getElementById('timezone-widget');
    widget.classList.toggle('collapsed'); // This will toggle visibility
});

// Timezones List (you can expand as needed)
const timezones = [
    'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara',
    'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Blantyre', 'Africa/Brazzaville',
    'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry',
    'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/El_Aaiun', 'Africa/Freetown',
    'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala',
    'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville',
    'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Luanda', 'Africa/Malabo', 'Africa/Maputo',
    'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Nairobi', 'Africa/Ndjamena',
    'Africa/Niamey', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tunis', 'Africa/Windhoek',
    'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/Comodoro_Rivadavia', 
    'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 
    'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis',
    'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Barbados', 'America/Belem', 'America/Bogota',
    'America/Caracas', 'America/Chicago', 'America/Chihuahua', 'America/Denver', 'America/Edmonton', 'America/Fortaleza',
    'America/Guatemala', 'America/Houston', 'America/Indianapolis', 'America/Jamaica', 'America/Lima', 'America/Los_Angeles',
    'America/Mexico_City', 'America/New_York', 'America/Panama', 'America/Port_of_Spain', 'America/Rio_Branco',
    'America/Sao_Paulo', 'America/Thunder_Bay', 'America/Toronto', 'America/Vancouver', 'America/Whitehorse',
    'Antarctica/Palmer', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat',
    'Asia/Baghdad', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei',
    'Asia/Chita', 'Asia/Colombo', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Gaza', 'Asia/Hong_Kong',
    'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Kolkata',
    'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuwait', 'Asia/Macau', 'Asia/Magadan', 'Asia/Manila', 
    'Asia/Muscat', 'Asia/Novosibirsk', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Singapore', 'Asia/Tashkent',
    'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Ulaanbaatar', 'Asia/Vientiane',
    'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary'
];

// Show the suggestions based on input
function filterSuggestions() {
    const input = document.getElementById('tzInput').value.toLowerCase();
    const suggestionsList = document.getElementById('tzSuggestions');
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    if (input.trim().length === 0) {
        return; // If input is empty, don't show suggestions
    }

    // Filter timezones based on input
    const filteredTimezones = timezones.filter(tz => tz.toLowerCase().includes(input));

    if (filteredTimezones.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.classList.add('list-group-item');
        noResultsItem.textContent = 'No suggestions found';
        suggestionsList.appendChild(noResultsItem);
        return;
    }

    // Show filtered suggestions
    filteredTimezones.forEach(tz => {
        const suggestionItem = document.createElement('li');
        suggestionItem.classList.add('list-group-item', 'list-group-item-action');
        suggestionItem.textContent = tz;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('tzInput').value = tz; // Fill input with selected timezone
            suggestionsList.innerHTML = ''; // Clear suggestions after selection
            showTimes(tz); // Display selected timezone time
        });
        suggestionsList.appendChild(suggestionItem);
    });
}

// Show the time for the selected timezone
function showTimes(selectedTimezone) {
    // Perform timezone conversion (this is a placeholder)
    const date = new Date();
    const options = { timeZone: selectedTimezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const time = new Intl.DateTimeFormat('en-US', options).format(date);
    document.getElementById('tzResults').textContent = `Converted time for ${selectedTimezone}: ${time}`;
}

// Idle timer (optional functionality)
let idleTimer;
let isModalShown = false;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (!isModalShown) {
    idleTimer = setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('idleModal'));
      modal.show();
      isModalShown = true;
    }, 60000); // Trigger after 1 minute of inactivity
  }
}

// Event listeners to reset idle timer on user actions
['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt =>
  document.addEventListener(evt, resetIdleTimer)
);
resetIdleTimer();
