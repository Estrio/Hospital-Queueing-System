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
from "./render.js";

// FIX #3 & #6: import both functions — getCurrentPageDoctors for rendering,
// advancePage only for the interval tick
import {
  getCurrentPageDoctors,
  advancePage
}
from "./pagination.js";

import {
  handleAnnouncements
}
from "./announcements.js";

let doctorsCache = [];

window.addEventListener("audio-ready", () => {
  handleAnnouncements(doctorsCache);
});

onSnapshot(

  collection(db, "doctors"),

  (snapshot) => {

    doctorsCache = snapshot.docs;

    handleAnnouncements(snapshot.docs);

    // FIX #6: snapshot only re-renders the CURRENT page — does NOT advance
    renderDoctors(
      getCurrentPageDoctors(doctorsCache)
    );
  }
);

// FIX #3 & #6: only the interval advances the page
setInterval(() => {

  if (!doctorsCache.length) return;

  advancePage(doctorsCache);

  renderDoctors(
    getCurrentPageDoctors(doctorsCache)
  );

}, 10000);