// homepage.js

// ===== WELCOME BANNER + AUDIO =====
window.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("welcomeBanner");
  const audio = document.getElementById("welcomeAudio");

  const triggerBanner = () => {
    banner.classList.add("active");

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn("Autoplay blocked:", err));
    }

    setTimeout(() => {
      banner.classList.remove("active");
    }, 5000);

    document.removeEventListener("click", triggerBanner);
    document.removeEventListener("keydown", triggerBanner);
    document.removeEventListener("scroll", triggerBanner);
  };

  document.addEventListener("click", triggerBanner);
  document.addEventListener("keydown", triggerBanner);
  document.addEventListener("scroll", triggerBanner);
});

// ===== IDLE TIMER =====
let idleTimer;
let isModalShown = false;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (!isModalShown) {
    idleTimer = setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('idleModal'));
      modal.show();
      isModalShown = true;
    }, 60000);
  }
}

['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt =>
  document.addEventListener(evt, resetIdleTimer)
);
resetIdleTimer();

// ===== WEEKLY SCHEDULE =====
const trainingContainer = document.getElementById('training-week');
const rangeTitle = document.getElementById('week-range-title');
const prevBtn = document.getElementById('prevWeek');
const nextBtn = document.getElementById('nextWeek');
let currentWeekIndex = 0;
const maxWeeks = 10;

const getStartOfWeek = (offset) => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + (offset * 7));
  return monday;
};

const renderWeek = () => {
  trainingContainer.innerHTML = '';
  const weekStart = getStartOfWeek(currentWeekIndex);
  const days = ['Friday', 'Saturday', 'Sunday'];
  const weekDates = days.map((_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 4 + i);
    return date;
  });

  const format = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const displayRange = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short'
  });

  rangeTitle.textContent = `WEEK ${String(currentWeekIndex + 1).padStart(2, '0')} — ${displayRange.format(weekDates[0])} to ${displayRange.format(weekDates[2])}`;

  const row = document.createElement('div');
  row.className = 'training-row';

  days.forEach((day, i) => {
    const mission = day === 'Friday' ? 'Briefing & Training' : (day === 'Saturday' ? 'Training' : 'Training & Debrief');
    const block = document.createElement('div');
    block.className = 'training-day';
    block.innerHTML = `
      <h6>${day}</h6>
      <strong>${format.format(weekDates[i])}</strong>
      <hr class="my-2">
      <div>${mission}</div>
    `;
    row.appendChild(block);
  });

  trainingContainer.appendChild(row);
  prevBtn.disabled = currentWeekIndex === 0;
  nextBtn.disabled = currentWeekIndex === maxWeeks - 1;
};

const changeWeek = (dir) => {
  const newIndex = currentWeekIndex + dir;
  if (newIndex >= 0 && newIndex < maxWeeks) {
    currentWeekIndex = newIndex;
    renderWeek();
  }
};
renderWeek();

// ===== PORTAL MODALS =====
document.getElementById('triggerPortalModal').addEventListener('click', function (e) {
  e.preventDefault();
  const securityModal = new bootstrap.Modal(document.getElementById('securityModal'));
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  securityModal.show();
  setTimeout(() => {
    securityModal.hide();
    setTimeout(() => loginModal.show(), 500);
  }, 5000);
});

// ===== TIMEZONE WIDGET =====
const tzOffsets = {
  "new york": -4, "chicago": -5, "los angeles": -7, "london": 1, "paris": 2,
  "berlin": 2, "madrid": 2, "tokyo": 9, "sydney": 10, "moscow": 3,
  "cape town": 2, "toronto": -4, "vancouver": -7, "mexico city": -6,
  "brazil": -3, "uae": 4, "dubai": 4, "india": 5.5, "japan": 9,
  "south korea": 9, "china": 8, "australia": 10
};

const opTimes = {"Friday": 20, "Saturday": 17, "Sunday": 13};

function showTimes() {
  const input = document.getElementById("tzInput").value.toLowerCase().trim();
  const offset = tzOffsets[input];
  const output = document.getElementById("tzResults");

  if (offset === undefined) {
    output.innerHTML = `<span class="text-danger">City or country not recognized. Try "London", "Tokyo", or "Los Angeles".</span>`;
    return;
  }

  let result = `
    <p class="mb-2"><strong>NSWDG-5 Operation Schedule (Converted)</strong></p>
    <p class="small text-muted mb-2">
      The following times reflect when our official operations begin, adjusted to your local timezone.
      All times are based on our standard schedule in Central European Summer Time (CEST).
    </p>
  `;

  for (const [day, utcHour] of Object.entries(opTimes)) {
    let localHour = utcHour + offset;
    if (localHour >= 24) localHour -= 24;
    if (localHour < 0) localHour += 24;
    const display = `${localHour.toString().padStart(2, '0')}:00`;
    result += `<strong>${day}:</strong> ${display}<br>`;
  }

  output.innerHTML = result;
}

const tzInput = document.getElementById("tzInput");
const tzSuggestions = document.getElementById("tzSuggestions");

tzInput.addEventListener('input', filterSuggestions);

document.addEventListener('click', function (e) {
  if (!tzInput.contains(e.target) && !tzSuggestions.contains(e.target)) {
    tzSuggestions.style.display = 'none';
  }
});

document.getElementById('timezone-toggle').addEventListener('click', function () {
  document.getElementById('timezone-widget').classList.toggle('collapsed');
});

function filterSuggestions() {
  const val = tzInput.value.toLowerCase();
  const matches = Object.keys(tzOffsets).filter(key => key.includes(val));
  tzSuggestions.innerHTML = '';

  if (!val || matches.length === 0) {
    tzSuggestions.style.display = 'none';
    return;
  }

  matches.slice(0, 6).forEach(match => {
    const li = document.createElement("li");
    li.textContent = match.charAt(0).toUpperCase() + match.slice(1);
    li.onclick = () => {
      tzInput.value = li.textContent;
      tzSuggestions.style.display = 'none';
      showTimes();
    };
    tzSuggestions.appendChild(li);
  });

  tzSuggestions.style.display = 'block';
}
