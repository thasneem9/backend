import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) return res.status(401).json({ message: "Unauthorized no token" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;

		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
		  return res.status(401).json({ message: "Token has expired" });
		}
		res.status(500).json({ message: err.message });
		console.log("Error in protectRoute: ", err.message);
	}
};

export default protectRoute;
