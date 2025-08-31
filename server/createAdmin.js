// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./src/models/Admin");

async function createAdmin() {
  await mongoose.connect(`mongodb+srv://andystep2008:44hjp0RpQUNxGO0a@database.hnvx486.mongodb.net/?retryWrites=true&w=majority&appName=database`);

  const hashedPassword = await bcrypt.hash("dealer", 10); // password = dealer
  const admin = new Admin({ username: "admin", passwordHash: hashedPassword });

  await admin.save();
  console.log("✅ Admin created:", admin.username);
  process.exit();
}

createAdmin();
