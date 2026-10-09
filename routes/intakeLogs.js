const express = require("express");
const router = express.Router();
const IntakeLog = require("../models/IntakeLog");
const User = require("../models/User");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Helper to safely extract user ID from JWT payload
const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

// 1. Log water intake for the logged-in user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const intakeAmount = Number(amount);

    if (!intakeAmount || intakeAmount <= 0) {
      return res.status(400).json({ error: "Intake amount must be greater than 0" });
    }

    const uid = getUserId(req);
    if (!uid) {
      return res.status(401).json({ error: "User identity not found in token. Please log in again." });
    }

    // Set both userId and user so whichever your Mongoose schema requires passes validation
    const log = new IntakeLog({
      userId: uid,
      user: uid,
      amount: intakeAmount,
      date: new Date(),
    });

    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error("Log creation error details:", err);
    res.status(500).json({ error: err.message || "Failed to record intake" });
  }
});

// 2. Get today's total intake and today's logs
router.get("/today", authenticateToken, async (req, res) => {
  try {
    const uid = getUserId(req);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [logs, user] = await Promise.all([
      IntakeLog.find({
        $or: [{ userId: uid }, { user: uid }],
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ date: -1 }),
      User.findById(uid),
    ]);

    const totalIntake = logs.reduce((sum, log) => sum + (log.amount || 0), 0);
    const dailyGoal = user?.dailyGoal || 2000;

    res.json({
      totalIntake,
      dailyGoal,
      logs,
    });
  } catch (err) {
    console.error("Today intake error:", err);
    res.status(500).json({ error: "Failed to fetch today's data" });
  }
});

// 3. Get full history of intake logs
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const uid = getUserId(req);
    const logs = await IntakeLog.find({
      $or: [{ userId: uid }, { user: uid }],
    }).sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch intake history" });
  }
});

// 4. Delete a logged entry (only owner can delete)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const uid = String(getUserId(req));
    const log = await IntakeLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: "Log entry not found" });
    }

    const logOwner = String(log.userId || log.user);
    if (logOwner !== uid) {
      return res.status(403).json({ error: "Unauthorized to delete this entry" });
    }

    await IntakeLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Intake entry deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete log entry" });
  }
});

// 5. Admin route: Get intake logs for a specific user
router.get("/user/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  try {
    const targetId = req.params.id;
    const logs = await IntakeLog.find({
      $or: [{ userId: targetId }, { user: targetId }],
    }).sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    console.error("Inspect user fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
});

module.exports = router;