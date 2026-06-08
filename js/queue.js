import {
  doc,
  getDoc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

export async function nextPatient(
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

  const queue =
    data.queue || [];

  // FIX #4: renamed from nextPatient to avoid shadowing the exported function
  const firstInQueue =
    queue[0] || null;

  await updateDoc(ref, {

    current:
      firstInQueue
        ? firstInQueue.ticket
        : "---",

    currentPatientName:
      firstInQueue
        ? firstInQueue.patientName
        : "",

    queue:
      queue.slice(1)
  });

  await new Promise(
    r => setTimeout(r, 500)
  );
}