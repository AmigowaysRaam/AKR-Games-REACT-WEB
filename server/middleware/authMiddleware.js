const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT");

  try {
    const authHeader = req.headers.authorization;
    console.log("HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    req.user = decoded;
    console.log("AUTH MIDDLEWARE RUNNING");

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};