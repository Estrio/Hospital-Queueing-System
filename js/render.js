const display =
  document.getElementById("display");

export function renderDoctors(doctors) {

  display.innerHTML = "";

  doctors.forEach(docSnap => {

    const data =
      docSnap.data();

    const name =
      data.name;

    const current =
      data.current || " ";

    const room =
      data.room || "---";

    const nextPatient =
      data.queue?.[0] || null;

    const next =
      nextPatient
        ? nextPatient.ticket
        : "---";

    const rest =
      (data.queue || [])
        .slice(1, 5)
        .map(x => x.ticket);

    const missed =
      data.missed?.slice(-3) || [];

    display.innerHTML += `

      <div class="card">

        <div class="doctor-name">
          ${name}
        </div>

        <div class="room">
          ROOM ${room}
        </div>

        <div class="label">
          NOW SERVING
        </div>

        <div class="now">
          ${current}
        </div>

        <div class="next">
          NEXT: ${next}
        </div>

        <div class="queue-list">

          ${
            rest.length

              ? rest.map(ticket => `
                  <div class="pill">
                    ${ticket}
                  </div>
                `).join("")

              : ""
          }

        </div>

        <div class="missed-section">

          <div class="missed-label">
            MISSED
          </div>

          <div class="missed-list">

            ${
              missed.length

                ? missed.map(m => `
                    <div class="missed-pill">
                      ${m.ticket}
                    </div>
                  `).join("")

                : `
                    <div class="missed-empty">
                      NONE
                    </div>
                  `
            }

          </div>

        </div>

      </div>
    `;
  });
}