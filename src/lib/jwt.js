import jwt from 'jsonwebtoken';

// Ensure you have a secure, long random string for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_CHANGE_IN_PRODUCTION';

export function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email 
        }, 
        JWT_SECRET, 
        { 
            expiresIn: '7d' 
        }
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('JWT verification error:', error); // Log the error
        return null;
    }
}

export function decodeToken(token) {
    return jwt.decode(token);
}
