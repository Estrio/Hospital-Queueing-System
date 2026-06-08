import {
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

import {
  openModal,
  closeModal
}
from "./modals.js";

import {
  restorePatient
}
from "./restore.js";

export async function openRestoreModal(
  code
) {

  const ref =
    doc(db, "doctors", code);

  const snap =
    await getDoc(ref);

  if (!snap.exists())
    return;

  const data =
    snap.data();

  const restoreList =
    document.getElementById(
      "restoreList"
    );

  const missed =
    data.missed || [];

  if (!missed.length) {

    restoreList.innerHTML = `

      <div class="empty-state">
        No missed patients
      </div>
    `;

  } else {

    restoreList.innerHTML =

      missed.map(patient => `

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
            class="restore-btn-action"
            data-ticket="${patient.ticket}"
          >
            Restore
          </button>

        </div>

      `).join("");

    document
      .querySelectorAll(
        ".restore-btn-action"
      )
      .forEach(btn => {

        btn.onclick =
          async () => {

            await restorePatient(

              code,

              btn.dataset.ticket
            );

            await openRestoreModal(
              code
            );
          };
      });
  }

  openModal(
    "restoreModal"
  );
}

document
  .querySelector(
    ".closeRestore"
  )
  .onclick = () => {

    closeModal(
      "restoreModal"
    );
};