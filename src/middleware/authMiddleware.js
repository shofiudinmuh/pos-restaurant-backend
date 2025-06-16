const jwt = require('jsonwebtoken');
const { User, Role, RolePermission, Permission } = require('../models');

exports.permissionToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            where: { user_id: decode.user_id },
            include: [{ model: Role, attribute: ['name'] }],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.checkPermission = async (permission) => {
    return async (req, res, next) => {
        try {
            const hasPermission = await RolePermission.findOne({
                where: {
                    role_id: req.user.role_id,
                },
                include: [
                    {
                        model: Permission,
                        where: { name: permission },
                    },
                ],
            });

            if (!hasPermission) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
