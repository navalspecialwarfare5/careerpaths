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

