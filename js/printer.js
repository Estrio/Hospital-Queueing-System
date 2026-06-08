export function printTicket({
  ticket,
  patientName,
  room
}) {

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
  padding: 10px;

  font-family: Arial, sans-serif;

  text-align: center;
}

.ticket {
  font-size: 38px;  
  font-weight: bold;
}

</style>
</head>

<body>

  <h3>Twin Care Hospital</h3>

  <hr>

  <div>QUEUE NUMBER</div>

  <div class="ticket">
    ${ticket}
  </div>

  <div>${patientName}</div>

  <div>
    ROOM ${room}
  </div>

  <hr>

  <small>
    ${new Date().toLocaleString()}
  </small>

</body>
</html>
`;

window.electronAPI.printTicket(html);
}