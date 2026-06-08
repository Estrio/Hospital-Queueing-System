import {
  doc,
  getDoc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db }
from "./firebase.js";

const timers = {};

export async function recallPatient(
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

  if (
    !data.current ||
    data.current === "---"
  ) {

    alert("No current patient");

    return;
  }

  // already recalling
  if (timers[code])
    return;

    let attempts =
    data.recall?.attempts || 0;

    const sessionId =
    Date.now();

  async function cycle() {

    attempts++;

    await updateDoc(ref, {

      recall: {

        active: true,

        attempts,

        sessionId,

        status: "calling",

        target:
        (
            await getDoc(ref)
        ).data().current
      }
    });

    timers[code] =
      setTimeout(async () => {

        const latest =
          (await getDoc(ref))
            .data();

        // patient arrived
        if (
          latest.recall?.active === false
        ) {

          clearTimeout(
            timers[code]
          );

          delete timers[code];

          return;
        }

        // missed after 3 attempts
        if (attempts >= 3) {

          const missed =
            latest.missed || [];

          missed.push({

            ticket:
              latest.current,

            patientName:
              latest.currentPatientName || ""
          });

          const queue =
            latest.queue || [];

            const nextPatient =
            queue[0] || null;

            await updateDoc(ref, {

            missed,

            current:
                nextPatient
                ? nextPatient.ticket
                : "---",

            currentPatientName:
                nextPatient
                ? nextPatient.patientName
                : "",

            queue:
                queue.slice(1),

            recall: {

              active: false,

              attempts,

              sessionId,

              status: "missed",

              target:
                latest.current
            }
          });

          clearTimeout(
            timers[code]
          );

          delete timers[code];

          return;
        }

        cycle();

      }, 20000);
  }

  cycle();
}

export async function patientArrived(
  code
) {

  const ref =
    doc(db, "doctors", code);

  await updateDoc(ref, {

    recall: {

      active: false,

      attempts: 0,

      status: "arrived",

      target: ""
    }
  });

  if (timers[code]) {

    clearTimeout(
      timers[code]
    );

    delete timers[code];
  }
}