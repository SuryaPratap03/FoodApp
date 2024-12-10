import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

export const VerifyToken = (req, res, next) => {
    const token = req.cookies['token']; // No need for await
    if (!token) {
        return res.status(401).json({ message: 'No token found, authorization denied.' });
    }

    const secretKey = process.env.SECRETKEY;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token, authorization denied.' });
        }
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};
