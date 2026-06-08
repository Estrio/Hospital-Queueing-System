import {
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

export async function addDoctor() {

  const room      = document.getElementById("docRoom").value.trim();
  const name      = document.getElementById("docName").value.trim();
  const specialty = document.getElementById("docSpecialty").value.trim();
  const prefix    = document.getElementById("docPrefix").value.trim().toUpperCase();

  if (!room || !name || !specialty || !prefix) {
    alert("Please fill in all fields.");
    return false;
  }

  await setDoc(doc(db, "doctors", prefix), {
    name,
    specialty,
    room,
    queue:              [],
    current:            "---",
    currentPatientName: "",
    counter:            0,
    recall: {
      active:    false,
      attempts:  0,
      sessionId: null,
      status:    "",
      target:    ""
    },
    missed: []
  });

  // clear inputs
  ["docRoom", "docName", "docSpecialty", "docPrefix"].forEach(id => {
    document.getElementById(id).value = "";
  });

  return true;
}

export async function removeDoctor(code) {
  if (!confirm(`Delete Dr. ${code}? This cannot be undone.`)) return;
  await deleteDoc(doc(db, "doctors", code));
}