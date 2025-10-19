// === TIMER ===
let timer;
let seconds = 0;
let running = false;

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function startTimer() {
  if (running) return;
  running = true;
  timer = setInterval(() => {
    seconds++;
    document.getElementById("timer-display").textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  running = false;
  clearInterval(timer);
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  document.getElementById("timer-display").textContent = "00:00:00";
}

// === CALENDAR ===
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let currentMonthIndex = new Date().getMonth();
const monthNameEl = document.getElementById("month-name");
const calendarTable = document.getElementById("calendar-table");

function getMonthKey() {
  const year = new Date().getFullYear();
  return `${year}-${months[currentMonthIndex]}`;
}

function loadCalendarData() {
  const key = getMonthKey();
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const cells = calendarTable.querySelectorAll("td:not(.blank)");
  cells.forEach((cell, index) => {
    if (data[index]) cell.classList.add("checked");
    else cell.classList.remove("checked");
  });
}

function saveCalendarData() {
  const key = getMonthKey();
  const cells = calendarTable.querySelectorAll("td:not(.blank)");
  const data = Array.from(cells).map((c) => c.classList.contains("checked"));
  localStorage.setItem(key, JSON.stringify(data));
}

function setupCalendar() {
  const cells = calendarTable.querySelectorAll("td:not(.blank)");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("checked");
      saveCalendarData();
    });
  });
}

function changeMonth(direction) {
  currentMonthIndex = (currentMonthIndex + direction + 12) % 12;
  monthNameEl.textContent = months[currentMonthIndex];
  loadCalendarData();
}

// === WORKOUT LIBRARY ===
const exercises = {
  push: ["Bench Press", "Shoulder Press", "Lateral Raise", "Chest Fly", "Overhead Extension"],
  pull: ["Pull-Up", "Barbell Row", "One-Arm Row", "Bicep Curl", "Hammer Curl", "Forearm"],
  legs: ["Squat", "Lunge", "Deadlift"]
};

let currentType = "push";
let currentIndex = 0;

const exerciseName = document.getElementById("exercise-name");
const tabs = document.querySelectorAll(".tab");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function renderExercise() {
  const list = exercises[currentType];
  exerciseName.textContent = list[currentIndex];
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    currentIndex = 0;
    renderExercise();
  });
});

nextBtn.addEventListener("click", () => {
  const list = exercises[currentType];
  currentIndex = (currentIndex + 1) % list.length;
  renderExercise();
});

prevBtn.addEventListener("click", () => {
  const list = exercises[currentType];
  currentIndex = (currentIndex - 1 + list.length) % list.length;
  renderExercise();
});

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn").addEventListener("click", startTimer);
  document.getElementById("stop-btn").addEventListener("click", stopTimer);
  document.getElementById("reset-btn").addEventListener("click", resetTimer);

  setupCalendar();
  monthNameEl.textContent = months[currentMonthIndex];
  loadCalendarData();

  document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1));
  document.getElementById("next-month").addEventListener("click", () => changeMonth(1));

  renderExercise(); // tampilkan gerakan pertama
});
