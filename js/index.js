import {
  collection,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

import {
  renderDoctors
}
from "./ui.js";

import {
  addDoctor,
  removeDoctor
}
from "./doctors.js";

import {
  nextPatient
}
from "./queue.js";

import {
  recallPatient,
  patientArrived
}
from "./recall.js";

import {
  restorePatient
}
from "./restore.js";

import {
  openModal,
  closeModal
}
from "./modals.js";

// FIX #11: filename casing corrected to match actual file restoreModal.js
import {
  openRestoreModal
}
from "./restoreModal.js";

const container =
  document.getElementById(
    "doctorContainer"
  );

// ─── STATE: track which doctor's queue modal is open ───
let activeQueueCode = null;

onSnapshot(

  collection(db, "doctors"),

  (snapshot) => {

    container.innerHTML =
      renderDoctors(
        snapshot.docs
      );
  }
);

container.addEventListener(
  "click",

  async (e) => {

    const btn =
      e.target.closest("button");

    if (!btn) return;

    const code =
      btn.dataset.code;

    const action =
      btn.dataset.action;

    if (action === "next") {
      await nextPatient(code);
    }

    if (action === "delete") {
      await removeDoctor(code);
    }

    if (action === "recall") {
      await recallPatient(code);
    }

    if (action === "arrived") {
      await patientArrived(code);
    }

    if (action === "restore") {
      await openRestoreModal(code);
    }

    // FIX #1: queue modal now actually opens and renders the queue
    if (action === "queue") {
      await openQueueModal(code);
    }
  }
);

// ─── QUEUE MODAL ───────────────────────────────────────

import {
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function openQueueModal(code) {

  activeQueueCode = code;

  const ref = doc(db, "doctors", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const queue = data.queue || [];

  const title =
    document.getElementById("queueTitle");

  title.textContent =
    `📋 Queue — Dr. ${data.name}`;

  const queueList =
    document.getElementById("queueList");

  if (!queue.length) {

    queueList.innerHTML = `
      <div class="empty-state">
        No patients in queue
      </div>
    `;

  } else {

    queueList.innerHTML =
      queue.map((patient, index) => `

        <div class="queue-item">

          <div class="queue-info">

            <div class="queue-ticket">
              ${patient.ticket}
            </div>

            <div class="queue-name">
              ${patient.patientName || ""}
            </div>

          </div>

          <button
            class="remove-queue-btn"
            data-index="${index}"
          >
            Remove
          </button>

        </div>

      `).join("");

    document
      .querySelectorAll(".remove-queue-btn")
      .forEach(btn => {

        btn.onclick = async () => {

          const idx =
            parseInt(btn.dataset.index);

          const latestSnap =
            await getDoc(ref);

          if (!latestSnap.exists()) return;

          const latestQueue =
            latestSnap.data().queue || [];

          latestQueue.splice(idx, 1);

          const { updateDoc } =
            await import(
              "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
            );

          await updateDoc(ref, {
            queue: latestQueue
          });

          await openQueueModal(code);
        };
      });
  }

  openModal("queueModal");
}

// ─── MODAL TRIGGERS ────────────────────────────────────

document
  .getElementById("saveDoctorBtn")
  .onclick = async () => {
    await addDoctor();
    closeModal("doctorModal");
  };

document
  .getElementById("openModalBtn")
  .onclick = () => {
    openModal("doctorModal");
  };

// FIX #2 + #10: all close handlers centralised here
document
  .querySelector(".close")
  .onclick = () => {
    closeModal("doctorModal");
  };

// FIX #10: closeQueue was never bound — now it is
document
  .querySelector(".closeQueue")
  .onclick = () => {
    closeModal("queueModal");
    activeQueueCode = null;
  };

// FIX #2: closeRestore moved here from restoreModal.js
document
  .querySelector(".closeRestore")
  .onclick = () => {
    closeModal("restoreModal");
  };