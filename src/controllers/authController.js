const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Session, Token } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role_id, outlet_id } = req.body;

        if (!username || !password || !role_id || !outlet_id) {
            return ApiResponse.validationError(res, 'All fields are required!');
        }
        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            user_id: uuidv4(),
            username,
            email,
            password_hash,
            role_id,
            outlet_id,
        });

        await activityLogService.logActivity(
            user.user_id,
            'register_user',
            'users',
            user.user_id,
            `Created user ${username}`
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: { user_id: user.user_id, username },
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username },
            include: ['Role'],
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { user_id: user.user_id, role_id: user.role_id, outlet_id: user.outlet_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });

        const session = await Session.create({
            session_id: uuidv4(),
            user_id: user.user_id,
            device_info: req.headers['user-agent'],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            is_active: true,
        });

        await Token.create({
            token_id: uuidv4(),
            user_id: user.user_id,
            session_id: session.session_id,
            token: refreshToken,
            type: 'refresh',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await activityLogService.logActivity(
            user.user_id,
            'login',
            'sessions',
            session.session_id,
            `User ${username} logged in`
        );

        res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return ApiResponse.error(res, 'Refresh token required', 400);
        }

        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const tokenRecord = await Token.findOne({
            where: { token: refreshToken, type: 'refresh', revoked: false },
        });

        if (!tokenRecord) {
            return ApiResponse.error(res, 'Invalid or revoked refresh token', 401);
        }

        const user = await User.findByPk(decode.user_id);
        if (!user) {
            return ApiResponse.error(res, 'User not found', 404);
        }

        const newAccessToken = jwt.sign(
            { user_id: user.user_id, role_id: user.role_id, outlet_id: user.outlet_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        await activityLogService.logActivity(
            user.user_id,
            'refresh-token',
            'tokens',
            tokenRecord.token_id,
            'Refreshed access token'
        );

        return ApiResponse.success(
            res,
            { accessToken: newAccessToken },
            'Token refreshed successfully'
        );
    } catch (error) {
        next(error);
    }
};
