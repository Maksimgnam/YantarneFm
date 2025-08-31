const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const SECRET = process.env.JWT_SECRET


exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const admin = await Admin.findOne({ username });
      if (!admin) {
        console.log("Admin not found");
        return res.status(401).json({ message: "Invalid username" });
      }
  
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        console.log("Password mismatch"); 
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ role: "admin", username },SECRET , { expiresIn: "1h" });
  
      console.log("Token generated:", token); 
  
      return res.json({ token }); 
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
// GET /api/admin (protected)
exports.getAdmin = (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, you are an admin!` });
};
