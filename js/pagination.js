const ITEMS_PER_PAGE = 6;

let currentPage = 0;

// FIX #3 & #6: split into two functions:
//   getCurrentPageDoctors — slices without advancing (safe to call any time)
//   advancePage           — advances the page (called only by the interval)
// This prevents Firestore snapshot updates from accidentally skipping pages.

export function getCurrentPageDoctors(doctors) {

  if (!doctors.length) return [];

  const totalPages =
    Math.max(1, Math.ceil(doctors.length / ITEMS_PER_PAGE));

  // clamp in case doctors list shrunk
  if (currentPage >= totalPages) {
    currentPage = 0;
  }

  const start = currentPage * ITEMS_PER_PAGE;
  const end   = start + ITEMS_PER_PAGE;

  return doctors.slice(start, end);
}

export function advancePage(doctors) {

  if (!doctors.length) return;

  const totalPages =
    Math.max(1, Math.ceil(doctors.length / ITEMS_PER_PAGE));

  currentPage++;

  if (currentPage >= totalPages) {
    currentPage = 0;
  }
}