// Unified modal system — all modals use the .open CSS class.
// openModal / closeModal handle backdrop + content animation together.

export function openModal(id) {
  document.getElementById(id).classList.add("open");
}

export function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

// Wire up all [data-close] buttons and backdrop clicks declaratively.
// Call this once on startup.
export function initModalClosers() {

  // close buttons inside modals
  document.querySelectorAll(".modal-close[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.dataset.close);
  });

  // backdrop click closes
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // Escape key closes any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.open").forEach(m => {
      closeModal(m.id);
    });
  });
}