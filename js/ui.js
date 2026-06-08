export function updateLastTicket(ticket) {

  document.getElementById("ticket")
    .innerText = ticket;
}

export function renderDoctors(
  doctors,
  onGenerate
) {

  const container =
    document.getElementById("doctorCards");

  let html = "";

  doctors.forEach(({ code, name, specialty }) => {

    html += `
      <div class="card">

        <div class="doctor">
          ${name}
        </div>

        <div class="sub">
          ${specialty}
        </div>

        <button
          class="btn green"
          data-code="${code}"
        >
          Generate Ticket
        </button>

      </div>
    `;
  });

  container.innerHTML = html;

  document
    .querySelectorAll(".btn.green")
    .forEach(btn => {

      btn.onclick = () =>
        onGenerate(btn.dataset.code);
    });
}