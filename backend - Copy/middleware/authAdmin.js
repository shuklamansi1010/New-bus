
import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const atoken = req.headers.atoken;
        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        // decoded contains: { email: "...", iat: ... }
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
};

export default authAdmin;
