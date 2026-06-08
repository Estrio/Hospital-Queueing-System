import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }                           from "./firebase.js";
import { renderDoctors, flashLastTicket } from "./ui.js";
import { openModal, closeModal, initModalClosers } from "./modals.js";
import { addDoctor, removeDoctor }       from "./doctors.js";
import { nextPatient }                   from "./queue.js";
import { recallPatient, patientArrived } from "./recall.js";
import { restorePatient }                from "./restore.js";
import { createTicket }                  from "./ticket.js";
import { printTicket }                   from "./printer.js";

// ── INIT ──────────────────────────────────────────────
initModalClosers();

// ── LIVE SNAPSHOT ─────────────────────────────────────
const container = document.getElementById("doctorContainer");

onSnapshot(collection(db, "doctors"), (snapshot) => {
  renderDoctors(snapshot.docs);
});

// ── CARD BUTTON DELEGATION ────────────────────────────
container.addEventListener("click", async (e) => {

  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const { action, code, name, specialty, room } = btn.dataset;

  switch (action) {

    case "generate":
      openTicketModal(code, name, specialty, room);
      break;

    case "next":
      await nextPatient(code);
      break;

    case "recall":
      await recallPatient(code);
      break;

    case "arrived":
      await patientArrived(code);
      break;

    case "queue":
      await openQueueModal(code, name);
      break;

    case "restore":
      await openRestoreModal(code);
      break;

    case "delete":
      await removeDoctor(code);
      break;
  }
});

// ── ADD DOCTOR MODAL ──────────────────────────────────
document.getElementById("openAddDoctorBtn").onclick = () => {
  openModal("addDoctorModal");
};

document.getElementById("saveDocBtn").onclick = async () => {
  const btn = document.getElementById("saveDocBtn");
  btn.disabled = true;
  btn.textContent = "Saving…";
  try {
    const ok = await addDoctor();
    if (ok) closeModal("addDoctorModal");
  } finally {
    btn.disabled = false;
    btn.textContent = "Add Doctor";
  }
};

// ── TICKET MODAL ──────────────────────────────────────
let _ticketCode = "";

function openTicketModal(code, name, specialty, room) {
  _ticketCode = code;
  document.getElementById("ticketModalSub").textContent =
    `Dr. ${name} · ${specialty || ""} · Room ${room || "---"}`;
  document.getElementById("patientName").value = "";
  openModal("ticketModal");
  setTimeout(() => document.getElementById("patientName").focus(), 80);
}

document.getElementById("confirmTicketBtn").onclick = async () => {
  const patientName = document.getElementById("patientName").value.trim();

  if (!patientName) {
    document.getElementById("patientName").focus();
    return;
  }

  const btn = document.getElementById("confirmTicketBtn");
  btn.disabled = true;
  btn.textContent = "Generating…";

  try {
    const result = await createTicket(_ticketCode, patientName);

    if (!result.ticket) {
      alert("Could not generate ticket. Doctor not found.");
      return;
    }

    flashLastTicket(result.ticket);

    printTicket({
      ticket:     result.ticket,
      patientName,
      room:       result.room,
      doctorName: result.doctorName
    });

    closeModal("ticketModal");

  } catch (err) {
    console.error("Ticket error:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Print & Issue Ticket";
  }
};

// Enter key submits ticket modal
document.getElementById("patientName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("confirmTicketBtn").click();
});

// ── QUEUE MODAL ───────────────────────────────────────
async function openQueueModal(code, doctorName) {

  const ref  = doc(db, "doctors", code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data  = snap.data();
  const queue = data.queue || [];

  document.getElementById("queueModalTitle").textContent =
    `📋 Queue — Dr. ${doctorName || data.name}`;

  const listEl = document.getElementById("queueList");

  if (!queue.length) {
    listEl.innerHTML = `<div class="list-empty">No patients in queue.</div>`;
  } else {
    listEl.innerHTML = queue.map((p, i) => `
      <div class="list-item">
        <div class="list-item-info">
          <div class="list-ticket">${p.ticket}</div>
          <div class="list-name">${p.patientName || ""}</div>
        </div>
        <button class="list-btn" data-idx="${i}">Remove</button>
      </div>
    `).join("");

    listEl.querySelectorAll(".list-btn").forEach(btn => {
      btn.onclick = async () => {
        const latestSnap = await getDoc(ref);
        if (!latestSnap.exists()) return;
        const latestQueue = [...(latestSnap.data().queue || [])];
        latestQueue.splice(parseInt(btn.dataset.idx), 1);
        await updateDoc(ref, { queue: latestQueue });
        await openQueueModal(code, doctorName);  // re-render
      };
    });
  }

  openModal("queueModal");
}

// ── RESTORE MODAL ─────────────────────────────────────
async function openRestoreModal(code) {

  const ref  = doc(db, "doctors", code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const missed = snap.data().missed || [];
  const listEl = document.getElementById("restoreList");

  if (!missed.length) {
    listEl.innerHTML = `<div class="list-empty">No missed patients.</div>`;
  } else {
    listEl.innerHTML = missed.map(p => `
      <div class="list-item">
        <div class="list-item-info">
          <div class="list-ticket">${p.ticket}</div>
          <div class="list-name">${p.patientName || ""}</div>
        </div>
        <button class="list-btn restore" data-ticket="${p.ticket}">Restore</button>
      </div>
    `).join("");

    listEl.querySelectorAll(".list-btn.restore").forEach(btn => {
      btn.onclick = async () => {
        await restorePatient(code, btn.dataset.ticket);
        await openRestoreModal(code);  // re-render
      };
    });
  }

  openModal("restoreModal");
}