import { toast } from 'react-toastify';

export const notify = (message, type = "info") => {
  // Check if message exists
  if (message) {
    toast(message, { type });
  } else {
    console.error("No message provided for the toast!");
  }
};
