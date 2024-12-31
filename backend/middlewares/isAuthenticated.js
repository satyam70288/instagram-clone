import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Safely retrieve the token
        let token = req.cookies?.token;

        if (!token && req.headers?.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        console.log("Token:", token); // Debug log to check token

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }

        // Attach user ID to req
        req.id = decoded.userId;
        next();

    } catch (error) {
        console.error('Authentication Error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token has expired',
                success: false
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }

        return res.status(500).json({
            message: 'Internal server error during authentication',
            success: false
        });
    }
};

export default isAuthenticated;
