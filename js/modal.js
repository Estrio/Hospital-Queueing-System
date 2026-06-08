// Single modal system using CSS .open class (consistent with index.css)
// FIX #11: removed dual modal system — modal.js is the only modal handler

const modalEl    = document.getElementById("patientModal");
const inputEl    = document.getElementById("patientName");
const subEl      = document.getElementById("modalSub");

let _code = "";

export function setModalDoctor(code, name, specialty, room) {
  _code = code;
  subEl.textContent =
    `Dr. ${name} · ${specialty} · Room ${room}`;
}

export function openModal() {
  inputEl.value = "";
  modalEl.classList.add("open");
  // delay focus so the transition doesn't jank
  setTimeout(() => inputEl.focus(), 80);
}

export function closeModal() {
  modalEl.classList.remove("open");
}

export function getModalValues() {
  return {
    patientName: inputEl.value.trim(),
    code: _code
  };
}