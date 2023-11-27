import jwt from 'jsonwebtoken';

const middlewareJwt = (req, res, next) => {
    const jwtValue = req.headers.authorization
    if (!jwtValue) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try{
        const data = jwt.verify(jwtValue, "jwtsecretkey");
        next();
    }catch(error){
        return res.status(401).json({ message: "Unauthorized" });
    }
}


export { middlewareJwt}