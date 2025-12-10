const db = require('../config/db');

exports.checkHealth = async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.status(200).json({
            status: 'UP',
            message: 'Server and Database are healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime() + ' seconds'
        });

    } catch (error) {
        console.error('Health Check Failed:', error);
        res.status(503).json({
            status: 'DOWN',
            message: 'Database connection failed',
            error: error.message
        });
    }
};