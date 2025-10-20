import axios from "axios";

/**
 * Schedules a reminder message after a given delay (in ms).
 */
export function scheduleReminder(space, task, delay) {
  console.log(`⏰ Scheduling reminder in ${delay / 1000}s for: ${task}`);

  setTimeout(async () => {
    try {
      // Send reminder to the chat space
      await axios.post(
        `https://chat.googleapis.com/v1/${space}/messages`,
        { text: `⏰ Reminder: ${task}` },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`✅ Reminder sent: ${task}`);
    } catch (err) {
      console.error("❌ Failed to send reminder:", err.response?.data || err.message);
    }
  }, delay);
}
