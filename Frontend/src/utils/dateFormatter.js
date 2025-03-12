export function formatDateToLocal(dateString) {
    const date = new Date(dateString);  // Parse the ISO 8601 string into a Date object
    
    // Format the date to DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');     // Ensure 2 digits for the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const year = date.getFullYear();                           // Get the full year
    
    // Format the time to HH:MM:SS
    const hours = String(date.getHours()).padStart(2, '0');     // Ensure 2 digits for hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure 2 digits for seconds
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;  // Return the formatted date and time
  }
  