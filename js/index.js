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

import {
  openRestoreModal
}
from "./restoreModal.js";

const container =
  document.getElementById(
    "doctorContainer"
  );

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

      await openRestoreModal(
        code
      );
    }

      if (action === "queue") {

        alert(
          "Queue modal not connected yet 😭"
        );
      }
  }
);

document
  .getElementById(
    "saveDoctorBtn"
  )
  .onclick = async () => {

    await addDoctor();

    closeModal(
      "doctorModal"
    );
  };

  document
  .getElementById(
    "openModalBtn"
  )
  .onclick = () => {

    openModal(
      "doctorModal"
    );
};

document
  .querySelector(".close")
  .onclick = () => {

    closeModal(
      "doctorModal"
    );
};