import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Token is missing"
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized Access" });
            }
            req.userId = decoded.id;
            req.user = user;
            
            next();
            
        } catch (error) {
            if (error.message === "jwt expired") {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Token expired.",
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access! Invalid token.",
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
}