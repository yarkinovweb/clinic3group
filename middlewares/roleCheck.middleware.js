exports.rolecheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Sizga bu amalni bajarishga ruxsat yo'q (Role Error)" 
      });
    }
    next();
  };
};