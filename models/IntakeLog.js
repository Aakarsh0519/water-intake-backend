const mongoose = require("mongoose");

const intakeLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Water intake must be greater than 0"]
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IntakeLog", intakeLogSchema);
