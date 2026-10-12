import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

// Load configuration before route modules read storage settings.
const { createApp } = await import("./app.js");

// Vercel owns the HTTP listener for this service.
export default createApp();
