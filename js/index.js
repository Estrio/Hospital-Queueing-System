import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

import {
  renderDoctors,
  updateLastTicket
} from "./ui.js";

import {
  openPatientModal,
  closePatientModal,
  getPatientName,
  getSelectedDoctor
} from "./modal.js";

import { createTicket } from "./ticket.js";

import { printTicket } from "./printer.js";

// =========================
// LOAD DOCTORS
// =========================
onSnapshot(
  collection(db, "doctors"),
  (snapshot) => {

    const doctors = snapshot.docs.map(docSnap => {

      const data = docSnap.data();

      return {
        code: docSnap.id,
        name: data.name || docSnap.id,
        specialty: data.specialty || "Doctor"
      };
    });

    renderDoctors(
      doctors,
      openPatientModal
    );
  }
);

// =========================
// MODAL EVENTS
// =========================
document
  .getElementById("closeModal")
  .onclick = closePatientModal;

window.onclick = (e) => {

  const modal =
    document.getElementById("patientModal");

  if (e.target === modal) {
    closePatientModal();
  }
};

// =========================
// CONFIRM TICKET
// =========================
document
  .getElementById("confirmTicketBtn")
  .onclick = async () => {

    const patientName =
      getPatientName();

    if (!patientName) {

      alert("Please enter patient name");

      return;
    }

    const code =
      getSelectedDoctor();

    const result =
      await createTicket(
        code,
        patientName
      );

    updateLastTicket(result.ticket);

    printTicket({
      ticket: result.ticket,
      patientName,
      room: result.room
    });

    closePatientModal();
};