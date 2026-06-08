const modal =
  document.getElementById("patientModal");

const patientInput =
  document.getElementById("patientName");

let selectedDoctor = "";

export function openPatientModal(code) {

  selectedDoctor = code;

  modal.style.display = "flex";

  patientInput.value = "";

  patientInput.focus();
}

export function closePatientModal() {

  modal.style.display = "none";
}

export function getSelectedDoctor() {
  return selectedDoctor;
}

export function getPatientName() {

  return patientInput.value.trim();
}