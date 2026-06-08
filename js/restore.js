import {
  doc,
  getDoc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

export async function restorePatient(
  code,
  ticket
) {

  const ref =
    doc(db, "doctors", code);

  const snap =
    await getDoc(ref);

  if (!snap.exists())
    return;

  const data =
    snap.data();

  const missed =
    data.missed || [];

  const patient =
    missed.find(
      p => p.ticket === ticket
    );

  if (!patient)
    return;

  const updatedMissed =
    missed.filter(
      p => p.ticket !== ticket
    );

  const queue =
    data.queue || [];

  await updateDoc(ref, {

    queue: [
      patient,
      ...queue
    ],

    missed:
      updatedMissed,

    recall: {

      active: false,

      attempts: 0,

      status: "",

      target: ""
    }
  });
}