const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    dailyGoal: {
      type: Number,
      default: 2000,
    },
    weight: {
      type: Number,
      default: 68,
    },
    wakeTime: {
      type: String,
      default: "07:00",
    },
    bedTime: {
      type: String,
      default: "23:00",
    },
    gender: {
      type: String,
      default: "male",
    },
    workType: {
      type: String,
      default: "desk",
    },
    healthCondition: {
      type: String,
      default: "normal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);