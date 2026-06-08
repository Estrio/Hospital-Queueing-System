import {
  announce,
  isAudioUnlocked
}
from "./audio.js";

const last = {};

// FIX #5: record the time this module loaded so we can ignore
// recall events that were already in Firestore before we opened
const loadTime = Date.now();

export function handleAnnouncements(docs) {

  docs.forEach(docSnap => {

    const data = docSnap.data();

    const id = docSnap.id;

    const name = data.name;

    const current = data.current;

    const room = data.room || "unknown room";

    // ── NOW SERVING ──────────────────────────────
    // FIX #1: removed firstAudioRun — only announce when the ticket
    // actually changes, never just because the page loaded
    if (
      isAudioUnlocked() &&
      current !== "---" &&
      last[id] !== current
    ) {

      last[id] = current;

      announce(
        `Now serving patient number ${current}. Please proceed to Room ${room}, for Dr. ${name}.`
      );
    }

    // ── RECALL ───────────────────────────────────
    const r = data.recall;

    if (isAudioUnlocked() && r?.status) {

      const key = `${id}-${r.sessionId}-${r.attempts}`;

      if (!last[key]) {

        // FIX #5: skip recall events whose sessionId predates our load time.
        // sessionId is Date.now() from the control panel, so comparing
        // it to loadTime tells us if this event is stale.
        const isFresh =
          r.sessionId && r.sessionId > loadTime;

        if (isFresh) {

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
        } else {

          // mark as seen so we don't keep checking it
          last[key] = true;
        }
      }
    }
  });
}