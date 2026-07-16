const express = require("express");

const screenerRoutes = require("./routes/screenerRoutes");
const startScheduler = require("./services/schedulerService");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/screener", screenerRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("Crypto Screener Running...");
});

// Start Server
app.listen(PORT, () => {
    console.log("======================================");
    console.log(`Server Running on Port ${PORT}`);
    console.log("======================================");

    // Start Auto Scanner
    startScheduler();
});