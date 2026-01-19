const jwt = require("jsonwebtoken");

exports.authentication = (req, res, next) => {
  const token = req.headers["authorization"]; // "Bearer token..."

  if (!token) {
    return res.status(401).json({ message: "Token topilmadi, iltimos login qiling" });
  }

  try {
    // "Bearer " so'zini olib tashlaymiz
    const haqiqiyToken = token.split(" ")[1];
    const decoded = jwt.verify(haqiqiyToken, process.env.JWT_SECRET);
    
    req.user = decoded; // User ma'lumotlarini requestga ulaymiz {id, role}
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz" });
  }
};