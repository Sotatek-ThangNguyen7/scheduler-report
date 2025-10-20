import express from "express";
import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const FILE_URL = process.env.FILE_URL;
const CHAT_SPACE = process.env.CHAT_SPACE;
const TIMEZONE = process.env.TIMEZONE || "Asia/Bangkok";

async function sendChatMessage(space, message) {
  try {
    await axios.post(
      `https://chat.googleapis.com/v1/${space}/messages`,
      { text: message },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(`✅ Message sent to ${space}: ${message}`);
  } catch (err) {
    console.error("❌ Failed to send message:", err.response?.data || err.message);
  }
}

// Run at 9:00 AM GMT+7 (Mon–Fri)
cron.schedule(
  "0 9 * * 1-5",
  async () => {
    const message = `Dear team, please update your daily report on this file ${FILE_URL}`;
    await sendChatMessage(CHAT_SPACE, message);
  },
  { timezone: TIMEZONE }
);

app.get("/", (req, res) => res.send("✅ Daily reminder bot is running"));
app.listen(10000, () => console.log("🚀 Server started on port 10000"));
