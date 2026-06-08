let audioUnlocked = false;

const audioQueue = [];

const MAX_QUEUE = 5; // FIX #8: cap queue to avoid stale announcements piling up

let speaking = false;

// FIX #9: single Audio object reused for both unlock and ding
const ding = new Audio("./assets/ding.mp3");

// FIX #2: removed synchronous getVoices() call — always empty on first run in Chrome/Electron
let voices = [];

// unlock audio on first user click
document.addEventListener("click", () => {

  ding.volume = 0; // FIX #9: reuse ding object instead of creating a throwaway Audio

  ding.play().then(() => {

    ding.volume = 1;

    audioUnlocked = true;

    console.log("🔊 Audio unlocked");

    window.dispatchEvent(
      new Event("audio-ready")
    );

  }).catch(() => {});

}, { once: true });

// FIX #2: only populate voices here, after the browser has loaded them
speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

function getFemaleVoice() {

  const preferred = [
    "Microsoft Zira",
    "Google US English",
    "Samantha"
  ];

  for (const name of preferred) {
    const found = voices.find(v => v.name.includes(name));
    if (found) return found;
  }

  return voices.find(v => v.lang.includes("en")) || voices[0] || null;
}

function speak(text) {

  const msg = new SpeechSynthesisUtterance(text);

  msg.lang = "en-US";
  msg.voice = getFemaleVoice();
  msg.rate = 0.82;
  msg.pitch = 1.05;
  msg.volume = 1;

  msg.onend = () => {
    speaking = false;
    processQueue();
  };

  // guard: if voice is null, onend may never fire
  msg.onerror = () => {
    speaking = false;
    processQueue();
  };

  speaking = true;

  speechSynthesis.speak(msg);
}

function processQueue() {

  if (
    !audioUnlocked ||
    speaking ||
    !audioQueue.length
  ) return;

  const text = audioQueue.shift();

  ding.currentTime = 0;
  ding.volume = 1;

  ding.play().catch(() => {});

  setTimeout(() => {
    speak(text);
  }, 700);
}

export function announce(text) {

  // FIX #8: drop oldest entry if queue is full to prevent stale backlog
  if (audioQueue.length >= MAX_QUEUE) {
    audioQueue.shift();
  }

  audioQueue.push(text);

  processQueue();
}

export function isAudioUnlocked() {
  return audioUnlocked;
}