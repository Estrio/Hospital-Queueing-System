import {
  announce,
  isAudioUnlocked
}
from "./audio.js";

const last = {};

let firstAudioRun = true;

export function handleAnnouncements(docs) {

  docs.forEach(docSnap => {

    const data = docSnap.data();

    const id = docSnap.id;

    const name =
      data.name;

    const current =
      data.current;

    const room =
      data.room || "unknown room";

    // =========================
    // NOW SERVING
    // =========================
    if (
      isAudioUnlocked() &&
      current !== "---" &&
      (
        firstAudioRun ||
        last[id] !== current
      )
    ) {

      last[id] = current;

      announce(

        `Now serving patient number ${current}. Please proceed to Room ${room}, for Dr. ${name}.`
      );
    }

    // =========================
    // RECALL
    // =========================
    const r = data.recall;

    if (
      isAudioUnlocked() &&
      r?.status
    ) {

    const key =
      `${id}-${r.sessionId}-${r.attempts}`;

      if (!last[key]) {

        last[key] = true;

        if (r.status === "calling") {

          announce(

            `Recall for patient ${r.target}. Please proceed to Room ${room}, for Doctor ${name}.`
          );
        }

        if (r.status === "missed") {

          announce(

            `Patient ${r.target} has missed their turn. The next patient will now be served.`
          );
        }
      }
    }
  });
  firstAudioRun = false;
}