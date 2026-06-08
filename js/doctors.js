import {
  doc,
  setDoc,
  deleteDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

export async function addDoctor() {

  const name =
    document.getElementById("name")
      .value.trim();

  const specialty =
    document.getElementById("specialty")
      .value.trim();

  const room =
    document.getElementById("room")
      .value.trim();

  const prefix =
    document.getElementById("prefix")
      .value.trim()
      .toUpperCase();

  if (
    !name ||
    !specialty ||
    !room ||
    !prefix
  ) {

    alert("Fill all fields");

    return;
  }

  await setDoc(
    doc(db, "doctors", prefix),
    {
      name,
      specialty,
      room,
      queue: [],
      current: "---",
      currentPatientName: "",
      recall: {
        active: false,
        attempts: 0,
        sessionId: null,
        status: "",
        target: ""
      },
      missed: []
    }
  );

  document.getElementById("name").value = "";
  document.getElementById("specialty").value = "";
  document.getElementById("room").value = "";
  document.getElementById("prefix").value = "";
}

export async function removeDoctor(
  code
) {

  if (
    !confirm(
      "Delete this doctor?"
    )
  ) return;

  await deleteDoc(
    doc(db, "doctors", code)
  );
}