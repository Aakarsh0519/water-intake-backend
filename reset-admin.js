require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/water-tracker";

async function reset() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "sdy57337@gmail.com";
    const newPassword = "admin123";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { 
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin",
        dailyGoal: 2000
      },
      { new: true, upsert: true }
    );

    console.log(`Password reset for ${user.email} with role: ${user.role}`);
    console.log(`New password: ${newPassword}`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

reset();