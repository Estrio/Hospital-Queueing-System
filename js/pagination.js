const ITEMS_PER_PAGE = 6;

let currentPage = 0;

export function getCurrentPageDoctors(
  doctors
) {

  const totalPages =
    Math.ceil(
      doctors.length /
      ITEMS_PER_PAGE
    );

  const start =
    currentPage *
    ITEMS_PER_PAGE;

  const end =
    start +
    ITEMS_PER_PAGE;

  const result =
    doctors.slice(start, end);

  currentPage++;

  if (currentPage >= totalPages) {
    currentPage = 0;
  }

  return result;
}