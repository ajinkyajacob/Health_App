import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction} from "express";
import { error } from "console";


export default function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  let token = '';
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if(token){
    
    verify(token, process.env.ACCESS_TOKEN_SECRET ?? '', (error, decoded) => {
      if (error) {
        res.status(401);
        throw new Error('User not authorized');
      }
      console.log(decoded);
      (req as any).user = typeof decoded !== 'string'? decoded?.user: ''
      return next()
    });
  }else{
    res.status(401)
    throw new Error('Token not found')
  }
}
