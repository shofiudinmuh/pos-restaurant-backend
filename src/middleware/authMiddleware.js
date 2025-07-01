const jwt = require('jsonwebtoken');
const { User, Role, RolePermission, Permission } = require('../models');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            where: { user_id: decoded.user_id },
            include: [
                {
                    model: Role,
                    attributes: ['name'],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = {
            user_id: user.user_id,
            username: user.username,
            role_id: user.role_id,
            role_name: user.Role?.name,
            outlet_id: user.outlet_id,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Authentication failed' });
    }
};

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // check if the permission exists
            const permissionExist = await Permission.findOne({
                where: { name: permission },
            });
            if (!permissionExist) {
                return res.status(400).json({
                    message: `Permission ${permission} does not exist`,
                });
            }

            // check if the user has the required permission
            const hasPermission = await RolePermission.findOne({
                where: {
                    role_id: req.user.role_id,
                    permission_id: permissionExist.permission_id,
                },
                include: [
                    {
                        model: Permission,
                        // where: { name: permission },
                        attributes: ['name'],
                    },
                ],
            });

            // console.log('User permissions: ', JSON.stringify(hasPermission, null, 2));

            if (!hasPermission) {
                return res.status(403).json({
                    // message: `Insufficient permissions: ${permission} required`,
                    message: `Role ${req.user.role_id} lacks permission: ${permission}`,
                    required_permission: permission,
                    user_role: req.user.role_name,
                    user_role_name: req.user.role_name,
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Permission verification failed' });
        }
    };
};

module.exports = {
    verifyToken,
    checkPermission,
};
