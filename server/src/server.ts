import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import BaseRouter from './routes/api';
import logger from 'jet-logger';
import EnvVars from '@src/declarations/major/EnvVars';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import { NodeEnvs } from '@src/declarations/enums';
import { RouteError } from '@src/declarations/classes';


// **** Init express **** //

const app = express();


// **** Set basic express settings **** //

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.cookieProps.secret));

// Show routes called in console during development
if (EnvVars.nodeEnv === NodeEnvs.Dev) {
    app.use(morgan('dev'));
}

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
    app.use(helmet());
}


// **** Add API routes **** //

// Add APIs
app.use('/api', BaseRouter);

// Setup error handler
app.use((
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    logger.err(err, true);
    let status: number = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
        status = err.status as number;
    }
    return res.status(status).json({ error: err.message });
});


// **** Export default **** //

export default app;
