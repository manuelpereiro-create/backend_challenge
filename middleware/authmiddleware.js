const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();

    } catch (error) {
        return response.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};