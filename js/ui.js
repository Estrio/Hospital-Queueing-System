export function renderDoctors(
  doctors
) {

  return doctors.map(docSnap => {

    const data =
      docSnap.data();

    const code =
      docSnap.id;

    return `

      <div class="doctor-card">

        <div class="doctor-name">
          ${data.name}
        </div>

        <div class="badges">

          <div class="badge specialty-badge">
            ${data.specialty}
          </div>

        </div>

        <div class="badge room-badge">
          ROOM ${data.room || "---"}
        </div>

        <div class="status">

          <div class="status-label">
            Current Patient
          </div>

          <strong>
            ${data.current || "---"}
          </strong>

          <div class="current-name">
            ${data.currentPatientName || ""}
          </div>

        </div>

        <div class="button-grid">

          <button
            class="next-btn"
            data-action="next"
            data-code="${code}"
          >
            ▶ NEXT
          </button>

          <button
            class="recall-btn"
            data-action="recall"
            data-code="${code}"
          >
            🔊 RECALL
          </button>

          <button
            class="arrived-btn"
            data-action="arrived"
            data-code="${code}"
          >
            ✅ ARRIVED
          </button>

          <button
            class="delete-btn"
            data-action="delete"
            data-code="${code}"
          >
            🗑️ DELETE
          </button>

          <button
            class="view-btn"
            data-action="queue"
            data-code="${code}"
          >
            📋 VIEW QUEUE
          </button>

          ${
            data.missed?.length
            ? `
              <button
                class="restore-btn"
                data-action="restore"
                data-code="${code}"
              >
                ♻️ RESTORE
              </button>
            `
            : ""
          }

        </div>

        <div class="missed-text">

          ${
            data.missed?.length
            ? "Missed: " +
              data.missed
                .map(m => m.ticket)
                .join(", ")
            : ""
          }

        </div>

      </div>
    `;
  }).join("");
}