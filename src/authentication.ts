import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error('Enviroment variables not defined');
}

export default {

    /**
    * Verifies the JWT token from the request headers.
    * -
    * @param next - The next function to call if the token is valid.
    */
    verifyJWT: async (req: Request, res: Response, next: NextFunction) => {
        if (!req?.headers?.['x-access-token']
            && !req.signedCookies?.cookie) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            }); return;
        }
        const token = req.headers['x-access-token']
            ? req.headers['x-access-token']
            : req.signedCookies.cookie;
        try {
            jwt.verify(token as string, JWT_SECRET!);
            next();
        } catch (error: any) {
            console.error('Error validating JWT:', error.message);
            const statusCode = error.status || 401;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to validate JWT',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Verifies the provided JWT token.
     * -
     * @param token - The JWT token to verify.
     */
    verifyToken: (token: string): JwtPayload => {
        try {
            return jwt.verify(token, JWT_SECRET!) as JwtPayload;
        } catch (error: any) {
            console.error(error.message || error);
            throw new Error('Invalid or expired token');
        }
    },
};
