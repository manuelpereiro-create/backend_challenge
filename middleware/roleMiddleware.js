module.exports = (request, respone, next) => {
    if (request.user.role !== 'admin') {
        return respone.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};