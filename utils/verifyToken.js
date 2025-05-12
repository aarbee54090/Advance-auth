import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.userId };
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};
