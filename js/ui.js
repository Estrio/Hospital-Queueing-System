const ticketEl    = document.getElementById("lastTicket");
const containerEl = document.getElementById("doctorCards");

// FIX #9: room is now passed through and displayed on each card
export function renderDoctors(doctors, onGenerate) {

  if (!doctors.length) {
    containerEl.innerHTML =
      `<div class="empty-state">No doctors registered yet.</div>`;
    return;
  }

  const html = doctors.map(({ code, name, specialty, room }, i) => `
    <div class="card" style="animation-delay: ${i * 0.05}s">
      <div class="card-avatar">🩺</div>
      <div class="card-name">${name}</div>
      <div class="card-specialty">${specialty}</div>
      <div class="card-room">Room ${room}</div>
      <button
        class="generate-btn"
        data-code="${code}"
        data-name="${name}"
        data-specialty="${specialty}"
        data-room="${room}"
      >
        Generate Ticket
      </button>
    </div>
  `).join("");

  containerEl.innerHTML = html;

  containerEl.querySelectorAll(".generate-btn").forEach(btn => {
    btn.onclick = () => onGenerate(
      btn.dataset.code,
      btn.dataset.name,
      btn.dataset.specialty,
      btn.dataset.room
    );
  });
}

// FIX: flash the last ticket value green briefly after issue
export function flashLastTicket(ticket) {
  ticketEl.textContent = ticket;
  ticketEl.classList.add("flash");
  setTimeout(() => ticketEl.classList.remove("flash"), 1800);
}