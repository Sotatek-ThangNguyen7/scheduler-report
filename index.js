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

async function sendChatMessage(message) {
  try {
    await axios.post(
      process.env.WEBHOOK_URL,
      { text: message },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(`✅ Message sent: ${message}`);
  } catch (err) {
    console.error("❌ Failed to send message:", err.response?.data || err.message);
  }
}

// run every weekday at 9:15 AM
cron.schedule(
  "15 9 * * 1-5", // minute=15, hour=9, Monday–Friday
  async () => {
    const message = `Dear team, please update your daily report on this file ${FILE_URL}`;
    await sendChatMessage(message);
  },
  { timezone: TIMEZONE }
);


app.get("/", (req, res) => res.send("✅ Daily reminder bot is running"));
app.listen(10000, () => console.log("🚀 Server started on port 10000"));
