import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    console.log(authHeader);
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403).json({message: "token is incorrect"});
      }
      // console.log(user);
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401).json({message: "header is empty"});
  }
};

export {authenticateToken};