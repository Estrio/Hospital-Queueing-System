const containerEl = document.getElementById("doctorContainer");
const lastTicketEl = document.getElementById("lastTicket");

export function renderDoctors(docs) {

  if (!docs.length) {
    containerEl.innerHTML =
      `<div class="empty-state">No doctors registered yet. Click <strong>Add Doctor</strong> to get started.</div>`;
    return;
  }

  const html = docs.map((docSnap, i) => {

    const data = docSnap.data();
    const code = docSnap.id;

    const current     = data.current || "---";
    const patientName = data.currentPatientName || "";
    const missed      = data.missed || [];

    const recallActive  = data.recall?.active;
    const recallAttempt = data.recall?.attempts || 0;
    const recallStatus  = data.recall?.status || "";

    // recall status badge text
    let recallText = "";
    if (recallActive && recallStatus === "calling") {
      recallText = `🔊 Recalling… (attempt ${recallAttempt}/3)`;
    } else if (recallStatus === "arrived") {
      recallText = "✅ Patient arrived";
    } else if (recallStatus === "missed") {
      recallText = "⚠️ Patient missed — advanced queue";
    }

    return `
      <div class="doctor-card" style="animation-delay:${i * 0.04}s">

        <!-- CARD HEADER -->
        <div class="card-header">
          <div class="card-info">
            <div class="doctor-name">${data.name}</div>
            <div class="doctor-meta">
              <span class="badge-specialty">${data.specialty || ""}</span>
              <span class="badge-room">Room ${data.room || "---"}</span>
            </div>
          </div>
        </div>

        <!-- CURRENT PATIENT STATUS -->
        <div class="status-box">
          <div class="status-label">Now Serving</div>
          <div class="status-ticket">${current}</div>
          <div class="status-patient">${patientName}</div>
        </div>

        <!-- RECALL STATUS -->
        <div class="recall-status ${recallText ? "visible" : ""}">
          ${recallText}
        </div>

        <!-- ACTION BUTTONS -->
        <div class="btn-grid">

          <!-- Generate Ticket — full width, navy -->
          <button class="card-btn btn-generate btn-full"
            data-action="generate" data-code="${code}"
            data-name="${data.name}" data-specialty="${data.specialty || ""}"
            data-room="${data.room || "---"}">
            🎫 Generate Ticket
          </button>

          <!-- Next Patient — full width, accent blue -->
          <button class="card-btn btn-next btn-full"
            data-action="next" data-code="${code}">
            ▶ Next Patient
          </button>

          <!-- Recall -->
          <button class="card-btn"
            data-action="recall" data-code="${code}">
            🔊 Recall
          </button>

          <!-- Arrived -->
          <button class="card-btn"
            data-action="arrived" data-code="${code}">
            ✅ Arrived
          </button>

          <!-- View Queue -->
          <button class="card-btn"
            data-action="queue" data-code="${code}"
            data-name="${data.name}">
            📋 Queue
          </button>

          <!-- Restore (only shown when there are missed patients) -->
          ${missed.length ? `
          <button class="card-btn"
            data-action="restore" data-code="${code}">
            ♻️ Restore
          </button>
          ` : `<div></div>`}

          <!-- Delete — danger -->
          <button class="card-btn btn-delete btn-full"
            data-action="delete" data-code="${code}">
            🗑️ Delete Doctor
          </button>

        </div>

        <!-- MISSED SUMMARY -->
        <div class="missed-row">
          ${missed.length
            ? `Missed: ${missed.map(m => m.ticket).join(", ")}`
            : ""}
        </div>

      </div>
    `;
  }).join("");

  containerEl.innerHTML = html;
}

export function flashLastTicket(ticket) {
  lastTicketEl.textContent = ticket;
  lastTicketEl.classList.add("flash");
  setTimeout(() => lastTicketEl.classList.remove("flash"), 2000);
}