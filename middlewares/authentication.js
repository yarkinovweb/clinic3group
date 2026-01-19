const jwt = require("jsonwebtoken");

exports.authentication = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Tokenni yozmabsanu ukam, esing qaga ketdi" });
  }

  try {
    const token = token.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Tokenning xato ekan, xatobosh" });
  }
};