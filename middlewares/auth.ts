import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Étendre l'interface Request pour inclure la propriété auth
declare module 'express-serve-static-core' {
  interface Request {
    auth?: string;
  }
}

// Interface pour le token décodé
interface DecodedToken {
    VisiteurId: string;
}

// le middleware vérifie si l'utilisateur est authentifié
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error('Authorization header is missing.');
      }
  
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
  
      req.auth = decodedToken.VisiteurId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized request' });
    }
  };