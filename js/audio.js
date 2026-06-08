let audioUnlocked = false;

const audioQueue = [];

let speaking = false;

const ding =
  new Audio("./assets/ding.mp3");

let voices = [];

voices =
  speechSynthesis.getVoices();

// unlock audio
document.addEventListener("click", () => {

  const t =
    new Audio("./assets/ding.mp3");

  t.volume = 0;

  t.play().then(() => {

    audioUnlocked = true;

    console.log("🔊 Audio unlocked");

    window.dispatchEvent(
      new Event("audio-ready")
    );
  });

}, { once: true });

speechSynthesis.onvoiceschanged = () => {

  voices =
    speechSynthesis.getVoices();
};

function getFemaleVoice() {

  const preferred = [

    "Microsoft Zira",

    "Google US English",

    "Samantha"
  ];

  for (const name of preferred) {

    const found = voices.find(v =>
      v.name.includes(name)
    );

    if (found) return found;
  }

  return voices.find(
    v => v.lang.includes("en")
  ) || voices[0];
}

function speak(text) {

  const msg =
    new SpeechSynthesisUtterance(text);

  msg.lang = "en-US";

  msg.voice =
    getFemaleVoice();

  msg.rate = 0.82;

  msg.pitch = 1.05;

  msg.volume = 1;

  msg.onend = () => {

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

  const text =
    audioQueue.shift();

  ding.currentTime = 0;

  ding.play().catch(() => {});

  setTimeout(() => {
    speak(text);
  }, 700);
}

export function announce(text) {

  audioQueue.push(text);

  processQueue();
}

export function isAudioUnlocked() {
  return audioUnlocked;
}