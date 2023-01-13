import { Router } from 'express';
import * as validator from 'express-validator';
import outletRoutes from './outlet-routes';


// **** Init **** //

const apiRouter = Router();

const outletRouter = Router();

// send nearest outlet
outletRouter.get(
    outletRoutes.paths.getOutlet,
    validator.query('address', 'Address required').isString().isLength({ min: 2 }),
    outletRoutes.getNearestOutlet,
);

apiRouter.use(outletRouter);

// **** Setup auth routes **** //


// **** Export default **** //

export default apiRouter;
