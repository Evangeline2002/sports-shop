const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { firebaseAdminConfig } = require('../config/firebaseAdmin');

admin.initializeApp(firebaseAdminConfig);

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            const isValidPassword = await admin.auth().verifyIdToken(userRecord.uid);

            if (isValidPassword) {
                const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Authentication failed', error });
        }
    },

    verifyToken: (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.userId = decoded.uid;
            next();
        });
    }
};

module.exports = authController;