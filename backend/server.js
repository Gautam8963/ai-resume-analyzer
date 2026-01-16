require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/interview", require("./routes/interview"));

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running", port: 5001 });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

// Database + Server start
// Force port 5001 if env var is missing or set to 5000 (common issue)
const PORT = process.env.PORT === '5000' ? 5001 : (process.env.PORT || 5001);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-platform';

console.log("🔄 Starting server...");
console.log(`ℹ️ Configured Port: ${PORT}`);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        app.listen(PORT, '0.0.0.0', () => {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log("🔐 JWT Authentication enabled");
            console.log("📡 CORS enabled for http://localhost:5173");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });