/**
 * Takes a date format and converts it to a date that is easier for users to read.
 * @param {string} dateString - takes in a date in a certain format
 * @returns {string}
 */
export default function formatDate(dateString) {
  if (!dateString) {
    return "Date un-available";
  }
  try {
    const date = new Date(dateString); // JavaScript's Date object can parse ISO 8601

    if (isNaN(date.getTime())) {
      return "Date un-available"; // Handle invalid dates
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Date un-available"; // Handle parsing errors
  }
}
