import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === "admin") {
        req.user = decoded;
        next();
      } else {
        res.status(401).json({ message: "Not authorized, invalid token" });
      }
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else if (req.headers.cookie && req.headers.cookie.includes("adminToken")) {
    try {
      token = req.headers.cookie.split("adminToken=")[1].split(";")[0];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === "admin") {
        req.user = decoded;
        next();
      } else {
        res.status(401).json({ message: "Not authorized, invalid token" });
      }
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
