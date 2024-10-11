export const convertToDate = (time: string): Date => {
  // Split the time string into hours and minutes
  const [hourStr, minuteStr] = time.split(":");
  const hours = parseInt(hourStr, 10); // Parse hours from string
  const minutes = parseInt(minuteStr, 10); // Parse minutes from string

  // Create a new Date object for today's date
  const date = new Date();

  // Set hours and minutes directly from the parsed values
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0); // Optional: Set seconds to 0 for accuracy
  date.setMilliseconds(0); // Optional: Set milliseconds to 0 for accuracy

  return date;
};

export const formatTime = (date: Date) => {
  const hours = date.getHours(); // Get hours (0-23)
  const minutes = date.getMinutes(); // Get minutes (0-59)

  // Format hours and minutes to always be two digits
  const formattedHours = String(hours).padStart(2, "0"); // Ensures two digits
  const formattedMinutes = String(minutes).padStart(2, "0"); // Ensures two digits

  return `${formattedHours}:${formattedMinutes}`;
};
