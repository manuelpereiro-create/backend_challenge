const db = require('../config/db');

exports.getUserMetrics = async (request, response) => {
    try {
        const userId = request.user.id; // Get user ID from the authenticated request
        const [rows] = await db.query(
            'SELECT login_count, last_login FROM users WHERE id = ?', [userId]);
        
        if (rows.length > 0) {
            console.log('User Metrics Data:', rows[0]);
            response.json(rows[0]);
        } else {
            response.status(404).json({ message: 'Metrics could not found' });
        }
    } catch (error) {
        console.error('Error en User Metrics:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAdminMetrics = async (request, response) => {
    try {
        const [rows] = await db.query(
            `SELECT  
                last_login, 
                login_count,
                (SELECT COUNT(*) FROM users) AS total_users, 
                (SELECT SUM(login_count) FROM users) AS total_system_logins 
            FROM users 
            WHERE id = ?`, 
            [request.user.id]
        );
        console.log('Admin Metrics Data:', rows[0]);
        response.json(rows[0]);
    } catch (error) {
        console.error('Error en Admin Metrics:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
};