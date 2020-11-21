import express from 'express'
import { Application } from 'express'

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

    }

    private handle404(): void{

    }

    private handleRoutes(): void{

    }

    private initializeMiddleWares(): void{

    }

    public startListening(): void{
        const port: number = this._port;
        this._app.listen(port,function markTheStart(){
            console.log(`listening on port ${port}`);
        });
    }

}