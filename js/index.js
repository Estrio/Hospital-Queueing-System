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

import {
  getCurrentPageDoctors
}
from "./pagination.js";

import {
  handleAnnouncements
}
from "./announcements.js";

let doctorsCache = [];

window.addEventListener(
  "audio-ready",

  () => {

    handleAnnouncements(
      doctorsCache
    );
  }
);

onSnapshot(
  collection(db, "doctors"),

  (snapshot) => {

    doctorsCache =
      snapshot.docs;

    handleAnnouncements(
      snapshot.docs
    );

    renderDoctors(
      getCurrentPageDoctors(
        doctorsCache
      )
    );
  }
);

setInterval(() => {

  if (!doctorsCache.length)
    return;

  renderDoctors(

    getCurrentPageDoctors(
      doctorsCache
    )
  );

}, 10000);