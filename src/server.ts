import { v4 as uuidv4 } from 'uuid';
import express, {
    Application, Request, Response, NextFunction,
} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fileSystem from 'fs';
import helmet from 'helmet';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import authentication from './authentication';
import router from './routes';

dotenv.config();
const mediaFilesPath = path.join(__dirname, 'assets/shared');
const server: Application = express();

const storage: StorageEngine = multer.diskStorage({
    destination(_req, _file: Express.Multer.File, callback) {
        callback(null, mediaFilesPath);
    },
    filename(_req, file: Express.Multer.File, callback) {
        callback(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    limits: {
        files: 15,
        fileSize: 50 * 1024 * 1024,
    },
    storage,
    fileFilter(_req, file, callback) {
        if (!process.env.SUPPORTED_MIME_TYPES!.split(',').includes(file.mimetype)) {
            callback(new Error('Unsupported file type'));
            return;
        }
        callback(null, true);
    },
});

server.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        return callback(null, origin);
    },
}));
server.use(cookieParser(process.env.JWT_SECRET));
server.set('trust proxy', true);
server.use(
    '/sharedFiles',
    authentication.verifyJWT,
    express.static(mediaFilesPath),
);
server.use(express.json({
    inflate: true,
    limit: '1mb',
    strict: true,
    type: 'application/json',
}));
server.use(helmet({
    frameguard: {
        action: 'deny',
    },
    hsts: {
        includeSubDomains: true,
        maxAge: 31536000,
        preload: true,
    },
    referrerPolicy: {
        policy: 'no-referrer',
    },
    xssFilter: true,
}));
express.urlencoded({ extended: true });
server.use('/api', router);

server.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
});

server.use((_req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

const { PORT } = process.env || 3000;
server.listen(PORT, () => {
    console.info(`Server is running on port: ${PORT}`);
});

server.get('/sharedFiles/download/:file', (req: Request, res: Response) => {
    try {
        if (!req?.params?.file || !req.signedCookies?.cookie) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            }); return;
        }
        if (!authentication
            .verifyToken(req.signedCookies.cookie)) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            }); return;
        }

        const filePath = path.join(mediaFilesPath, req.params.file);
        if (!fileSystem.existsSync(filePath)) {
            res.status(404).json({
                error: 'No such file or directory',
            }); return;
        }
        res.download(filePath);
    } catch (error: any) {
        console.error('Error downloading file:', error.message);
        const statusCode = error.status || 500;
        const errorDetails = {
            details: error.message || 'An unexpected error occurred',
            error: 'Failed to download file',
        };
        res.status(statusCode).json(errorDetails);
    }
});

export default upload;
