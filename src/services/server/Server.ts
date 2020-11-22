import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import {
    authRouter,
    tenentRouter,
    clientRouter,
    subjectRouter,
    logRouter
} from './routes'
import isAdmin from './middlewares/isAdmin';

export default class Server{

    private _port: number;
    private _app: Application;

    constructor(port: number){
        this._port = port;
        this._app = express();

        this.initializeMiddleWares();
        this.handleRoutes();
        this.handle404();
        this.handleErrors();
    }

    private handleErrors(): void{
        this._app.use(function respondError(err: Error,req: Request, res: Response, next: NextFunction) {
            const message = err.message || "UNEXPECTED ERROR";
            const status = err.status || 500;
            res.status(status).json({
                message 
            });
        })
    }

    private handle404(): void{
        this._app.use(function handleNotFound(req: Request,res: Response, next: NextFunction) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        })
    }

    private handleRoutes(): void{
        this._app.use('/tenent',isAdmin,tenentRouter);
        this._app.use('/client/:tenentId',isAdmin,clientRouter);
        this._app.use('/subject/:tenentId/:clientId',subjectRouter);
        this._app.use('/log/:tenentId/:clientId',logRouter);
        this._app.use('/auth/:tenentId/:clientId',authRouter);
    }

    private initializeMiddleWares(): void{
        this._app.use(bodyParser.json());
        this._app.use(cors());
        // TO-DO : rate limiting
        // TO-DO : request size limitation
        // TO-DO : multer ??
    }

    public startListening(): void{
        const port: number = this._port;
        this._app.listen(port,function markTheStart(){
            console.log(`listening on port ${port}`);
        });
    }

}