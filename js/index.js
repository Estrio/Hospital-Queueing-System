import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";
import { renderDoctors, flashLastTicket } from "./ui.js";
import { openModal, closeModal, setModalDoctor, getModalValues } from "./modal.js";
import { createTicket } from "./ticket.js";
import { printTicket } from "./printer.js";

// ── LIVE DOCTOR LIST ───────────────────────────────────
onSnapshot(
  collection(db, "doctors"),
  (snapshot) => {
    const doctors = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        code:      docSnap.id,
        name:      data.name      || docSnap.id,
        specialty: data.specialty || "",
        room:      data.room      || "---"
      };
    });

    renderDoctors(doctors, (code, name, specialty, room) => {
      setModalDoctor(code, name, specialty, room);
      openModal();
    });
  }
);

// ── MODAL CLOSE ────────────────────────────────────────
document.getElementById("closeModal").onclick = closeModal;

// close on backdrop click
document.getElementById("patientModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── CONFIRM / PRINT TICKET ─────────────────────────────
document.getElementById("confirmTicketBtn").onclick = async () => {

  const { patientName, code } = getModalValues();

  if (!patientName) {
    document.getElementById("patientName").focus();
    return;
  }

  const btn = document.getElementById("confirmTicketBtn");
  btn.disabled = true;
  btn.textContent = "Generating…";

  try {

    const result = await createTicket(code, patientName);

    if (!result.ticket) {
      alert("Could not generate ticket. Doctor not found.");
      return;
    }

    flashLastTicket(result.ticket);

    printTicket({
      ticket:      result.ticket,
      patientName,
      room:        result.room,
      doctorName:  result.doctorName
    });

    closeModal();

  } catch (err) {
    console.error("Ticket error:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Print & Issue Ticket";
  }
};

// allow Enter key to confirm
document.getElementById("patientName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("confirmTicketBtn").click();
  }
});