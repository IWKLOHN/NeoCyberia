import jwt from 'jsonwebtoken';

const authJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    try {
        if(!token){
            throw new Error('Unauthorized');
        }
        const user = jwt.verify(token, "jwt-secret-key");
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden', error });
    }
};

export { authJwt };