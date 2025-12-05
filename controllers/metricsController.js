const db = require('../config/db');

exports.getUserMetrics = async (request, response) => {
    try {
        const userId = request.user.id; // Get user ID from the authenticated request
        const [rows] = await db.query(
            'SELECT login_count, last_login FROM users WHERE id = ?', [userId]);
        
        if (rows.length > 0) {
            response.json(rows[0]);
        } else {
            response.status(404).json({ message: 'Metrics could not found' });
        }
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAdminMetrics = async (request, response) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS total_users, login_count, last_login FROM users');
        response.json(rows[0]);
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};