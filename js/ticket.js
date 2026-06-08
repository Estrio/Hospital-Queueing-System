import {
  doc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

export async function createTicket(
  code,
  patientName
) {

  const ref = doc(db, "doctors", code);

  let ticket = "";
  let room = "---";

  await runTransaction(db, async (transaction) => {

    const snap =
      await transaction.get(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    room = data.room || "---";

    const counter =
      (data.counter || 0) + 1;

    ticket =
      `${code}-${String(counter).padStart(3, "0")}`;

    const queue = data.queue || [];

    queue.push({
      ticket,
      patientName
    });

    transaction.update(ref, {
      counter,
      queue
    });
  });

  return {
    ticket,
    room
  };
}