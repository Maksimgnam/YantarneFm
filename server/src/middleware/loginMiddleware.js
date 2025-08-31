const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

exports.loginMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token" });
  
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
  
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.user = decoded;
      next();
    });
};
