// ===== DEADLINE TRACKER =====
let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
renderDeadlines();

function addDeadline() {
  const title = document.getElementById("deadline-title").value.trim();
  const date = document.getElementById("deadline-date").value;
  if (!title || !date) return alert("Isi semua field dulu ya!");

  const today = new Date().toISOString().split("T")[0];
  const overdue = date < today;

  deadlines.push({ title, date, done: false, overdue });
  localStorage.setItem("deadlines", JSON.stringify(deadlines));

  document.getElementById("deadline-title").value = "";
  document.getElementById("deadline-date").value = "";

  renderDeadlines();
}

function toggleDeadline(index) {
  deadlines[index].done = !deadlines[index].done;
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
  renderDeadlines();
}

function deleteDeadline(index) {
  deadlines.splice(index, 1);
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
  renderDeadlines();
}

function renderDeadlines() {
  const list = document.getElementById("deadline-list");
  list.innerHTML = "";

  if (deadlines.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:#888;">Belum ada deadlines 😴</p>`;
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  deadlines.forEach((d, i) => {
    // 🔹 Update overdue setiap kali render
    d.overdue = d.date < today && !d.done;

    // 🔹 BONUS: Deteksi jika deadline == hari ini
    const isToday = d.date === today && !d.done;

    const li = document.createElement("li");
    li.className = `deadline-item ${d.overdue ? "overdue" : ""} ${isToday ? "due-today" : ""}`;
    li.innerHTML = `
      <div class="task-info">
        <input type="checkbox" ${d.done ? "checked" : ""} onchange="toggleDeadline(${i})">
        <div class="task-texts">
          <span class="task-title ${d.done ? "line-through text-gray-400" : ""}">${d.title}</span>
          <small class="task-date">Deadline: ${d.date}</small>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteDeadline(${i})">x</button>
    `;
    list.appendChild(li);
  });

  // Simpan perubahan overdue & isToday
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
}
// 🔁 Auto-refresh setiap 1 menit untuk update status overdue secara otomatis
setInterval(renderDeadlines, 60000);


