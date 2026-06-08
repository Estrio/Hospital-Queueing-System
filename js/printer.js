export function printTicket({ ticket, patientName, room, doctorName }) {

  const html = `
    <html>
    <head>
    <style>
      @page {
        size: 58mm auto;
        margin: 0;
      }
      body {
        width: 58mm;
        margin: 0;
        padding: 8px 10px;
        font-family: Arial, sans-serif;
        text-align: center;
        font-size: 12px;
      }
      .hospital {
        font-size: 13px;
        font-weight: bold;
        margin-bottom: 2px;
      }
      .sub {
        font-size: 10px;
        color: #555;
        margin-bottom: 6px;
      }
      hr { border: none; border-top: 1px dashed #aaa; margin: 6px 0; }
      .label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #777;
        margin-bottom: 2px;
      }
      .ticket-num {
        font-size: 42px;
        font-weight: bold;
        letter-spacing: 2px;
        line-height: 1.1;
        margin: 4px 0;
      }
      .patient-name {
        font-size: 13px;
        font-weight: bold;
        margin: 4px 0 2px;
      }
      .detail {
        font-size: 11px;
        color: #333;
        margin: 2px 0;
      }
      .timestamp {
        font-size: 10px;
        color: #999;
        margin-top: 6px;
      }
    </style>
    </head>
    <body>
      <div class="hospital">Twin Care Hospital</div>
      <div class="sub">Incorporated</div>
      <hr>
      <div class="label">Queue Number</div>
      <div class="ticket-num">${ticket}</div>
      <hr>
      <div class="patient-name">${patientName}</div>
      <div class="detail">Dr. ${doctorName || ""}</div>
      <div class="detail">Room ${room}</div>
      <hr>
      <div class="timestamp">${new Date().toLocaleString()}</div>
    </body>
    </html>
  `;

  // FIX #5: guard against missing electronAPI (e.g. opened in browser during dev)
  if (window.electronAPI?.printTicket) {
    window.electronAPI.printTicket(html);
  } else {
    console.warn("electronAPI not available — printing skipped.");
  }
}