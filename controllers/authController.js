const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;
    console.log(`Register attempt for: ${email}`);

    if (!email || !password || !name || !confirmPassword) {
        return response.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return response.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
        return response.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
        return response.status(400).json({ message: 'Password must contain at least one number' });
    }

    try{
        // Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return response.status(409).json({ message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database (do not store confirmPassword)
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword]
        );

        console.log(`User registered successfully: ${email}`);
        response.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during registration:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (request, response) => {
    const { email, password } = request.body;
    console.log(`Login attempt for: ${email}`);

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.warn(`Login fallido: User not found (${email})`);
            return response.status(401).json({ message: 'Invalid email' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.warn(`Login fail: Password incorrect (${email})`);
            return response.status(401).json({ message: 'Invalid password' });
        }

        await db.query(
            'UPDATE users SET login_count = login_count + 1, last_login = NOW() WHERE id = ?', 
            [user.id]
        );

        console.log(`Successful login: ${email} (Role: ${user.role})`);

        // Generate JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                role: user.role
            },
                process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN 
            }
        );

        // Return token
        response.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Error during login:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
};

exports.me = async (request, response) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, login_count, last_login, role FROM users WHERE id = ?',
            [request.user.id]
        );

        if (users.length === 0) {
            return response.status(404).json({ message: 'User not found' });
        }

        response.json(users[0]);

    } catch (error) {
        return response.status(500).json({ message: 'Internal server error' });
    }
};