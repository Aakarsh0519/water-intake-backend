const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IntakeLog = require("../models/IntakeLog");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

// 1. GET all users with cumulative intake stats and log intervals count (Admin only)
router.get("/", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const logs = await IntakeLog.find({
          $or: [{ userId: u._id }, { user: u._id }],
        });
        const totalIntake = logs.reduce((sum, log) => sum + (log.amount || 0), 0);
        return {
          _id: u._id,
          email: u.email,
          role: u.role,
          dailyGoal: u.dailyGoal || 2000,
          totalIntake: totalIntake,
          totalLogsCount: logs.length, // Total intake intervals recorded for this user
        };
      })
    );
    res.json(usersWithStats);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 2. PUT update target goal for a specific user (Admin only)
router.put("/:id/goal", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  try {
    const { dailyGoal } = req.body;
    if (!dailyGoal || Number(dailyGoal) <= 0) {
      return res.status(400).json({ error: "Daily goal must be greater than 0" });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { dailyGoal: Number(dailyGoal) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update daily goal" });
  }
});

// 3. PUT update own profile and goal (Standard user)
router.put("/profile/goal", authenticateToken, async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) {
      return res.status(401).json({ error: "User identity not found in token" });
    }

    const { dailyGoal, weight, wakeTime, bedTime, gender, workType, healthCondition } = req.body;
    const updateData = {};

    if (dailyGoal) updateData.dailyGoal = Number(dailyGoal);
    if (weight) updateData.weight = Number(weight);
    if (wakeTime) updateData.wakeTime = String(wakeTime);
    if (bedTime) updateData.bedTime = String(bedTime);
    if (gender) updateData.gender = String(gender);
    if (workType) updateData.workType = String(workType);
    if (healthCondition) updateData.healthCondition = String(healthCondition);

    const updated = await User.findByIdAndUpdate(uid, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "User record not found in database" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message || "Failed to update profile goal" });
  }
});

// 4. DELETE a user account (Admin only)
router.delete("/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  try {
    const adminId = String(getUserId(req));
    if (adminId === String(req.params.id)) {
      return res.status(403).json({ error: "You cannot delete your own admin account" });
    }
    await IntakeLog.deleteMany({
      $or: [{ userId: req.params.id }, { user: req.params.id }],
    });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User account and logs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;