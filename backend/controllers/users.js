const { models } = require("../config/dbConnection");
const { hashPassword, decryptValue, encryptValue, getCurrentDate, verifyToken } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    try {
        const { email, password, name, role = 'user' } = req.body;

        // 2. Check if email already exists
        const existingUser = await models.users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered', status: "error" });
        }

        // 3. Hash password
        const hashedPassword = await hashPassword(password, 10);

        // 4. Create user
        let newUser = await models.users.create({
            email,
            password: hashedPassword,
            name,
            role,
            isActive: false
        });
        // ✅ Fetch email template
        const emailTask = await models.emailTasks.findOne({ where: { name: 'user_verification' } });
        if (!emailTask) {
            console.warn('Email task template not found: user_verification');
        } else {
            const protocol = req.protocol; // http or https
            const host = req.get('host');  // domain:port (e.g., localhost:3000 or yourdomain.com)
            const token = encryptValue(newUser.id.toString());
            const verificationLink = `${protocol}://${host}/auth/verify/${encodeURIComponent(token)}`;

            // ✅ Store mail in mailsmaster queue
            await models.mailsmaster.create({
                to: email,
                subject: 'Please verify your email',
                taskId: emailTask.id,
                replaceContent: {
                    name: name,
                    verification_link: verificationLink
                },
                status: 'queued'
            });

            // Optionally: trigger background worker to send it
        }
        res.status(201).json({ message: 'User registered successfully', status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', status: "error" });

    };
};
async function verifyEmail(req, res) {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Missing verification token', status: "error" });
        }

        let userId;
        try {
            userId = decryptValue(decodeURIComponent(token));
        } catch (err) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const user = await models.users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isActive) {
            return res.status(200).json({ message: 'User already verified' });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully', status: "success" });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Internal server error', status: "error" });
    }
};
const validateUser = async (req, res) => {
    try {
        let { authorization } = req.headers;
        let token = authorization;
        token = token.slice(7, token.length).trimLeft();
        if (!token) {
            return res.status(401).json({ message: 'Invalid credentials', "status": "error" });
        };
        let data = verifyToken(token);
        if (data) {
            let count = await models.users.count({ where: { id: data.id } });
            if (count == 0) {
                return res.status(401).json({ message: 'Invalid credentials', "status": "error" });
            }
            return res.status(200).json({ message: "Valid user!", "status": "success" });
        } else {
            return res.status(401).json({
                status_code: "error",
                message: "Not allowed for access"
            });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', "status": "error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await models.users.findOne({ where: { email, isActive: true } });
        if (!user) {
            return res.status(401).json({ message: 'Email does not exists', "status": "error" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials', "status": "error" });
        }

        const expiresIn = 60 * 60 * 24 * 7; // 1 hour or 1 week
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn
        });
        user.last_login = getCurrentDate();
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            },
            token,
            expires_in: expiresIn,
            "status": "success"
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', status: "error" });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    login,
    validateUser
};